import React, { Component } from 'react';
import ManageSites from './components/ManageSites';
import './App.css';
import ManageQuestions from './components/ManageQuestions';
import ManageSchedule from './components/ManageSchedule';
import OtherSettings from './components/OtherSettings';

class App extends Component {  
  constructor(props){
    super(props);

    this.state = {currentView: 'manageSites'};
    this.handleViewChange = this.handleViewChange.bind(this);
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
    if (currentView === "manageSchedule"){
      content = <ManageSchedule />
    } else if (currentView === "manageQuestions"){
      content = <ManageQuestions />
    } else if (currentView === "manageSites"){
      content = <ManageSites />
    } else if (currentView === "manageSchedule"){
      content = <ManageSchedule />
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
    <nav id="mainNav" class="navbar navbar-expand navbar-dark bg-dark">
      <button class="btn btn-link navbar-brand inactiveLink p-0">Navbar</button>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <button class="btn btn-link nav-link active" value='manageSites' id='manageSites' onClick={this.handleViewChange}>Manage Sites</button>
          </li>
          <li class="nav-item">
            <button class="btn btn-link nav-link" value='manageQuestions' id='manageQuestions' onClick={this.handleViewChange}>Manage Questions</button>
          </li>
          <li class="nav-item">
            <button class="btn btn-link nav-link" value='manageSchedule' id='manageSchedule' onClick={this.handleViewChange}>Manage Schedule</button>
          </li>
        </ul>
      </div>
    </nav>);
  }
}

export default App;
