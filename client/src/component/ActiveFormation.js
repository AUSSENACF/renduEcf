import axios from 'axios';
import React, { Component } from 'react'
import { Button } from 'react-bootstrap';

export default class ActiveFormation extends Component {
    constructor(props){
        super();
        this.state = {
            formationId : props.formationID,
            formationTitle : '',
            sectionList : [],
            courList:[]
        }
    }
    componentDidMount(){
        axios.post('/getApprenantformation',{message : this.state.formationId})
        .then(resp =>{
            this.setState({formationTitle: resp.data.title});
            axios.post('/getSectionList',{message : this.state.formationId})
            .then(resp =>{
                this.setState({sectionList : resp.data});
                this.state.sectionList.forEach((data)=>{
                axios.post('/getCour',{message : data})
                .then(resp=>{
                    this.setState({courList: resp.data})
                    
                })})
                

            })
        })
        console.log(this.state.courList)
    }
  render() {
      let SectionList = []
    this.state.courList.forEach((data) =>{
        SectionList.push(
            <li key={data.rowid} className='formationetiquette'>
                <Button>{data.title}</Button>
            </li>
          )
        });
      let menu 
      menu = 
        <div>    
            <h1>{this.state.formationTitle}</h1>
            <p></p>
        </div>
    return (
      <>
      <div>{menu}</div>
      <ul>{SectionList}</ul>
      </>
    )
  }
}
