import React, { Component } from 'react'
import { Button, Modal,} from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';

export default class CourCreatorWindow extends Component {
    constructor(props){
        super(props);
        this.state = {
            mail : props.mail,
            lessonList: [],
            titleValidate : false,
            lessonSelected:0,
            sectionList:[{value : 0, label : "sélectionner une formation"}],
            videoLink : '',
            courDescription:'',
            courTitle:''
        }
        this.courCreator = ()=>{
            axios.post('/savecour', {message:[
                this.state.sectionSelected,this.state.courTitle, this.state.videoLink, this.state.courDescription 
            ]}).then(resp =>{
                if(resp.data === "ce titre de cour existe déja"){
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
            this.props.parentCallbackCour()
        }
        this.handleChangeTitle = (e)=>{
            if(e.target.value.length > 3 && e.target.value.length < 15){
              this.setState({courTitle : e.target.value, titleValidate : true})  
            }
        }
        this.handleChangeVideolink = (e)=>{
              this.setState({videoLink : e.target.value})  
        }
        this.handleChangeDescription = (e)=>{
              this.setState({courDescription : e.target.value})  
        }
        this.changeLessonSelected = (e)=>{
            this.setState({lessonSelected: e.value})
            if(e.value === 0){
                this.setState({sectionList: []})
            }else{
                axios.post('/getSectionList', {message : [e.value]}
                ).then(resp =>{
                    this.setState({sectionList : resp.data})
                    console.log(this.state.sectionList)
                })

            }
        }
        this.changeSectionSelected = (e) =>{
            this.setState({sectionSelected: e.value})
        }
       
    }
    componentDidMount(){
        axios.post('/getLessonList', {message:[
            this.state.mail
        ]}).then(resp =>{
            this.setState({lessonList:resp.data})   
        })
    }

       
  render() {
    
    let selectLesson
    let selectSection
    let createCourButton

    let optionsLesson = this.state.lessonList.map(item =>{
        return{
            value:item.rowid,
            label:item.title
        }});
    optionsLesson = [{value:0 , label:'sélectionner une Formation'},...optionsLesson]
    
    let optionsSection = this.state.sectionList.map(item =>{
        return{
            value:item.rowid,
            label:item.title
        }});
        console.log(optionsSection)
    optionsSection = [{value:0 , label:'sélectionner une Section'},...optionsSection]
    

    if(this.state.titleValidate === true && this.state.lessonSelected !== 0){
    createCourButton = 
        <Button onClick={this.courCreator}>Créer</Button>
    }else{
        <Button onClick={this.courCreator} disabled>Créer</Button>
    }
    
    selectLesson =
        <Select options={optionsLesson} defaultValue={optionsLesson[0]} onChange={this.changeLessonSelected}></Select> 
    
    if(this.state.lessonSelected === 0){
        selectSection =
            <Select options={optionsSection} defaultValue={optionsSection[0]} onChange={this.changeSectionSelected} disabled></Select>
    }else{
        selectSection =
            <Select options={optionsSection} defaultValue={optionsSection[0]} onChange={this.changeSectionSelected}></Select>
    }
        
    

    return (
        <>
            <Modal.Header>
                <h1>Crée votre Cour</h1>
            </Modal.Header>
            <Modal.Body>
                {selectLesson}
                {selectSection}
                <input type = 'text' placeholder='Titre de la section' onChange={this.handleChangeTitle}/>
                <input type = 'url' placeholder='ajouter un lien video' onChange={this.handleChangeVideolink}/>
                <textarea type = 'text' placeholder='ajoutez une description du cour' onChange={this.handleChangeDescription}/>
                </Modal.Body>
                <Modal.Footer>
                    {createCourButton}
                    <Button onClick={this.modalReset}>Annuler</Button>
                </Modal.Footer>
            
        </>
    )
  }
}
