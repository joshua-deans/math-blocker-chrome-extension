/* global chrome */
import React, { Component } from 'react';
import moment from 'moment';

class ManageSites extends Component {
  constructor(props) {
    super(props);

    this.state = { siteList: [], newSiteInput: '', schedulingOn: false};
    this.addWebsite = this.addWebsite.bind(this);
  }

  componentWillMount() {
    chrome.storage.sync.get(['siteList'], (result) => {
      if (result.siteList) {
        this.setState({ siteList: result.siteList });
      }
      if (result.schedulingOn) {
        this.setState({schedulingOn: result.schedulingOn});
      }
    })
  }


  addWebsite(event) {
    event.preventDefault();
    let newSite = { url: this.state.newSiteInput, validUntil: moment().valueOf() };
    let appendedSiteList = this.state.siteList;
    if (newSite.url.includes(".") && !appendedSiteList.some(site => { return (site.url === newSite.url); })) {
      appendedSiteList.push(newSite);
      chrome.storage.sync.set({ siteList: appendedSiteList }, () => {
        this.setState({ siteList: appendedSiteList, newSiteInput: '' });
        document.querySelector('#newSiteInput').value = "";
      });
    }
  };

  getStatus(site) {
    if (!this.isScheduleBlockOn()){
      return (
        <div className="col-2 badge badge-secondary site-status text-white" style={{ padding: '6px' }}>
          <i className="fas fa-unlock"></i>&nbsp;&nbsp;No block
        </div>)
    }
    if (moment(site.validUntil).isAfter(moment())) {
      return (
        <div className="col-2 badge badge-success site-status hint--bottom-right hint--success text-white" style={{ padding: '6px' }} aria-label={"Temporarily Unblocked until: " + moment(site.validUntil).format("h:mm a")}>
          <i className="fas fa-unlock"></i>&nbsp;&nbsp;{moment(site.validUntil).toNow(true)}
        </div>)
    } else {
      return (
        <div className="col-2 badge badge-danger site-status hint--bottom-right hint--error text-white" style={{ padding: '6px' }} aria-label="Blocked">
          <i className="fas fa-lock"></i>&nbsp;&nbsp;Blocked
      </div>)
    }
  }

  deleteWebsite(deletedSite) {
    let appendedSiteList = this.state.siteList;
    appendedSiteList = appendedSiteList.filter(site => { return (site.url !== deletedSite.url) });
    chrome.storage.sync.set({ siteList: appendedSiteList }, () => {
      this.setState({ siteList: appendedSiteList });
    });
  }

  isScheduleBlockOn(){
    if (this.props.schedulingOn && this.props.schedulingData[moment().weekday()].enabled &&
            moment().isSameOrAfter(moment(this.props.schedulingData[moment().weekday()].startTime, "h:m A")) &&
            moment().isBefore(moment(this.props.schedulingData[moment().weekday()].endTime, "h:m A"))){
              return true;
            }
    else {
      return false;
    }
  }

  render() {
    return (
      <div className='py-2 container' style={{ maxWidth: '700px' }}>
        <div>
          <ul className="list-group px-4 py-2">
            <li className="list-group-item py-1">
              <form onSubmit={this.addWebsite}>
                <div className="form-group mb-0">
                  <input type="text" className="form-control border-0 text-center" id="newSiteInput"
                    placeholder="Add site (e.g. facebook.com)"
                    onChange={(e) => this.setState({ newSiteInput: e.target.value })} required />
                </div>
              </form>
            </li>
          </ul>
          <ul className="list-group px-4 py-2">
            <li className="list-group-item row mx-0">
              <div className="dropdown col pr-0">
                <button type="button" className="float-right btn btn-sm btn-link text-body"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="fas fa-ellipsis-v"></span>
                </button>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                  <button onClick={(event) => { event.preventDefault(); }} className="dropdown-item" href="#">Block All</button>
                </div>
              </div>
            </li>
            {this.state.siteList.map((site) => {
              return (
                <li className="list-group-item row mx-0">
                  <div className="list-flex">
                    {this.getStatus(site)}
                    <span className="col-9">{site.url}</span>
                    <div className="dropdown col-1 pr-0">
                      <button type="button" className="float-right btn btn-sm btn-link text-body"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="fas fa-ellipsis-v"></span>
                      </button>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                        <button onClick={(event) => { event.preventDefault();}} className="dropdown-item">Block</button>
                        <button onClick={(event) => { event.preventDefault(); this.deleteWebsite(site); }} className="dropdown-item">Delete</button>
                      </div>
                    </div>
                  </div>
                </li>)
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default ManageSites;