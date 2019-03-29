/* global chrome */
import React, { Component } from 'react';

class ManageSites extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {siteList: [], editMode: false , newSiteInput: ''};
        this.addWebsite = this.addWebsite.bind(this);
    }

    componentWillMount() {
    chrome.storage.sync.get(['siteList'], (result) => {
        if (result.siteList){
            this.setState({siteList: result.siteList});
        }
    })}


    addWebsite(event){
        event.preventDefault();
        let newSite = this.state.newSiteInput;
        let appendedSiteList = this.state.siteList
        appendedSiteList.push(newSite);
        chrome.storage.sync.set({siteList: appendedSiteList}, () => {
            this.setState({siteList: appendedSiteList, newSiteInput: ''});
            document.querySelector('#newSiteInput').value = "";  
        }
        )};

    render() {
        return (
            <div className='py-2 px-4'>
                {this.state.editMode ?
                    <button type="submit" class="btn btn-danger mb-2"
                        onClick={(event) => this.setState({ editMode: false })}>Stop Editting</button> :
                    <button type="submit" class="btn btn-success mb-2"
                        onClick={(event) => this.setState({ editMode: true })}>Edit</button>
                }
                <div>
                <ul class="list-group px-4 py-2">
                    {this.state.editMode ?
                        <li class="list-group-item py-1">
                        <form onSubmit={this.addWebsite}>
                            <div className="form-group mb-0">
                                <input type="text" className="form-control border-0 text-center" id="newSiteInput" 
                                placeholder="Add new site here" pattern="[a-zA-Z0-9\-\_]+\.[a-zA-Z0-9\.]+"
                                onChange={(e) => this.setState({newSiteInput: e.target.value})} required />
                            </div>
                        </form>
                        </li>
                    : null}
                    { this.state.siteList.map((site) => {
                        return (<li class="list-group-item">
                        <div>{site}</div>
                        </li>)
                    })}
                </ul>
                </div>
            </div>
        )
    }
}

export default ManageSites;