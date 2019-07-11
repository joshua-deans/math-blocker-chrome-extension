/* global chrome */
import React, { Component } from 'react';
import blockHelpers from '../helpers/blockHelper';
import { connect } from 'react-redux';
import moment from 'moment';

class Dashboard extends Component {
  constructor(props){
    super(props);

    this.state = {blockedSites: []};
  }

  componentWillMount(){
    if (this.props.siteList != null){
      let blockedSiteList = this.props.siteList.filter(site => blockHelpers.isSiteBlockActive(site));
      this.setState({blockedSites: blockedSiteList});
    }
  }

  render() {
    let scheduleBlockActive = blockHelpers.isScheduleBlockCurrentlyActive();
    let blockedSiteList = this.props.siteList.filter(site => blockHelpers.isSiteBlockActive(site));
    let siteBlockActive = blockedSiteList.length > 0;
    return (
      <div>
        <div className='my-4 p-4 container card' style={{ maxWidth: '700px' }} onSubmit={event => event.preventDefault()}>
          {scheduleBlockActive &&
            <div>
              <h5 class="card-title">Scheduled Block</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Blocked until: {blockHelpers.getTodaysBlockData().endTime}</li>
              </ul>
            </div>
          }
          {
            (siteBlockActive && scheduleBlockActive) && <br />
          }
          {
            siteBlockActive &&
            <div>
              <h5 class="card-title">Active Blocks</h5>
              <ul class="list-group list-group-flush">
                {
                  blockedSiteList.map(site => {
                    return <li class="list-group-item">{site.url} - Blocked Until: {moment(site.siteBlockedUntil).format("h:mm a")}</li>
                  })
                }
              </ul>
            </div>
          }
          {
            (!siteBlockActive && !scheduleBlockActive) &&
            <h5 class="card-title">No Active Blocks</h5>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    schedulingOn: state.schedulingOn,
    schedulingData: state.schedulingData,
    siteList: state.siteList
  }
};

export default connect(mapStateToProps)(Dashboard);