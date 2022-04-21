// import
import React, { Component } from 'react';
import axios from 'axios'
import { Button , Modal } from 'react-bootstrap';
import LessonCreatorWindow from './lessonCreatorWindow';
import SectionCreatorWindow from './sectionCreatorWindow';
import CourCreatorWindow from './CourCreatorWindow'

//Profile page component (page viewing personnal prifle after connect in "Professeur")

export default class ProfilTeacher extends Component {

  constructor(props){// the mail of connected User
    super();
    this.state = {
        srcProfilImgFile : "", // state of profil img file
        pseudo:"", // state of pseudo or name 
        mail: props.mail, // state of mail
        firstname: "", // state of firstname
        description: "", // state of description 
        lessonCreator: false,
        sectionCreator:false,
        courCreator: false
    }
    this.lessonCreator = ()=>{
      this.setState({lessonCreator : true})
    }
    this.sectionCreator = ()=>{
      this.setState({sectionCreator : true})
    }
    this.courCreator = ()=>{
      this.setState({courCreator : true})
    }

    this.handleCallback = ()=>{this.setState({lessonCreator : !this.state.lessonCreator})}

    this.handleCallbackSection = ()=>{this.setState({sectionCreator : !this.state.sectionCreator})}

    this.handleCallbackCour = ()=>{this.setState({courCreator : !this.state.courCreator})}
    
  };
  //this.setState({lessonCreator: childData})}) 
  componentDidMount(){
    axios.post("/getProfilTeacher",{message: this.state.mail}).then(resp => // get connected user personnal information
    {
      this.setState({pseudo : resp.data.pseudo})
      this.setState({firstname : resp.data.firstname})
      this.setState({description : resp.data.description})
      this.setState({srcProfilImgFile : `./${resp.data.ImgPath}`})
      if(this.state.srcProfilImgFile !== null && this.state.srcProfilImgFile !== `./undefined`){
        this.image = require.context('../../../Files/uploads', true);// create full path for profile img file
      }
    });
  };

  
  render() {
    let images
    let modalLessonCreatorWindow
    let modalSectionCreatorWindow
    let modalCourCreatorWindow

    if(this.state.srcProfilImgFile === "" || this.state.srcProfilImgFile === null || this.state.srcProfilImgFile === "./undefined"){
      images = "";
    }else{
      images =this.image(this.state.srcProfilImgFile)
    }
    modalLessonCreatorWindow = 
          <LessonCreatorWindow mail = {this.state.mail}  showModal = {this.state.lessonCreator} parentCallback={()=>{this.handleCallback()}} />
    modalSectionCreatorWindow = 
          <SectionCreatorWindow mail = {this.state.mail}  showModal = {this.state.SectionCreator} parentCallbackSection={()=>{this.handleCallbackSection()}} />
    modalCourCreatorWindow = 
          <CourCreatorWindow mail = {this.state.mail}  showModal = {this.state.courCreator} parentCallbackCour={()=>{this.handleCallbackCour()}} />
    return (
      <div><div className='container-fluid profilTeacher'>
        <div className='row'>
          <img className='col-1' src = {images} alt="photo de profile"/>
          <div className='col-6'>
            <p> Nom: {this.state.pseudo}</p>
            <p> Prenom: {this.state.firstname}</p>
          </div>
        </div>
        <p className='row col-12'> Description : {this.state.description} </p>
      </div>
      <footer className='container-fluid col-12'>
      Créer Vos Formation !!
        <ul className='row col-12'> 
          <li className='col-2'><Button className='col-12' onClick={this.lessonCreator}>Créer un Formation</Button></li>
          <li className='col-2'><Button className='col-12' onClick={this.sectionCreator}>Créer une Section</Button></li>
          <li className='col-2'><Button className='col-12' onClick={this.courCreator}>Créer un Cour</Button></li>
          <li className='col-2'><Button className='col-12' >Créer un Quizz</Button></li>
          <li className='col-2'><Button className='col-12' >Créer une question</Button></li>
        </ul>
      </footer>
        <Modal show = {this.state.lessonCreator}>{modalLessonCreatorWindow}</Modal>
        <Modal show = {this.state.sectionCreator}>{modalSectionCreatorWindow}</Modal>
        <Modal show = {this.state.courCreator}>{modalCourCreatorWindow}</Modal>
      </div>
    )
  }
}

