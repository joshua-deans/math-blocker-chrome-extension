/* global chrome */
import React, { Component } from 'react';
import Schedule from './Schedule';
import noUiSlider from 'nouislider';

class ManageSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = { schedulingOn: false };
    this.changeScheduleStatus = this.changeScheduleStatus.bind(this);
  }

  componentWillMount() {
    chrome.storage.sync.get(['schedulingOn'], (result) => {
      if (result.schedulingOn) {
        this.setState({ schedulingOn: result.schedulingOn });
      }
    })
  }

  changeScheduleStatus(event) {
    let scheduleStatus;
    if (event.target.id === 'schedulingOn'){
      scheduleStatus = true;
    } else if (event.target.id === 'schedulingOff'){
      scheduleStatus = false;
    }
    else {
      return;
    }
    chrome.storage.sync.set({ schedulingOn: scheduleStatus }, () => {
      this.setState({ schedulingOn: scheduleStatus })
    })
  }

  getScheduleContent() {
    if (!this.state.schedulingOn) {
      return (<div class="w-100 h6 text-muted">Scheduling is not enabled</div>);
    } else if (this.state.schedulingOn) {
      return <Schedule />;
    }
  }

  render() {
    return (
      <form className='my-4 p-2 container card' style={{ maxWidth: '775px' }} onSubmit={event => event.preventDefault()}>
        <div className="row p-2 mb-1 w-100 mx-auto">
          <label for="scheduleStatus" className="col-6 col-form-label text-right">Schedule Type</label>
          <div class="col-4 py-2 text-left">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="schedulingStatus" id="schedulingOn" value="on" checked={this.state.schedulingOn} onChange={this.changeScheduleStatus} />
              <label class="form-check-label" for="SchedulingOn">On</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="schedulingStatus" id="schedulingOff" value="off" checked={!this.state.schedulingOn} onChange={this.changeScheduleStatus} />
              <label class="form-check-label" for="SchedulingOff">Off</label>
            </div>
          </div>
        </div>
        <div className="form-group row w-100 mx-auto">
          {this.getScheduleContent()}
        </div>
      </form>
    );
  }
}

export default ManageSchedule;