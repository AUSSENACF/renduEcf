import React , {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import {Button, Modal, Form } from 'react-bootstrap'
import axios from 'axios'
import ProfilTeacher from './component/ProfilTeacher';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      currentConnectStatus: "Guest",
      showModalLogin : false, // state show or hide of Log modal after click on login button
      showModalSignIn : false, // state show or hide of Sign modal after click on SignIn button
      signInStatus : 'Guest', // status of SignIN data, for Show different SignIn Form and save status if Form submit
      profilImgFile : null, // state of profil img file use if signInStatus = professeur
      exempleprofilImgFile:null,
      pseudo:'', // state of pseudo or name if in Professeur signInStatus
      mail :['',false], // state of mail
      password:'', // state of password
      firstname:'', // state of firstname use if signInStatus = professeur
      description:'' // state of description use if signInStatus = professeur 
    }
    // func call on Login form Submit
    this.handleClickLoginWithSubmit = () => { 
      axios.post('/logIn', {message:[this.state.mail,this.state.password]}).then(resp => 
      {
        this.setState({currentConnectStatus : resp.data.status})
        console.log("alez")
      });
      this.handleClickLogin(); // call modal login close
    };

    // func call on SignIn form Submit
    this.handleClickSignInWithSubmit  = () => {
      if(this.state.signInStatus === "Apprenant"){  // data post on "Apprenant" status 
        axios.post('/signIn', {message:[
          this.state.pseudo, 
          this.state.signInStatus, 
          this.state.mail, 
          this.state.password
        ]})
        this.handleClickSignIn();       // call modal signIn close 

      }else if(this.state.signInStatus === "Professeur"){  // data post on "Professeur"status 
        axios.post('/signIn', {message:[
          this.state.pseudo, 
          this.state.signInStatus, 
          this.state.mail, 
          this.state.password, 
          this.state.firstname,  
          this.state.description
        ]}).then((resp =>{ // verify ProfilTeacher bd is populated before save image and image path
          if(resp.data === "cette adresse est déjà renseignée"){
            // affiché au utilisateur
          }else if(resp.data === "data saved"){
            this.profilImg()
            this.handleClickSignIn();
          }else{ console.log('pourquoi je suis ici?')}       // call modal signIn close 
        }));
         
      }else{this.handleClickSignIn();}// Do nothing if signInStatus = Guest        // call modal signIn close  

    }

    // func call on Login Button click or form Login cancel button click
    this.handleClickLogin = () => { 
        this.setState({showModalLogin : !this.state.showModalLogin}) // changing status of "this.state.showModalLogin"
    };

    // func call on SignIn Button click or form SignIn cancel button click
    this.handleClickSignIn = () => { 
      this.setState({showModalSignIn : !this.state.showModalSignIn}) // changing status of "this.state.showModalSignIn"
      this.setState({profilImgFile : null, pseudo:'',mail:'',password:'',firstname:'',description:'',exempleprofilImgFile: null}); // cancel image in state profilImgFile after click
      if(this.state.showModalSignIn === true){ // reset signInStatus at modal closing
        this.setState({signInStatus : 'Guest'});  
      }else{this.setState({signInStatus : 'Apprenant'});} // reset signInStatus Button at modal opening
    };

    // func to change "this.state.signInStatus" on SignIn modal switch button
    this.signInStatus = () =>{ 
      if (this.state.signInStatus === 'Professeur'){
        this.setState({signInStatus : 'Apprenant'}) 
      }else{
        this.setState({signInStatus : 'Professeur'})
      }
    };

    // func to keep image of teacher SignIn Form
    this.handleChangeProfilImgFile = (e) => {// teacher inscription image management 
      this.setState({profilImgFile: e.target.files[0]});//save file in state
      this.setState({exempleprofilImgFile: URL.createObjectURL(e.target.files[0])});//make preview
          
    }

    this.profilImg = async () =>{ // save image
      const formdata = new FormData(); // make form data
      formdata.append('avatar', this.state.profilImgFile); // append image
      formdata.append('primarykey', this.state.mail[0]) //append mail primarykey
      formdata.append('table', 'ProfilTeacher')
      formdata.append('whereSelector', 'mail')
      axios.post("/imageupload", formdata,{// post to db   
              headers: { "Content-Type": "multipart/form-data" }
      })
    }
        
    //input data control and pass in state if good
    this.handleChangeMail = (e)=>{ // change mail state if regex mail is ok with input
      var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if(e.target.value.match(mailformat))
      {
      // A FAIRE PROCHAINEMENT if mail not already present in DB   
      this.setState({mail : [e.target.value,true]});
      console.log(this.state.mail);
      }
    }

    this.handleChangePseudo = (e)=>{// change state of pseudo if number of character are ok
      if(e.target.value.length > 3 && e.target.value.length < 15)
      {
      this.setState({pseudo : [e.target.value,true]});
      }
    }

    this.handleChangePassword = (e)=>{ //change state of password if input is ok with password regex
      var passwordformat = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
      if(e.target.value.match(passwordformat))
      {
      this.setState({password : [e.target.value,true]});
      console.log(this.state.password);
      }
    };

    this.handleChangeFirstname = (e)=>{ // change firsname state with input value
      this.setState({firstname : e.target.value})
    };

    this.handleChangeDescription = (e)=>{ // change description state with input value
      this.setState({description : e.target.value})
    };
  }


  render() {
    let SignInForm // var use in SignIn modal body
    let signInButton // var for activated or disabled  SignIn button if data input are ok
    let logInButton // var for activated or disabled  Logging button if data input are ok
    let maincontent // var to main content show depending on status value


    if( this.state.mail[1] === true  && this.state.password[1] === true){ // Validation of the data respect the rules for signIn/logIn 
        
        logInButton = <Button onClick = {()=>{this.handleClickLoginWithSubmit()}}> click to log</Button> //if data are good logging button activated
        if(this.state.pseudo[1] === true){ //if data are good SignIn button activated
          signInButton =<Button onClick = {()=>{this.handleClickSignInWithSubmit()}}> click to Register</Button>
        }else{signInButton =<Button disabled> click to Register</Button>}// else singIn button disabled
    }else{// validation not ok all of two button disabled
        signInButton =<Button disabled> click to Register</Button>
        logInButton = <Button disabled> click to log</Button>
    }

    //condition for show SignIn form "Apprenant" or "Professeur"
    if(this.state.signInStatus === 'Apprenant'){ // form called if button switch of modal signIn body is on "Apprenant"
      SignInForm = 
        <>
          <p>E-mail: <input type='email' placeholder='votre e-mail' onChange = {this.handleChangeMail}></input></p>
          <p>Pseudo: <input type='texte' placeholder='votre pseudo' onChange = {this.handleChangePseudo}></input></p>
          <p>Mot de passe: <input type='password' placeholder='votre mot de passe' onChange = {this.handleChangePassword}></input></p>
        </>
      }else{    // form called if button switch of modal signIn body is on "Instructeur" 
      SignInForm =
        <>
          <p>les champs avec un "*" sont obligatoire</p>
          <p>E-mail *: <input type='email' placeholder='votre e-mail' onChange = {this.handleChangeMail}></input></p>
          <p>Nom *: <input type='texte' placeholder='votre nom' onChange = {this.handleChangePseudo}></input></p>
          <p>Prenom: <input type='texte' placeholder='votre prenom' onChange={this.handleChangeFirstname}  ></input></p>
          <p>mot de passe *: <input type='password' placeholder='votre mot de passe' onChange = {this.handleChangePassword}></input></p>
          <p>photo de profil:  <input type="file" onChange={this.handleChangeProfilImgFile} /> {/*Choose profil IMG Button*/} <img src={this.state.exempleprofilImgFile}/>{/*show image selected*/}</p>
          <p>Description: <br/>
          <textarea type='texte' placeholder='decrivez vous' onChange={this.handleChangeDescription} ></textarea>
          </p>
        </>
      };

    // main page called depending on status value
    if(this.state.currentConnectStatus === "Professeur"){
      maincontent = 
        <ProfilTeacher  mail = {this.state.mail[0]}  />
    }
    

    return (
    <>  
      <header>
      <p>mettre un Logo </p>
          <Button className= 'classename define' onClick = {this.handleClickLogin}>Connection</Button>  {/*Button to show modal login*/}
          <Modal show = {this.state.showModalLogin}>
              <Modal.Header>
                Connection
              </Modal.Header>
              <Modal.Body>
                  <p>
                    E-mail
                    <input name = "E-mail" type = "email" placeholder='Entrez votre E-mail' onChange = {this.handleChangeMail}></input>
                  </p>
                  <p>
                    Mot de Passe
                    <input type = "password" placeholder='Entrez votre Mot de passe' onChange = {this.handleChangePassword}></input>
                  </p>
              </Modal.Body>
              <Modal.Footer>
                {logInButton}
                <Button onClick={()=>{this.handleClickLogin()}}>Cancel</Button>
              </Modal.Footer>
          </Modal>


          <Button onClick = {()=>{this.handleClickSignIn()}}>Inscription</Button> {/*Button to show modal SignIn*/}
          <Modal show = {this.state.showModalSignIn}>
            <Modal.Header>
                <p>Inscription</p>
                {/* switch button for select "Apprenant" or "Instructeur" */}
                  <Form.Switch 
                    type="switch"
                    id="custom-switch"
                    label={this.state.signInStatus}
                    onClick = {this.signInStatus}
                  />
            </Modal.Header>
            <Modal.Body>
                  {/*formulaire  with condition "Apprenant" or "Instructeur"*/}
                  {SignInForm}
            </Modal.Body>
            <Modal.Footer>
              {signInButton}
              <Button onClick = {()=>{this.handleClickSignIn()}}>Cancel</Button>
            </Modal.Footer>
          </Modal>
      </header>
      <main className="App-header">
        {maincontent}
      </main>
    </>  
    )
  }
}


//export default App;
