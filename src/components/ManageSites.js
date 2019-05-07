/* global chrome */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import blockHelpers from '../helpers/blockHelper';
import SiteBlockModal from './SiteBlockModal';

class ManageSites extends Component {
  constructor(props) {
    super(props);

    this.state = { siteList: [], newSiteInput: '', schedulingOn: false, blockModalSite: null};
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
    let newSite = { url: this.state.newSiteInput, tempUnblockedUntil: moment().valueOf(), siteBlockedUntil: moment().valueOf() - 1 };
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
    if (!blockHelpers.isScheduleBlockCurrentlyActive() && !blockHelpers.isSiteBlockActive(site)){
      return (
        <div className="col-2 badge badge-secondary site-status text-white" style={{ padding: '6px' }}>
          <i className="fas fa-unlock"></i>&nbsp;&nbsp;No block
        </div>)
    }
    if (blockHelpers.isSiteTempUnblocked(site)) {
      return (
        <div className="col-2 badge badge-success site-status hint--bottom-right hint--success text-white" style={{ padding: '6px' }} aria-label={"Temporarily Unblocked until: " + moment(site.tempUnblockedUntil).format("h:mm a")}>
          <i className="fas fa-unlock"></i>&nbsp;&nbsp;{moment(site.tempUnblockedUntil).toNow(true)}
        </div>)
    } else {
      let scheduleEndTime = moment(this.props.schedulingData[moment().weekday()].endTime, "h:m A");
      let blockEndTime = moment(site.siteBlockedUntil);
      return (
        <div className="col-2 badge badge-danger site-status hint--bottom-right hint--error text-white" style={{ padding: '6px' }} 
        aria-label={"Blocked until: " + moment.max(scheduleEndTime, blockEndTime).format("h:mm a")}
        >
          <i className="fas fa-lock"></i>&nbsp;&nbsp;Blocked
      </div>)
    }
  }

  setSiteBlock(event, blockedSite){
    event.preventDefault();
    this.setState({blockModalSite: blockedSite});
  }

  saveSiteBlock(blockedSite){
    let modifiedSiteList = this.state.siteList;
    let index = modifiedSiteList.findIndex(site => (site.url === blockedSite.url));
    modifiedSiteList[index] = blockedSite;
    chrome.storage.sync.set({ siteList: modifiedSiteList }, () => {
      this.setState({ siteList: modifiedSiteList});
    });
  }

  deleteWebsite(event, deletedSite) {
    event.preventDefault(); 
    if (blockHelpers.isScheduleBlockCurrentlyActive()){
      alert("Cannot delete site until block is finished");
      return; 
    }
    let appendedSiteList = this.state.siteList;
    appendedSiteList = appendedSiteList.filter(site => { return (site.url !== deletedSite.url) });
    chrome.storage.sync.set({ siteList: appendedSiteList }, () => {
      this.setState({ siteList: appendedSiteList });
    });
  }

  render() {
    return (
      <div>
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
            {this.state.siteList.map((site, index) => {
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
                        <button data-toggle="modal" data-target="#siteBlockModal" onClick={(event) => { this.setSiteBlock(event, site);}} className="dropdown-item">Block</button>
                        <button onClick={(event) => { this.deleteWebsite(event, site); }} className="dropdown-item">Delete</button>
                      </div>
                    </div>
                  </div>
                </li>)
            })}
          </ul>
        </div>
      </div>
      <SiteBlockModal blockedSite = {this.state.blockModalSite} saveSiteBlock = {() => this.saveSiteBlock(this.state.blockModalSite, this.state.siteList)} />
      </div>
    )
  }
}

export default ManageSites;