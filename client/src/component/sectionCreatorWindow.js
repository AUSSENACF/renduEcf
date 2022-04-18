import React, { Component } from 'react'
import { Button, Modal,} from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';

export default class SectionCreatorWindow extends Component {
    constructor(props){
        super(props);
        this.state = {
            mail : props.mail,
            lessonList: [],
            titleValidate : false,
            lessonSelected:0
        }
        this.sectionCreator = ()=>{
            axios.post('/saveSection', {message:[
                this.state.lessonSelected,
                this.state.sectionTitle, 
            ]}).then(resp =>{
                if(resp.data === "ce titre de section existe déja"){
                    console.log(resp.data)
                }else if(resp.data === "data saved"){
                this.modalReset();
                }else{
                    console.log("pourquoi je suis ici")
                }
        });
            

        }
        this.modalReset = () =>{
            this.setState({lessonTitle : "", lessonDesc : "", lessonImgFile:null , exempleLessonImgFile : null})
            this.props.parentCallbackSection()
        }
        this.handleChangeTitle = (e)=>{
            if(e.target.value.length > 3 && e.target.value.length < 15){
              this.setState({sectionTitle : e.target.value, titleValidate : true})  
            }
        }
        this.changeLessonSelected = (e)=>{
            this.setState({lessonSelected: e.value})
            console.log(this.state.lessonSelected)
        };
       
    }
    componentDidMount(){
        axios.post('/getLessonList', {message:[
            this.state.mail
        ]}).then(resp =>{
            this.setState({lessonList:resp.data})
 
        })
    }
       
  render() {
    let createSectionButton
    let selectLesson

    let options = this.state.lessonList.map(item =>{
        return{
            value:item.rowid,
            label:item.title
        }});
    options = [{value:0 , label:'sélectionner une leçon'},...options]
    

    if(this.state.titleValidate === true && this.state.lessonSelected !== 0){
    createSectionButton = 
        <Button onClick={this.sectionCreator}>Créer</Button>
    }else{
        <Button onClick={this.sectionCreator} disabled>Créer</Button>
    }
    
    selectLesson =
        <Select options={options} defaultValue={options[0]} onChange={this.changeLessonSelected}></Select> 
    

    return (
        <>
            <Modal.Header>
                <h1>Crée votre Section</h1>
            </Modal.Header>
            <Modal.Body>
                {selectLesson}
                <input type = 'text' placeholder='Titre de la section' onChange={this.handleChangeTitle}></input>
                </Modal.Body>
                <Modal.Footer>
                    {createSectionButton}
                    <Button onClick={this.modalReset}>Annuler</Button>
                </Modal.Footer>
            
        </>
    )
  }
}
