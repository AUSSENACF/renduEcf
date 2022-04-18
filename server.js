const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3')
const multer = require('multer');
require('dotenv').config()
const path = require('path')

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors());
app.use(express.json())
app.use(express.static('client/build'))

app.post('/signIn', (req,res) =>{ // save signIn data if primary key "email" does not exist
    const db = new sqlite3.Database("ecoItDbMain.db", (err) =>{
        if (err) return console.error(err.message);
        db.serialize(()=>{
            db.run(`INSERT INTO User(pseudo, status, mail, password) VALUES(?, ?, ?, ?)`,
                [req.body.message[0][0], req.body.message[1], req.body.message[2][0], req.body.message[3][0]],
                (err)=>{if(err){// if sql err exist
                    if(err.errno === 19){ //it's because primary key "email" already exist 
                        res.send("cette adresse est déjà renseignée")
                    }else{// it's another error
                        console.log(err)
                    }
                }else{ // all is good data saved :D !!
                    if(req.body.message[1]=== 'Professeur'){ // if  status = 'professeur' save additional data to another db
                        if(req.body.message[4]=== undefined)return req.body.message[4]= null;
                        if(req.body.message[5]=== undefined)return req.body.message[5]= null;
                        db.run(`INSERT INTO ProfilTeacher(mail, firstname, adminAcceptance, description) VALUES(?, ?, ?, ?)`,
                        [req.body.message[2][0],req.body.message[4],"waiting", req.body.message[5]]) 
                    }else{
                                
                    }
                    res.send("data saved")
                }
            });
            db.close((err) =>{
                if (err) return console.error(err.message);// validate data save for start saving profile image
            });
        });
    });
});


    
// dl file
app.post('/imageupload', async (req, res) => {
    let storage = multer.diskStorage({
        destination: path.join(__dirname, './Files/', 'uploads'),
        filename: function (req, file, cb) {   
            // null as first argument means no error
            cb(null, Date.now() + '-' + file.originalname )  
        }
    })	
    try {
        // 'avatar' is the name of our file input field in the HTML form
        let upload = multer({ storage: storage}).single('avatar');
        
        upload(req, res, function(err) {
            // req.file contains information of uploaded file
            // req.body contains information of text fields
            if (!req.file) {
                return res.send('Please select an image to upload');
            }
            else if (err instanceof multer.MulterError) {
                return res.send(err);
            }
            else if (err) {
                return res.send(err);
            }
            
            const classifiedsadd = {
                image: req.file.filename};
            const db = new sqlite3.Database("ecoItDbMain.db", (err) =>{
            if (err) return console.error(err.message);
                db.serialize(()=>{
                    db.run(`UPDATE '${req.body.table}' SET imgPath = "${req.file.filename}"  WHERE ${req.body.whereSelector} = "${req.body.primarykey}"`,(err)=>{
                        if (err) return console.error(err.message);
                    });
                    db.close((err) =>{
                        if (err) return console.error(err.message);
                    
                    });
                });
            });
    
        }); 
    
    }catch (err) {console.log(err)}
});

app.post('/logIn', (req,res) =>{
    const db = new sqlite3.Database("ecoItDbMain.db", (err) =>{
        if (err) return console.error(err.message);
        db.serialize(()=>{
            db.each(`SELECT mail , password FROM User`,(err, data) =>{
                if(err) return console.error(err.message);
                if(data.mail === req.body.message[0][0] && data.password === req.body.message[1][0])
                return db.get(`SELECT status FROM User WHERE mail = "${req.body.message[0][0]}"`,(err, data) =>{
                    if (err)
                    throw err
                    
                    res.send(data);
                });


            });
            db.close((err) =>{
                if (err) return console.error(err.message);
        
                console.log("....closed");
            });
        });
    });
});

app.post('/getProfilTeacher', (req,res) =>{ // Call User data if User is a Teacher for show profil
    const db = new sqlite3.Database("ecoItDbMain.db", (err) =>{
        if (err) return console.error(err.message); 
        db.serialize(()=>{
            db.each(`SELECT mail FROM User`,(err,data) =>{
                if(err) return console.error(err.message);
                if(data.mail === req.body.message) return db.get(`SELECT User.pseudo, ProfilTeacher.firstname, ProfilTeacher.description, ProfilTeacher.imgPath FROM User LEFT JOIN ProfilTeacher ON ProfilTeacher.mail = User.mail WHERE User.mail = "${req.body.message}"`,(err,data) =>{
                    if(err)
                        throw err
                    res.send(data);   
                });

            })
        
            db.close((err) =>{
                if (err) return console.error(err.message);
            });
        });
    });
});

app.post('/createLesson', (req,res) =>{ // save signIn data if primary key "email" does not exist
    const db = new sqlite3.Database("ecoItDbMain.db", (err) =>{
        if (err) return console.error(err.message);
        db.serialize(()=>{
            db.run(`INSERT INTO Lesson(mail, title,  description, lessonStatus) VALUES(?, ?, ?, ?)`,
                [req.body.message[0], req.body.message[1], req.body.message[2], req.body.message[3]],
                (err)=>{if(err){// if sql err exist
                    if(err.errno === 19){ //it's because primary key "email" already exist 
                        res.send("cette adresse est déjà renseignée")
                        console.error(err.message)
                    }else{// it's another error
                        console.log(err)
                    }
                }else{
                    res.send("data saved")
                }
            });
            db.close((err) =>{
                    if (err) return console.error(err.message);
                    // validate data save for start saving profile image
            });
        });
    });
});
app.post('/getLessonList',(req,res)=>{

    const db = new sqlite3.Database("ecoItDbMain.db",(err)=>{
        if(err) return console.error(err.message);
        
            db.all(`SELECT rowId, title FROM Lesson WHERE mail = '${req.body.message[0]}'`,(err,data)=>{
                res.send(data)
            })
            db.close((err)=>{if(err) return console.error(err.message)});
        })
    
})
app.post('/saveSection', (req,res)=>{
    console.log(req.body.message[0])
    const db = new sqlite3.Database("ecoItDbMain.db",(err)=>{
        if(err) return console.error(err.message);
        
        db.run(`INSERT INTO Section(lessonId, title) VALUES(?, ?)`,[req.body.message[0], req.body.message[1]],
        (err)=>{if(err){// if sql err exist
            if(err.errno === 19){ //it's because primary key "email" already exist 
                res.send("ce titre de section existe déja")
                console.error(err.message)
            }else{// it's another error
                console.log(err)
            }
        }else{
            res.send("data saved")
        }
    db.close((err) =>{
            if (err) return console.error(err.message);
            // validate data save for start saving profile image
    });
        })
    })
})

app.get('/*',(_,res) =>{
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})
app.listen(PORT, ()=>{
    console.log(`le serveur est lancé sur le port : ${PORT}`)
});
