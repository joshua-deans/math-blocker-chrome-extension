/* global chrome */
import React, { Component } from 'react';
import ManageSites from './components/ManageSites';
import './App.css';
import ManageQuestions from './components/ManageQuestions';
import ManageSchedule from './components/ManageSchedule';
import Dashboard from './components/Dashboard';
import { connect } from 'react-redux';

class App extends Component {  
  constructor(props){
    super(props);

    this.state = {currentView: 'manageSites'};
    this.handleViewChange = this.handleViewChange.bind(this);
  }

  componentWillMount(){
    chrome.storage.sync.get(['schedulingOn', 'schedulingData'], (result) => {
      if (result.schedulingOn !== undefined && result.schedulingData !== undefined) {
        this.props.dispatch({type: 'SCHEDULE_UPDATE', data: {schedulingOn: result.schedulingOn, schedulingData: result.schedulingData} });
      }
    })
  }

  handleViewChange(event){
    let val = event.target.value;
    document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
    document.querySelector('#' + event.target.id).classList.add('active');
    this.setState({currentView: val});
  }

  render() {
    const currentView = this.state.currentView;
    let content;
    
    if (currentView === "manageQuestions"){
      content = <ManageQuestions />
    } else if (currentView === "manageSites"){
      content = <ManageSites schedulingOn={this.props.schedulingOn} schedulingData={this.props.schedulingData} />
    } else if (currentView === "manageSchedule"){
      content = <ManageSchedule schedulingOn={this.props.schedulingOn} schedulingData={this.props.schedulingData} />
    }
    else if (currentView === "dashboard"){
      content = <Dashboard />
    } 
    return (
      <div className="App">
        { this.setUpNavBar() }
        <div id="bodyContent" className="bg-light">
        { content }
        </div>
      </div>
    );
  }

  setUpNavBar() {
    return (
    <nav id="mainNav" className="navbar navbar-expand navbar-dark bg-dark">
      <button className="btn btn-link navbar-brand p-0" value='dashboard' id='dashboard' 
      // onClick={this.handleViewChange}
      >Math Blocker</button>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <button className="btn btn-link nav-link active" value='manageSites' id='manageSites' onClick={this.handleViewChange}>Manage Sites</button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link" value='manageQuestions' id='manageQuestions' onClick={this.handleViewChange}>Manage Questions</button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link" value='manageSchedule' id='manageSchedule' onClick={this.handleViewChange}>Manage Schedule</button>
          </li>
        </ul>
      </div>
    </nav>);
  }
}

const mapStateToProps = state => {
  return {
    schedulingOn: state.schedulingOn,
    schedulingData: state.schedulingData
  }
};

export default connect(mapStateToProps)(App);
