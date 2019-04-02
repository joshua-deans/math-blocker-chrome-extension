/* global chrome */
import React, { Component } from 'react';

class ManageSites extends React.Component {
  constructor(props) {
    super(props);

    this.state = { siteList: [], editMode: false, newSiteInput: '' };
    this.addWebsite = this.addWebsite.bind(this);
  }

  componentWillMount() {
    chrome.storage.sync.get(['siteList'], (result) => {
      if (result.siteList) {
        this.setState({ siteList: result.siteList });
      }
      console.log(this.state.siteList);
    })
  }


  addWebsite(event) {
    event.preventDefault();
    let newSite = {url: this.state.newSiteInput, nextQuestion: -1};
    let appendedSiteList = this.state.siteList;
    if (newSite.url.includes(".") && !appendedSiteList.some( site => {return (site.url === newSite.url);})) {
      appendedSiteList.push(newSite);
      chrome.storage.sync.set({ siteList: appendedSiteList }, () => {
        this.setState({ siteList: appendedSiteList, newSiteInput: '' });
        document.querySelector('#newSiteInput').value = "";
      });
    }
  };

  deleteWebsite(deletedSite) {
    let appendedSiteList = this.state.siteList;
    appendedSiteList = appendedSiteList.filter(site => {return (site.url !== deletedSite.url)} );
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
                    placeholder="Add new site here"
                    onChange={(e) => this.setState({ newSiteInput: e.target.value })} required />
                </div>
              </form>
            </li>
          </ul>
          <ul className="list-group px-4 py-2">
            {this.state.siteList.map((site) => {
              return (<li class="list-group-item">
                <div>
                  <span>{site.url}</span>
                  <button type="button" className="float-right btn btn-sm btn-danger" aria-label="Close"
                    onClick={(event) => { event.preventDefault(); this.deleteWebsite(site); }}>
                    <span className="fas fa-trash-alt" />
                  </button>
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