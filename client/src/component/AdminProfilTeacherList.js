import axios from 'axios';
import React, { Component } from 'react'
import { Button } from 'react-bootstrap';

export default class AdminProfilTeacherList extends Component {
    constructor(){
        super();
        
        this.state = {
            teacher : []
        }
        this.image = require.context('../../../Files/uploads', true)
        this.handleClick = (e) => {
            console.log(e.currentTarget.id)
            let adminAcceptance = e.currentTarget.id;
            if(adminAcceptance === "waiting"){
                adminAcceptance = "accepted";
            }else{
                adminAcceptance = "waiting";
            }
            console.log()
        }
    }
    componentDidMount(){
        axios.post('/getProfilTeacherList'
        ).then(resp =>{
            this.setState({teacher : resp.data})

        })
    }
  render() {
      
    let teacherList = []
    let data = this.state.teacher
      data.forEach((data) =>{
          console.log(data)
      teacherList.push(
          <div className='card col-12 col-md-5 col-lg-4'>
              <div className='card-body'>
                  <div className='card-title'>{data.firstname}</div>
                  <div className='card-text'>{data.description}</div>
                  {/*<Button id={data.adminAcceptance} onClick={this.handleClick}>commencer</Button>*/}
              </div>
          </div>
        )
      });
  return (
  <div className='containe-fluid'>
      <h1>Admin Zone</h1>
      <div className='row'>
          {teacherList}
          
      </div>
  </div>
  )
}
}
