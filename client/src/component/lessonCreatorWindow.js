import React, { Component } from 'react'
import { Button, Modal} from 'react-bootstrap';
import axios from 'axios';

export default class LessonCreatorWindow extends Component {
    constructor(props){
        super(props);
        this.state = {
            mail : props.mail,
            lessonTitle : "",
            lessonDesc:"",
            lessonImgFile:null,
            exempleLessonImgFile : null,
            titleValidate : false
        }
        this.handleChangeLessonImgFile = (e)=>{
            this.setState({lessonImgFile: e.target.files[0]});//save file in state
            this.setState({exempleLessonImgFile: URL.createObjectURL(e.target.files[0])});//make preview
        }
        this.lessonImg = async () =>{ // save image
            const formdata = new FormData(); // make form data
            formdata.append('avatar', this.state.lessonImgFile); // append image
            formdata.append('primarykey', this.state.lessonTitle); //append mail primarykey
            formdata.append('table', 'Lesson')
            formdata.append('whereSelector', 'title')
            axios.post("/imageupload", formdata,{// post to db   
                    headers: { "Content-Type": "multipart/form-data" }
            })
        }
        this.lessonCreator = ()=>{
            axios.post('/createLesson', {message:[
                this.state.mail,
                this.state.lessonTitle, 
                this.state.lessonDesc,
                false // lesson forced Offline at creation 
            ]}).then(resp =>{ // verify lesson bd is populated before save image and image path
                if(resp.data === "cette adresse est déjà renseignée"){
                    // affiché au utilisateur
                  }else if(resp.data === "data saved"){
                    this.lessonImg()
                    this.modalReset();
                  }else{ console.log('pourquoi je suis ici?')}       // call modal signIn close 
                });

            

        }
        this.modalReset = () =>{
            this.setState({lessonTitle : "", lessonDesc : "", lessonImgFile:null , exempleLessonImgFile : null})
            this.props.parentCallback()
        }
        this.handleChangeTitle = (e)=>{
            if(e.target.value.length > 3 && e.target.value.length < 15){
              this.setState({lessonTitle : e.target.value, titleValidate : true})  
            }    
        }
        this.handleChangeDescription = (e)=>{
            this.setState({lessonDesc : e.target.value})      
        }
       
    }
       
  render() {
      let createLessonButton
      if(this.state.titleValidate === true){
        createLessonButton = 
            <Button onClick={this.lessonCreator}>Créer</Button>
        }else{
            <Button onClick={this.lessonCreator} disabled>Créer</Button>
        }
    return (
        <>
            <Modal.Header>
                <h1>Crée votre cour</h1>
            </Modal.Header>
            <Modal.Body>
                <div>créer votre leçon</div>
                <input type = 'text' placeholder='Titre du cour' onChange={this.handleChangeTitle}></input>
                <textarea placeholder='courte description' onChange={this.handleChangeDescription}></textarea>
                <p>photo de presentation du cour:  
                    <input type="file" onChange={this.handleChangeLessonImgFile} /> {/*Choose profil IMG Button*/} 
                    <img src={this.state.exempleLessonImgFile} alt =" prévisualisation d'image"/>{/*show image selected*/}
                </p>
                </Modal.Body>
                <Modal.Footer>
                    {createLessonButton}
                    <Button onClick={this.modalReset}>Annuler</Button>
                </Modal.Footer>
            
        </>
    )
  }
}
