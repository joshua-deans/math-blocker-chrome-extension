import React, { Component } from 'react';

class ManageSchedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = { siteList: [], editMode: false , newSiteInput: ''};
    this.addWebsite = this.addWebsite.bind(this);
}  
  
  render() {
      return (
      <div className="p-3">
        <p>Manage Schedule</p>
      </div>
      );
    }
  }

  export default ManageSchedule;