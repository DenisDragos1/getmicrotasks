const express=require("express");
const cors = require("cors");
const mysql=require("mysql");
const bodyParser = require("body-parser"); 
const session = require('express-session');
const cookieParser=require('cookie-parser');

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


const db=mysql.createConnection({
    host:"localhost",
    user:'root',
    password:'',
    database:'getmicrotasks'
})

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
/*
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
});*/
app.get('/microtasks',(req,res)=>{
  const sql="SELECT *FROM microtasks where user_id=@req.session.userId";
  db.query(sql,(err,data)=>{
      if(err) return res.json(err);
      return res.json(data);
  })
})

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
  


app.listen(8081,()=>{
    console.log("listtening on port 8081");
})