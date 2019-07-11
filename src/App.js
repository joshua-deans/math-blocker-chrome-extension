/* global chrome */
import React, { Component } from 'react';
import ManageSites from './components/ManageSites';
import './App.css';
import ManageQuestions from './components/ManageQuestions';
import ManageSchedule from './components/ManageSchedule';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { connect } from 'react-redux';

class App extends Component {  
  constructor(props){
    super(props);

    this.state = {currentView: 'dashboard'};
    this.handleViewChange = this.handleViewChange.bind(this);
  }

  componentWillMount(){
    chrome.storage.sync.get(['schedulingOn', 'schedulingData', 'siteList'], (result) => {
      let schedulingOnTemp = (result.schedulingOn !== undefined) ? result.schedulingOn : this.props.schedulingOn;
      let schedulingDataTemp = (result.schedulingData !== undefined) ? result.schedulingData : this.props.schedulingData;
      let siteListTemp = (result.siteList !== undefined) ? result.siteList : this.props.siteList;
      this.props.dispatch(
        {type: 'SCHEDULE_UPDATE', data: {schedulingOn: schedulingOnTemp, schedulingData: schedulingDataTemp, siteList: siteListTemp} 
      });
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
      content = <ManageSites schedulingOn={this.props.schedulingOn} schedulingData={this.props.schedulingData} siteList={this.props.siteList} />
    } else if (currentView === "manageSchedule"){
      content = <ManageSchedule schedulingOn={this.props.schedulingOn} schedulingData={this.props.schedulingData} />
    } else if (currentView === "dashboard"){
      content = <Dashboard schedulingOn={this.props.schedulingOn} schedulingData={this.props.schedulingData} siteList={this.props.siteList}  />
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
      <button className="btn btn-link navbar-brand p-0" value='dashboard' id='dashboard' onClick={this.handleViewChange}>Math Blocker</button>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <button className="btn btn-link nav-link" value='manageSites' id='manageSites' onClick={this.handleViewChange}>Manage Sites</button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link" value='manageQuestions' id='manageQuestions' onClick={this.handleViewChange}>Manage Questions</button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link" value='manageSchedule' id='manageSchedule' onClick={this.handleViewChange}>Manage Schedule</button>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="btn btn-link nav-link" target="_blank" href="https://www.paypal.me/joshuadeans"><i class="fab fa-paypal" /> Donate</a>
          </li>
        </ul>
      </div>
    </nav>);
  }
}

const mapStateToProps = state => {
  return {
    schedulingOn: state.schedulingOn,
    schedulingData: state.schedulingData,
    siteList: state.siteList
  }
};

export default connect(mapStateToProps)(App);
