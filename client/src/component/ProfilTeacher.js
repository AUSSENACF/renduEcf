// import
import React, { Component ,} from 'react';
import axios from 'axios'
import { Button , Modal } from 'react-bootstrap';
import LessonCreatorWindow from './lessonCreatorWindow';
import SectionCreatorWindow from './sectionCreatorWindow';


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
    }
    this.lessonCreator = ()=>{
      this.setState({lessonCreator : true})
    }
    this.sectionCreator = ()=>{
      this.setState({sectionCreator : true})
    }
    this.handleCallback = ()=>{this.setState({lessonCreator : !this.state.lessonCreator})}

    this.handleCallbackSection = ()=>{this.setState({sectionCreator : !this.state.sectionCreator})}
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

    if(this.state.srcProfilImgFile === "" || this.state.srcProfilImgFile === null || this.state.srcProfilImgFile === "./undefined"){
      images = "";
    }else{
      images =this.image(this.state.srcProfilImgFile)
    }
    modalLessonCreatorWindow = 
          <LessonCreatorWindow mail = {this.state.mail}  showModal = {this.state.lessonCreator} parentCallback={()=>{this.handleCallback()}} />
    modalSectionCreatorWindow = 
          <SectionCreatorWindow mail = {this.state.mail}  showModal = {this.state.SectionCreator} parentCallbackSection={()=>{this.handleCallbackSection()}} />
    return (
      <>
        <div> Nom: {this.state.pseudo}</div>
        <div> Prenom: {this.state.firstname}</div>
        <div> Description : {this.state.description} </div>
        <img src = {images} alt="photo de profile"/>
        <ul> Créer Vos Formation !!
          <li><Button onClick={this.lessonCreator}>Créer un cour</Button></li>
          <li><Button onClick={this.sectionCreator}>Créer une Section</Button></li>
          <li><Button>Créer une Leçon</Button></li>
          <li><Button>Créer un Quizz</Button></li>
        </ul>
        <Modal show = {this.state.lessonCreator}>{modalLessonCreatorWindow}</Modal>
        <Modal show = {this.state.sectionCreator}>{modalSectionCreatorWindow}</Modal>
        
        
        
        
        
      </>
    )
  }
}

