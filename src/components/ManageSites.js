/* global chrome */
import React, { Component } from 'react';
import moment from 'moment';

class ManageSites extends React.Component {
  constructor(props) {
    super(props);


    this.state = { siteList: [], newSiteInput: '' };
    this.addWebsite = this.addWebsite.bind(this);
  }

  componentWillMount() {
    chrome.storage.sync.get(['siteList'], (result) => {
      if (result.siteList) {
        this.setState({ siteList: result.siteList });
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
    if (moment(site.validUntil).isAfter(moment())){
      return (
      <div class="badge badge-warning site-status hint--bottom-right hint--warning text-white" style={{padding: '8px'}} aria-label={"Temporarily Unblocked until: " + moment(site.validUntil).format("h:mm a")}>
        <i class="fas fa-unlock"></i>&nbsp;&nbsp;{moment(site.validUntil).toNow(true)}
      </div>)
    } else {
    return (
      <div class="badge badge-danger site-status hint--bottom-right hint--error text-white" style={{padding: '8px'}} aria-label="Blocked">
        <i class="fas fa-lock"></i>&nbsp;&nbsp;Blocked
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
            {this.state.siteList.map((site) => {
              return (
                <li class="list-group-item">
                  <div class="list-flex">
                    {this.getStatus(site)}
                  <span>{site.url}</span>
                    <div class="dropdown">
                      <button type="button" className="float-right btn btn-sm btn-link text-body"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="fas fa-ellipsis-v"></span>
                      </button>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <button onClick={(event) => { event.preventDefault(); this.deleteWebsite(site); }} class="dropdown-item" href="#">Delete</button>
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