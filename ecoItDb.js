const sqlite3 = require('sqlite3')

const db = new sqlite3.Database("ecoItDbMain.db", (err) =>{
    if (err) return console.error(err.message);

    console.log("ok");
    //get data 

    //make User database
    db.run(`CREATE TABLE User( pseudo TEXT, status TEXT, mail TEXT, password TEXT,PRIMARY KEY (mail))`);
    db.run(`CREATE TABLE ProfilTeacher(mail TEXT, firstname TEXT , adminAcceptance TEXT, description TEXT, ImgPath TEXT, PRIMARY KEY (mail))`);
    db.run(`CREATE TABLE Lesson(mail TEXT, title TEXT, description TEXT, imgPath TEXT,lessonStatus BOOL, PRIMARY KEY (title))`);
    db.run(`CREATE TABLE Section(lessonId INT, title TEXT, PRIMARY KEY(title))`);
    db.run(`CREATE TABLE Cour(SectionId INT, title TEXT, videoLink TEXT, description TEXT, PRIMARY KEY(title))`);
    /*db.run(`INSERT INTO Lesson(mail ,title , description, imgPath)VALUES(?, ?, ?, ?)`,["azertyyui@zer.fr","azert","azerty@zer.fr","azertytrde!4"], 
    (err) =>{
        if(err)return console.error(err.message)    }
    

    );*/
    /*
    db.all(`SELECT * From User `,(err, data) =>{
        if (err)
           throw err   
        
        console.log(data)
    });
    */
    
    /*
    db.each(`SELECT * FROM User`,(err, data) =>{
        if (err)
           throw err   
        
        console.log(data)
    });
    db.each(`SELECT * FROM Lesson`,(err, data) =>{
        if (err)
           throw err   
        
        console.log(data)
    });

    db.each(`SELECT * FROM ProfilTeacher`,(err, data) =>{
        if (err)
           throw err   
        
        console.log(data)
    });
    */

});

db.close((err) =>{
    if (err) return console.error(err.message);

    console.log("closed");
});