const sqlite3 = require('sqlite3')
// entrer le nom de votre admin mini 4 character max 14
const name = "françois";
// enter the mail with @ and .
const email="francois@aussenac.fr";
//enter the password mini 8 character with mini 1 letter,1 number and 1 symbole
const password ="diplomeEcf8!" ;

// in console go in this directory and enter: node adminCreation.js







const db = new sqlite3.Database("ecoItDbMain.db", (err) =>{
    if (err) return console.error(err.message);

    db.run(`INSERT INTO User(pseudo , status , mail , password) VALUES(?, ?, ?, ?)`,[ name, "Admin", email, password])
});

db.close((err) =>{
    if (err) return console.error(err.message);

    console.log("closed");
});