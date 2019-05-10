import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import blockHelpers from '../helpers/blockHelper';

class SiteBlockModal extends Component {
  constructor(props){
    super(props);
    let hourFromNow = moment().add(1, 'h').format("HH:mm");
    if (this.props.blockedSite != null && blockHelpers.isSiteBlockActive(this.props.blockedSite)){
      this.state = {willBeBlockedUntil: this.props.blockedSite.siteBlockedUntil, time: hourFromNow};
    } else {
      this.state = {willBeBlockedUntil: moment().valueOf(), time: hourFromNow};
    }
  }

  saveChanges(event){
    event.preventDefault();
    let timeSet = moment(this.state.time, "HH:mm");
    if (timeSet.isBefore(moment())){
      timeSet.add(1, 'd');
    }
    let blockedSite = this.props.blockedSite;
    if (timeSet.isBefore(blockedSite.siteBlockedUntil)){
      return;
    }
    if (window.confirm(`Would you like to block ${this.props.blockedSite.url} for ${moment().to(timeSet, true)}?`)){
      blockedSite.siteBlockedUntil = timeSet.valueOf();
      this.props.saveSiteBlock();
      document.querySelector('#site-block-close').click();
    }
  }

  render() {
    return (
      <div className="modal" id="siteBlockModal" tabindex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
              {this.props.blockedSite != null &&
              <p>Set block for: {this.props.blockedSite.url}</p> }
              </h5>
              <button type="button" id="site-block-close" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              { (this.props.blockedSite != null) ?
                <div>
                  {
                    (blockHelpers.isSiteBlockActive(this.props.blockedSite) ?
                    <p className="h6 pb-3">Block Active Until: {moment(this.props.blockedSite.siteBlockedUntil).format("h:mm a")} </p> : 
                    <p className="h6 pb-3">No block active</p> )
                  }
                </div> : null
              }
              <form onSubmit={event => event.preventDefault()}>
                <div className="form-row">
                  <div className="col-6 my-auto">
                  <label className="my-0">Block Until: </label>
                  </div>
                  {
                    (this.state != null) ?
                    <div className="col-4">
                      <input type="time" onChange={event => this.setState({time: event.target.value})} value={this.state.time} className="form-control"/>
                    </div> : null
                  }
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={event => this.saveChanges(event)}>Save</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
    
export default connect()(SiteBlockModal);