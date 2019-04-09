/* global chrome */
import React, { Component } from 'react';

class Schedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  dayEnabled(){

  }

  render() {
    let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    daysOfWeek.map(day => console.log(day));
    return (
      <div className="w-100">
        <div className="container text-left">
          {daysOfWeek.map(day => {
            return (
              <div className="row mx-2 p-1 my-1">
                <div className="form-check col-sm-3">
                  <input className="form-check-input" type="checkbox" value="" id={day.toLowerCase() + "Check"} 
                  onChange={this.dayEnabled}
                  />
                  <label className="form-check-label" for={day.toLowerCase() + "Check"}>
                    {day}
                  </label>
                </div>
                <div className="col-sm-9">
                  <div class="form-group">
                    <input type="range" class="form-control-range" id={day.toLowerCase() + "ControlRange"} />
                  </div>
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