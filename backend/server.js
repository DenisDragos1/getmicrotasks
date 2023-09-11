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

// Actualizarea valorii "expirat" în baza de date atunci când timpul expiră
app.post('/updateExpire/:submissionId', (req, res) => {
  const submissionId = req.params.submissionId;
  console.log(submissionId);
  // Verificați dacă utilizatorul este autentificat și dacă timpul a expirat (a se adapta la logica dvs.)
  if (!req.session.userId || !isTimeExpired(submissionId)) {
    return res.status(403).json({ error: 'Nu sunteți autorizat să efectuați această acțiune.' });
  }

  // Actualizați valoarea "expirat" în baza de date cu req.session.userId
  const sql = 'UPDATE microtasks SET expirat = ? WHERE ID = ?';
  db.query(sql, [req.session.userId, submissionId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Eroare internă a serverului' });
    }
    return res.status(200).json({ message: 'Actualizare reușită' });
  });
});


/*
app.get('/microtasks',(req,res)=>{
    const sql="SELECT *FROM microtasks";
    db.query(sql,(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})*/
app.get('/microtasks', (req, res) => {
  // Obțineți ID-ul utilizatorului conectat din sesiune (asumați că acesta este stocat în req.session.userId)
  const userId = req.session.userId;
  console.log(userId);
  // Interogare pentru a obține toate microtask-urile disponibile și ne-finalizate de către utilizatorul curent
  const sql = `
    SELECT *
    FROM microtasks
    WHERE ID NOT IN (
      SELECT microtask_id
      FROM submissions
      WHERE user_id = ? AND (expirat = 0 OR expirat IS NULL)
    )
  `;

  db.query(sql, [userId], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});



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



app.get('/submissions/:id', (req, res) => {
  const submissionId = req.params.id;

  const sql = "SELECT * FROM submissions WHERE ID = ?"; 
  db.query(sql, [submissionId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Eroare internă a serverului.' });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Submisiion-ul nu a fost găsit.' });
    }

    const submisions = data[0]; // Având în vedere că ar trebui să fie doar un singur rezultat cu ID-ul specificat, luăm primul element din array-ul de rezultate

    return res.json(submisions);
  });
});


app.get('/mymicrotasks', (req, res) => {
  // Verificați dacă utilizatorul este autentificat și obțineți ID-ul sesiunii curente
  const userId = req.session.userId; // Asigurați-vă că aveți numele corect al proprietății din obiectul sesiunii
  console.log(userId);
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
/*
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
  });*/
  app.post('/register', (req, res) => {
    const { nume, email, parola, tara } = req.body;
    function generateUniqueToken() {
      // Aici poți genera un token unic, de exemplu folosind librării precum uuid sau crypto
      // Exemplu cu uuid:
      const { v4: uuidv4 } = require('uuid');
      return uuidv4();
    }
    
    // Generarea unui token unic pentru confirmarea adresei de e-mail
    const confirmationToken = generateUniqueToken(); // Implementează această funcție

    // Exemplu de query pentru inserarea datelor în baza de date
    const sql = 'INSERT INTO users (nume, email, parola, tara, confirmationToken) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nume, email, parola, tara, confirmationToken], (err, result) => {
        if (err) {
            console.error('Eroare la inserarea datelor în baza de date:', err);
            res.status(500).json({ message: 'Eroare la înregistrare.' });
        } else {
            console.log('Utilizatorul a fost înregistrat cu succes!');

            // Trimite e-mailul de confirmare
            sendConfirmationEmail(email, confirmationToken); // Implementează această funcție

            res.status(200).json({ message: 'Înregistrare reușită.' });
        }
    });
});
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'wealthwisetips@gmail.com',
        pass: 'Seat.zetor1#'
    }
});

function sendConfirmationEmail(email, token) {
    const mailOptions = {
        from: 'wealthwisetips@gmail.com',
        to: email,
        subject: 'Confirmare adresă de e-mail',
        html: `<p>Apasă <a href="http://localhost:3000/confirm/${token}">aici</a> pentru a-ți confirma adresa de e-mail.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error(error);
        }
        console.log('E-mailul de confirmare a fost trimis cu succes:', info.response);
    });
}
app.get('/confirm/:token', (req, res) => {
  const token = req.params.token;

  // Găsește utilizatorul cu token-ul dat în baza de date
  // Dacă găsești un utilizator cu acest token, activează contul

  // Exemplu:
  // Actualizează starea contului și token-ul în baza de date
  // Resetează token-ul sau șterge-l, pentru a împiedica utilizarea ulterioară

  // Redirecționează către o pagină de succes
  res.redirect('/account-activated');
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
/*
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
  });*/
  app.post("/createmicrotasks", (req, res) => {
    const { titlu, descriere, credite, credite1, timp, categorie, tara } = req.body;
  
    // Verificăm dacă utilizatorul este autentificat
    if (!req.session.userId) {
      return res.status(401).json({ message: "Utilizatorul nu este autentificat." });
    }
  
    // Preia ID-ul utilizatorului autentificat din sesiune
    const user_id = req.session.userId;
  
    let pozitii = credite / credite1;
  
    // Verificăm dacă utilizatorul are suficiente credite pentru a adăuga microtask-ul
    const sqlCheckUserCredits = "SELECT credite FROM users WHERE id = ?";
    db.query(sqlCheckUserCredits, [user_id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Eroare la verificarea creditelor utilizatorului:', checkErr);
        return res.status(500).json({ message: 'Eroare la verificarea creditelor utilizatorului.' });
      }
  
      const userCredits = checkResult[0].credite;
  
      if (userCredits < credite) {
        return res.status(400).json({ message: "Utilizatorul nu are suficiente credite pentru a adăuga microtask-ul." });
      }
  
      // Exemplu de query pentru inserarea datelor în baza de date
      const sqlInsertMicrotask = 'INSERT INTO microtasks (titlu, descriere, credite, credite1, timp, pozitii, categorie, user_id, is_approved, tara) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(sqlInsertMicrotask, [titlu, descriere, credite, credite1, timp, pozitii, categorie, user_id, 0, tara], (insertErr, result) => {
        if (insertErr) {
          console.error('Eroare la inserarea datelor în baza de date:', insertErr);
          res.status(500).json({ message: 'Eroare la adăugarea microtask-ului.' });
        } else {
          // Deduce creditele corespunzătoare din contul utilizatorului
          const sqlDeductUserCredits = "UPDATE users SET credite = credite - ? WHERE id = ?";
          db.query(sqlDeductUserCredits, [credite, user_id], (deductErr) => {
            if (deductErr) {
              console.error('Eroare la deducerea creditelor utilizatorului:', deductErr);
            }
          });
  
          console.log('Microtask-ul a fost adăugat cu succes!');
          res.status(200).json({ message: 'Microtask adăugat cu succes.' });
        }
      });
    });
  });
  

  // Ruta pentru a obține ID-ul utilizatorului curent
app.get('/getUserId', (req, res) => {
  const userId = req.session.userId;
  res.json({ userId });
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
  /*app.post('/updateSubmissionStatus/:submissionId', (req, res) => {
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
  });*//*
  app.post('/updateSubmissionStatus/:submissionId', (req, res) => {
    const submissionId = req.params.submissionId;
    const newStatus = req.body.newStatus;
  
    try {
      // Aici vom efectua actualizarea în baza de date
      const sqlUpdateSubmission = "UPDATE submissions SET is_approved = ? WHERE ID = ?";
      db.query(sqlUpdateSubmission, [newStatus, submissionId], (err, result) => {
        if (err) {
          console.error('Error updating submission status:', err);
          return res.status(500).json({ error: 'An error occurred while updating submission status' });
        }
  
        // Verificăm dacă rândurile au fost afectate (actualizate) cu succes
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Submission not found' });
        }
  
        // Dacă statusul nou este 1 (aprobat), actualizăm pozitii_aprobate în tabela microtasks
        if (newStatus === 1) {
          const sqlUpdateMicrotask = "UPDATE microtasks SET pozitii_aprobate = pozitii_aprobate + 1 WHERE ID = (SELECT microtask_id FROM submissions WHERE ID = ?)";
          db.query(sqlUpdateMicrotask, [submissionId], (microtaskErr, microtaskResult) => {
            if (microtaskErr) {
              console.error('Error updating pozitii_aprobate:', microtaskErr);
            }
          });
        }
  
        // Verificăm dacă trebuie să actualizăm is_approved în tabela microtasks
        const sqlCheckMicrotask = "SELECT pozitii, pozitii_aprobate FROM microtasks WHERE ID = (SELECT microtask_id FROM submissions WHERE ID = ?)";
        db.query(sqlCheckMicrotask, [submissionId], (checkErr, checkResult) => {
          if (!checkErr && checkResult.length > 0) {
            const { pozitii, pozitii_aprobate } = checkResult[0];
            if (pozitii === pozitii_aprobate) {
              const sqlUpdateMicrotaskApproved = "UPDATE microtasks SET is_approved = 1 WHERE ID = ?";
              db.query(sqlUpdateMicrotaskApproved, [checkResult[0].ID], (updateErr) => {
                if (updateErr) {
                  console.error('Error updating is_approved in microtasks:', updateErr);
                }
              });
            }
          }
        });
  
        res.status(200).json({ message: 'Submission status updated successfully' });
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
      res.status(500).json({ error: 'An error occurred while updating submission status' });
    }
  });
  */
/*  app.post('/updateSubmissionStatus/:submissionId', (req, res) => {
    const submissionId = req.params.submissionId;
    const newStatus = req.body.newStatus;
  
    try {
      // Aici vom efectua actualizarea în baza de date
      const sqlUpdateSubmission = "UPDATE submissions SET is_approved = ? WHERE ID = ?";
      db.query(sqlUpdateSubmission, [newStatus, submissionId], async (err, result) => {
        if (err) {
          console.error('Error updating submission status:', err);
          return res.status(500).json({ error: 'An error occurred while updating submission status' });
        }
  
        // Verificăm dacă rândurile au fost afectate (actualizate) cu succes
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Submission not found' });
        }
  
        // Dacă statusul nou este 1 (aprobat), actualizăm pozitii_aprobate în tabela microtasks
        if (newStatus === 1) {
          const sqlUpdateMicrotask = "UPDATE microtasks SET pozitii_aprobate = pozitii_aprobate + 1 WHERE ID = (SELECT microtask_id FROM submissions WHERE ID = ?)";
          db.query(sqlUpdateMicrotask, [submissionId], async (microtaskErr, microtaskResult) => {
            if (microtaskErr) {
              console.error('Error updating pozitii_aprobate:', microtaskErr);
            } else {
              // Obține id-ul microtask-ului pentru a putea actualiza creditele
              const sqlGetMicrotask = "SELECT microtask_id FROM submissions WHERE ID = ?";
              db.query(sqlGetMicrotask, [submissionId], async (getMicrotaskErr, getMicrotaskResult) => {
                if (!getMicrotaskErr && getMicrotaskResult.length > 0) {
                  const microtaskId = getMicrotaskResult[0].microtask_id;
  
                  // Obține numărul de credite din microtasks pentru microtask-ul curent
                  const sqlGetMicrotaskCredits = "SELECT credite1 FROM microtasks WHERE ID = ?";
                  db.query(sqlGetMicrotaskCredits, [microtaskId], async (getCreditsErr, getCreditsResult) => {
                    if (!getCreditsErr && getCreditsResult.length > 0) {
                      const microtaskCredits = getCreditsResult[0].credite1;
  
                      // Actualizează creditele utilizatorului cu numărul de credite din microtask
                      const userId = req.session.userId; // Presupunând că aveți o funcție de autentificare care setează req.user
                      const sqlUpdateUserCredits = "UPDATE users SET credite = credite + ? WHERE id = ?";
                      db.query(sqlUpdateUserCredits, [microtaskCredits, userId], (updateCreditsErr) => {
                        if (updateCreditsErr) {
                          console.error('Error updating user credits:', updateCreditsErr);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
  
        // Restul codului rămâne neschimbat
        // ...
  
        res.status(200).json({ message: 'Submission status updated successfully' });
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
      res.status(500).json({ error: 'An error occurred while updating submission status' });
    }
  });*/
  app.post('/updateSubmissionStatus/:submissionId', (req, res) => {
    const submissionId = req.params.submissionId;
    const newStatus = req.body.newStatus;
  
    try {
      // Aici vom efectua actualizarea în baza de date
      const sqlUpdateSubmission = "UPDATE submissions SET is_approved = ? WHERE ID = ?";
      db.query(sqlUpdateSubmission, [newStatus, submissionId], async (err, result) => {
        if (err) {
          console.error('Error updating submission status:', err);
          return res.status(500).json({ error: 'An error occurred while updating submission status' });
        }
  
        // Verificăm dacă rândurile au fost afectate (actualizate) cu succes
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Submission not found' });
        }
  
        // Dacă statusul nou este 1 (aprobat), actualizăm pozitii_aprobate în tabela microtasks
        if (newStatus === 1) {
          const sqlUpdateMicrotask = "UPDATE microtasks SET pozitii_aprobate = pozitii_aprobate + 1 WHERE ID = (SELECT microtask_id FROM submissions WHERE ID = ?)";
          db.query(sqlUpdateMicrotask, [submissionId], async (microtaskErr, microtaskResult) => {
            if (microtaskErr) {
              console.error('Error updating pozitii_aprobate:', microtaskErr);
            } else {
              // Obține id-ul microtask-ului pentru a putea actualiza creditele
              const sqlGetMicrotask = "SELECT microtask_id FROM submissions WHERE ID = ?";
              db.query(sqlGetMicrotask, [submissionId], async (getMicrotaskErr, getMicrotaskResult) => {
                if (!getMicrotaskErr && getMicrotaskResult.length > 0) {
                  const microtaskId = getMicrotaskResult[0].microtask_id;
  
                  // Obține numărul de credite din microtasks pentru microtask-ul curent
                  const sqlGetMicrotaskCredits = "SELECT credite1 FROM microtasks WHERE ID = ?";
                  db.query(sqlGetMicrotaskCredits, [microtaskId], async (getCreditsErr, getCreditsResult) => {
                    if (!getCreditsErr && getCreditsResult.length > 0) {
                      const microtaskCredits = getCreditsResult[0].credite1;
  
                      // Obține id-ul utilizatorului care a adăugat submisia
                      const sqlGetUserId = "SELECT user_id FROM submissions WHERE ID = ?";
                      db.query(sqlGetUserId, [submissionId], async (getUserIdErr, getUserIdResult) => {
                        if (!getUserIdErr && getUserIdResult.length > 0) {
                          const userId = getUserIdResult[0].user_id;
  
                          // Actualizează creditele utilizatorului cu numărul de credite din microtask
                          const sqlUpdateUserCredits = "UPDATE users SET credite = credite + ? WHERE id = ?";
                          db.query(sqlUpdateUserCredits, [microtaskCredits, userId], (updateCreditsErr) => {
                            if (updateCreditsErr) {
                              console.error('Error updating user credits:', updateCreditsErr);
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
  
        // Restul codului rămâne neschimbat
        // ...
  
        res.status(200).json({ message: 'Submission status updated successfully' });
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
      res.status(500).json({ error: 'An error occurred while updating submission status' });
    }
  });
  
  

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