import axios from 'axios';
import React, { Component } from 'react'
import { Button } from 'react-bootstrap';

export default class FormationList extends Component {
    constructor(props){
        super(props);
        this.state = {
            data : [{title: "coucou", description: "zsuhd"},{title: "moui", description:"je suis la"}],
            formation : []
        }
        this.image = require.context('../../../Files/uploads', true)
        this.handleClick = (e) => {
            const id = e.currentTarget.id;
            this.props.parentCallBackFormation(id);
          }
    }
    
    componentDidMount(){
        axios.post('/getFormationList',
        ).then(resp =>{
            this.setState({formation : resp.data})

        })
    }
    
  render() {
      
      let formationList = []
      let data = this.state.formation
        data.forEach((data) =>{
        formationList.push(
            <div className='card col-12 col-md-5 col-lg-4'>
                <img src={this.image(`./${data.imgPath}`)}/>
                <div className='card-body'>
                    <div className='card-title'>{data.title}</div>
                    <div className='card-text'>{data.description}</div>
                    <Button id={data.rowid} onClick={this.handleClick}>commencer</Button>
                </div>
            </div>
          )
        });
    return (
    <div className='containe-fluid'>
        <h1>formationList</h1>
        <div className='row'>
            {formationList}
            
        </div>
    </div>
    )
  }
}
