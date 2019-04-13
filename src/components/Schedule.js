/* global chrome */
import React, { Component } from 'react';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
const LocalTime = require("js-joda").LocalTime;

class Schedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      days: [
        { name: "Monday", enabled: false, startTime: '12:00 AM', endTime: '11:45 PM', startTimeUnencoded: null, endTimeUnencoded: null },
        { name: "Tuesday", enabled: false, startTime: '12:00 AM', endTime: '11:45 PM', startTimeUnencoded: null, endTimeUnencoded: null },
        { name: "Wednesday", enabled: false, startTime: '12:00 AM', endTime: '11:45 PM', startTimeUnencoded: null, endTimeUnencoded: null },
        { name: "Thursday", enabled: false, startTime: '12:00 AM', endTime: '11:45 PM', startTimeUnencoded: null, endTimeUnencoded: null },
        { name: "Friday", enabled: false, startTime: '12:00 AM', endTime: '11:45 PM', startTimeUnencoded: null, endTimeUnencoded: null },
        { name: "Saturday", enabled: false, startTime: '12:00 AM', endTime: '11:45 PM', startTimeUnencoded: null, endTimeUnencoded: null },
        { name: "Sunday", enabled: false, startTime: '12:00 AM', endTime: '11:45 PM', startTimeUnencoded: null, endTimeUnencoded: null }]
    };

    this.changeDayEnabled = this.changeDayEnabled.bind(this);
  }

  componentDidMount() {
    chrome.storage.sync.get(['schedulingData'], (result) => {
      if (result.schedulingData) {
        this.setState({ days: result.schedulingData });
        var slider = document.querySelectorAll('.controlRange');
        slider.forEach(this.setUpSlider);
      }
    })
  }

  setUpSlider = (slide, index) => {
    const setUpTime = this.setUpTime;
    let startTimes = [0, 23.75];
    if (this.state.days[index].startTimeUnencoded){
      startTimes[0] = this.state.days[index].startTimeUnencoded;
    }
    if (this.state.days[index].endTimeUnencoded){
      startTimes[1] = this.state.days[index].endTimeUnencoded;
    }
    console.log(this.state);
    noUiSlider.create(slide, {
      start: startTimes,
      connect: true,
      range: {
        'min': 0,
        'max': 23.75
      },
      step: .25,
      format: {
        to: setUpTime,
        from: function (value) {
            return value;
        }
    }
    })
    slide.noUiSlider.on('update', (value, handle, unencoded) => {
      let changedState = this.state.days.slice(0);
      changedState[index].startTime = value[0];
      changedState[index].endTime = value[1];
      changedState[index].startTimeUnencoded = unencoded[0];
      changedState[index].endTimeUnencoded = unencoded[1];
      this.setState({ days: changedState });
    })
    slide.noUiSlider.on('change', (value, handle, unencoded) => {
      let changedState = this.state.days.slice(0);
      changedState[index].startTime = value[0];
      changedState[index].endTime = value[1];
      changedState[index].startTimeUnencoded = unencoded[0];
      changedState[index].endTimeUnencoded = unencoded[1];
      chrome.storage.sync.set({ schedulingData: changedState }, () => {
        this.setState({ days: changedState });
      })
    });
  }

  setUpTime(value) {
    let suffix = "AM";
    if (value >= 12) {
      value -= 12;
      suffix = "PM";
    }
    if (Math.floor(value) === 0) {
      value += 12;
    }
    if (Math.round((value % 1) * 60) === 0) {
      return Math.floor(value) + ":00 " + suffix;
    }
    else if (Math.round((value % 1) * 60) === 60) {
      return Math.floor(value + 1) + ":00 " + suffix;
    }
    else {
      return Math.floor(value) + ':' + Math.round((value % 1) * 60) + " " + suffix;
    }
  };

  changeDayEnabled(day, index) {
    let updatedDays = this.state.days;
    updatedDays[index].enabled = !updatedDays[index].enabled;
    chrome.storage.sync.set({ schedulingData: updatedDays }, () => {
      this.setState({days: updatedDays});
    })
  }

  render() {
    return (
      <div className="w-100">
        <div className="container text-left">
          {this.state.days.map((day, index) => {
            return (
              <div className="row align-items-center mx-2 p-1 my-2">
                <div className="form-group col-md-3">
                  <input className="form-check-input" type="checkbox" value="" id={day.name.toLowerCase() + "Check"}
                    checked={day.enabled} onChange={(event) => this.changeDayEnabled(day, index)}
                  />
                  <label className="form-check-label" for={day.name.toLowerCase() + "Check"}>
                    {day.name}
                  </label>
                </div>
                <div className="form-group col-sm-3 col-md-2">
                  <input type="text" readonly className="form-control-plaintext" value={day.startTime} />
                </div>
                <div className="col-sm-6 col-md-5">
                  <div className="form-group">
                    <div type="range" className="controlRange" id={day.name.toLowerCase() + "ControlRange"} disabled={!day.enabled} />
                  </div>
                </div>
                <div className="form-group col-sm-3 col-md-2">
                  <input type="text" readonly className="form-control-plaintext" value={day.endTime} />
                </div>
              </div>
            )
          })
          }
        </div>
      </div>
    );
  }
}

export default Schedule;