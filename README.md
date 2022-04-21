# renduEcf
rendu final


# Instalation de l'app

## préparation à la reception des donnée git

- télécharger Node v14
- créer un nouveau dossier eco-It
- ouvrer le dossier dans votre ide
- dans le terminal rendez vous dans le dossier eco-It
- dans la console ecrivé :``` npm init ```
- attention pendant la création rensseigné le entry point comme étant ```  server.js```

## installation des modules

- dans la console écrivé : ``` npm install core dotenv express multer path sqlite3```
- puis :```npm install -D nodemon ```
- crée un fichier .env et ecrivez à l'interieur : ```PORT=4000``` 
- puis toujours dans la console :``` npx create-react-app client```
- depuis la console de commande allez dans le dossier client et ecrivez : ```npm install axios bootstrap react-bootstrap react-select``` 
- copier le contenu du git repository dans le dossier

## initialisation de la base de donné
depuis le terminal entrez la command: ```node ecoItDbMain.js```
## lancer l'app
 depuis le terminal rendez vous à la racine du dossier puis utiliser les commande
 ```npm start ```
 puis dans un deuxième terminal
 ```npm run client ```

