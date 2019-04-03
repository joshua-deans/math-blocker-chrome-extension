/* global chrome */
import React, { Component } from 'react';

class OtherSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = { questionDelay: "2" };
    this.updateQuestionDelay = this.updateQuestionDelay.bind(this);
  }

  componentWillMount() {
    chrome.storage.sync.get(['questionDelay'], (result) => {
      if (result.questionDelay) {
        this.setState({ questionDelay: result.questionDelay });
      } else {
        this.setState({ questionDelay: "2" });
      }
      document.querySelector('#questionDelay').value = this.state.questionDelay;
    });
  }

  updateQuestionDelay(event) {
    let delayValue = document.querySelector('#questionDelay').value;
    chrome.storage.sync.set({questionDelay: delayValue}, () => {
      this.setState({questionDelay: delayValue})
  })};

  render() {
    return (
      <form className='my-4 py-4 container card' style={{ maxWidth: '700px' }} onSubmit={event => event.preventDefault()}>
        <div className="form-group row p-2">
          <label for="questionDelay" className="col-6 col-form-label">Time between question popups</label>
          <div class="col-6">
            <select class="form-control" name="questionDelay" id="questionDelay" onChange={this.updateQuestionDelay}>
              <option value="2">2 minutes</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
        </div>
      </form>
    )
  }
}

export default OtherSettings;