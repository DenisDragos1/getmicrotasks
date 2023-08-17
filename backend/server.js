const express=require("express");
const cors = require("cors");
const mysql=require("mysql");
const bodyParser = require("body-parser"); 
const session = require('express-session');
const cookieParser=require('cookie-parser');
const multer = require("multer");
const path = require('path');

const app=express();
app.use(cors({
    origin: ["http://localhost:5173"],
    methods:["POST","GET"],
    credentials: true 
  }));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
  secret: 'my-unique-secret-key-123!@#', 
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure:false,
    maxAge:1000*60*60*24
  }
}));
app.use('/backend/images', express.static(path.join(__dirname, 'images')));


const db=mysql.createConnection({
    host:"localhost",
    user:'root',
    password:'',
    database:'getmicrotask'
})
/*
const db = mysql.createConnection({
  host: 'fdb1032.awardspace.net',
  port: 3306,
  user: '4359767_getmicrotask',
  password: 'EkHD3EJ50C;.fJ.?',
  database: '4359767_getmicrotask'
});
*/
app.get('/users',(req,res)=>{
    const sql="SELECT *FROM users";
    db.query(sql,(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/microtasks',(req,res)=>{
    const sql="SELECT *FROM microtasks";
    db.query(sql,(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/microtasks/:id', (req, res) => {
  const taskId = req.params.id;

  const sql = "SELECT * FROM microtasks WHERE ID = ?"; // Aici presupun că coloana ID din tabelul microtasks este cea care stochează ID-ul unic al fiecărui task
  db.query(sql, [taskId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Eroare internă a serverului.' });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Microtask-ul nu a fost găsit.' });
    }

    const microtask = data[0]; // Având în vedere că ar trebui să fie doar un singur rezultat cu ID-ul specificat, luăm primul element din array-ul de rezultate

    return res.json(microtask);
  });
});


app.get('/mymicrotasks', (req, res) => {
  // Verificați dacă utilizatorul este autentificat și obțineți ID-ul sesiunii curente
  const userId = req.session.userId; // Asigurați-vă că aveți numele corect al proprietății din obiectul sesiunii

  if (!userId) {
    return res.status(401).json({ error: 'Utilizatorul nu este autentificat.' });
  }

  const sql = "SELECT * FROM microtasks WHERE user_id = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: 'Eroare internă a serverului.' });
    return res.json(data);
  });
});

app.get('/',(req,res)=>{

    return res.json("backend side");
})

app.post('/register', (req, res) => {
    const { nume, email, parola,tara } = req.body;
  
    // Exemplu de query pentru inserarea datelor în baza de date
    const sql = 'INSERT INTO users (nume, email, parola,tara) VALUES (?, ?, ?,?)';
    db.query(sql, [nume, email, parola,tara], (err, result) => {
      if (err) {
        console.error('Eroare la inserarea datelor în baza de date:', err);
        res.status(500).json({ message: 'Eroare la înregistrare.' });
      } else {
        console.log('Utilizatorul a fost înregistrat cu succes!');
        res.status(200).json({ message: 'Înregistrare reușită.' });
      }
    });
  });

  app.post("/login", (req, res) => {
    const { email, parola } = req.body;
  
    // Exemplu de query pentru verificarea credențialelor în baza de date
    const sql = "SELECT * FROM users WHERE email = ? AND parola = ?";
    db.query(sql, [email, parola], (err, result) => {
      if (err) {
        console.error("Eroare la interogarea bazei de date:", err);
        res.status(500).json({ message: "Eroare la autentificare." });
      } else if (result.length === 0) {
        console.log("Credențiale incorecte!");
        res.status(401).json({ message: "Email sau parolă incorecte!" });
      } else {
        // Stocați informații în sesiune după autentificare
        req.session.userId = result[0].ID; // Asumând că id este coloana cu id-ul utilizatorului în tabelul "users"
        req.session.userName=result[0].nume;
        console.log(req.session.userName);
        console.log(req.session.userId);
        console.log("Autentificare reușită!");
  
        // Trimite un răspuns de succes către frontend
        res.status(200).json({ message: "Autentificare reușită!" });
      }
    });
  });
  
  app.post("/logout", (req, res) => {
    // Distrugem sesiunea pentru a deconecta utilizatorul
    req.session.destroy((err) => {
      if (err) {
        console.error("Eroare la distrugerea sesiunii:", err);
        res.status(500).json({ message: "Eroare la deconectare." });
      } else {
        res.clearCookie("connect.sid"); // Ștergem cookie-ul de sesiune
        res.status(200).json({ message: "Deconectare reușită." });
      }
    });
  });
  
  
  app.get("/profile", (req, res) => {
    if (req.session.userId) {
      // Utilizatorul este autentificat, puteți afișa pagina de profil
      res.send("Pagina profilului utilizatorului autentificat");
    } else {
      // Utilizatorul nu este autentificat, redirecționați la pagina de login
      res.redirect("/login");
    }
  });

// Configurarea multer pentru încărcarea imaginilor
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'images')); // Imaginile vor fi salvate în folderul "images"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Restul codului tău

app.post('/submisions/:microtask_id', upload.single('submission_images'), (req, res) => {
  const { microtask_id } = req.params;
  const { submission_text } = req.body;
  const submission_images = req.file?.filename; // Utilizăm ? pentru a trata cazul în care req.file nu există
  const user_id = req.session.userId;
  const is_approved = 0;

  // Verificări și validări

  const sql = "INSERT INTO submissions (microtask_id, user_id, submission_text, submission_images, is_approved) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [microtask_id, user_id, submission_text, submission_images, is_approved], (err, result) => {
    if (err) {
      console.error('Error inserting submission:', err);
      return res.status(500).json({ error: 'Eroare internă a serverului.' });
    }

    return res.json({ message: 'Submision a fost înregistrat cu succes.' });
  });
});

  app.post("/createmicrotasks", (req, res) => {
    const { titlu, descriere, credite,credite1,timp,categorie, tara } = req.body;
  
    // Verificăm dacă utilizatorul este autentificat
    if (!req.session.userId) {
      return res.status(401).json({ message: "Utilizatorul nu este autentificat." });
    }
  
    // Preia ID-ul utilizatorului autentificat din sesiune
    const user_id = req.session.userId;

    let pozitii=credite/credite1;
    
    // Exemplu de query pentru inserarea datelor în baza de date
    const sql = 'INSERT INTO microtasks (titlu, descriere, credite,credite1,timp,pozitii,categorie, user_id, is_approved, tara) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?)';
    db.query(sql, [titlu, descriere, credite,credite1,timp,pozitii,categorie, user_id, 0, tara], (err, result) => {
      if (err) {
        console.error('Eroare la inserarea datelor în baza de date:', err);
        res.status(500).json({ message: 'Eroare la adăugarea microtask-ului.' });
      } else {
        console.log('Microtask-ul a fost adăugat cu succes!');
        res.status(200).json({ message: 'Microtask adăugat cu succes.' });
      }
    });
  });

  
  app.get("/getUsername", (req, res) => {
    // Verificați dacă sesiunea a fost complet actualizată
    req.session.reload((err) => {
      if (err) {
        console.error("Eroare la actualizarea sesiunii:", err);
        res
          .status(500)
          .json({ message: "Eroare la obținerea numelui utilizatorului." });
      } else if (req.session.userId) {
        const sql = "SELECT nume FROM users WHERE ID = ?";
        db.query(sql, [req.session.userId], (err, result) => {
          if (err) {
            console.error("Eroare la interogarea bazei de date:", err);
            res
              .status(500)
              .json({ message: "Eroare la obținerea numelui utilizatorului." });
          } else {
            const userName = result[0].nume;
            res.json({ userName });
          }
        });
      } else {
        res.status(401).json({ message: "Utilizatorul nu este autentificat." });
      }
    });
  });

  app.get('/mysubmissions', (req, res) => {
    const user_id = req.session.userId;
  
    const sql = "SELECT * FROM submissions WHERE user_id = ?";
    db.query(sql, [user_id], (err, results) => {
      if (err) {
        console.error('Error fetching submissions:', err);
        return res.status(500).json({ error: 'Eroare internă a serverului.' });
      }
  
      return res.json({ submissions: results });
    });
  });
  
  app.get('/viewsubmissions/:microtaskId', (req, res) => {
    const microtask_id = req.params.microtaskId;
  
    const sql = "SELECT * FROM submissions WHERE microtask_id = ?";
    db.query(sql, [microtask_id], (err, data) => {
      if (err) {
        console.error('Error fetching submissions:', err);
        return res.status(500).json({ error: 'Eroare internă a serverului.' });
      }
  
      return res.json(data);
    });
  });
  app.post('/updateSubmissionStatus/:submissionId', (req, res) => {
    const submissionId = req.params.submissionId;
    const newStatus = req.body.newStatus;
  
    try {
      // Aici vom efectua actualizarea în baza de date
      const sql = "UPDATE submissions SET is_approved = ? WHERE ID = ?";
      db.query(sql, [newStatus, submissionId], (err, result) => {
        if (err) {
          console.error('Error updating submission status:', err);
          return res.status(500).json({ error: 'An error occurred while updating submission status' });
        }
  
        // Verificăm dacă rândurile au fost afectate (actualizate) cu succes
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Submission not found' });
        }
  
        res.status(200).json({ message: 'Submission status updated successfully' });
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
      res.status(500).json({ error: 'An error occurred while updating submission status' });
    }
  });
/*
  app.post('respinge/:id',(req,res)=>{
    const submissionId = req.params.submissionId;
    const motiv_respingere=req.body;
    const is_approved=-1;
    try{
      const sql = "UPDATE submissions SET motiv_respingere = ? WHERE ID = ?";
      const sql1= "UPDATE submissions SET is_approved = ? WHERE ID = ?";
      db.query(sql,[motiv_respingere,submissionId],(err,result)=>{
        if(err)
        {
          console.error('Eroare la adugarea motivului de respingere',err);
          return res.status(500).json({ error: 'An error occurred while updating submission status' });
        }
        if(result.affectedRows==0)
        {
          return res.status(404).json({error: 'Submission not found'})
        }
        res.status(200).json({ message: 'Submission status updated successfully' });
      })
    }
    catch(error){
      console.error('Error updating submission status:', error);
      res.status(500).json({ error: 'An error occurred while updating submission status' });
    }
  })*/
  app.post('/respinge/:submissionId', (req, res) => {
    const submissionId = req.params.submissionId;
    const { motiv_respingere } = req.body;
    const is_approved = -1;
    
    try {
      const sql = "UPDATE submissions SET motiv_respingere = ?, is_approved = ? WHERE ID = ?";
      db.query(sql, [motiv_respingere, is_approved, submissionId], (err, result) => {
        if (err) {
          console.error('Eroare la adăugarea motivului de respingere', err);
          return res.status(500).json({ error: 'An error occurred while updating submission status' });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Submission not found' });
        }
        res.status(200).json({ message: 'Submission status updated successfully' });
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
      res.status(500).json({ error: 'An error occurred while updating submission status' });
    }
  });
  
  
  
 
app.listen(8081,()=>{
    console.log("listtening on port 8081");
})