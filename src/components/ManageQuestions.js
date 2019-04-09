/* global chrome */
import React, { Component } from 'react';

class ManageQuestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = { questionDifficulty: 1, numQuestions: 1, questionDelay: "2" };
    this.updateNumQuestions = this.updateNumQuestions.bind(this);
    this.updateQuestionDifficulty = this.updateQuestionDifficulty.bind(this);
    this.updateQuestionDelay = this.updateQuestionDelay.bind(this);
  }

  componentWillMount() {
    chrome.storage.sync.get(['questionDifficulty'], (result) => {
      if (result.questionDifficulty) {
        this.setState({ questionDifficulty: result.questionDifficulty });
      } else {
        this.setState({ questionDifficulty: 1 });
      }
    });

    chrome.storage.sync.get(['numQuestions'], (result) => {
      if (result.numQuestions) {
        this.setState({ numQuestions: result.numQuestions });
      } else {
        this.setState({ numQuestions: 1 });
      }
    })

    chrome.storage.sync.get(['questionDelay'], (result) => {
      if (result.questionDelay) {
        this.setState({ questionDelay: result.questionDelay });
      } else {
        this.setState({ questionDelay: "2" });
      }
    });
  }

  updateNumQuestions(event) {
    let newVal = event.target.value;
    if (!isNaN(newVal) && newVal >= 1 && newVal <= 10) {
      chrome.storage.sync.set({ numQuestions: newVal }, () => {
        this.setState({ numQuestions: newVal });
      })
    }
  }

  updateQuestionDifficulty(event) {
    let newVal = event.target.value;
    if (!isNaN(newVal) && newVal >= 1 && newVal <= 5) {
      chrome.storage.sync.set({ questionDifficulty: newVal }, () => {
        this.setState({ questionDifficulty: newVal })
      })
    }
  }

  updateQuestionDelay(event) {
    let delayValue = document.querySelector('#questionDelay').value;
    chrome.storage.sync.set({ questionDelay: delayValue }, () => {
      this.setState({ questionDelay: delayValue })
    })
  };

  render() {
    return (
      <form className='my-4 py-3 px-2 container card' style={{ maxWidth: '700px' }} onSubmit={event => event.preventDefault()}>
        <div className="form-group row p-2">
          <label for="numQuestions" className="col-5 col-form-label text-right">Number of questions</label>
          <div class="col-6">
            <input type="number" min="1" max="10" className="form-control" id="numQuestions" placeholder="" value={this.state.numQuestions}
              onChange={this.updateNumQuestions} />
          </div>
        </div>
        <div className="form-group row p-2">
          <label for="questionDifficulty" className="col-5 col-form-label text-right">Question Difficulty ({this.state.questionDifficulty})</label>
          <div class="col-6 my-auto">
            <input type="range" className="custom-range" min="1" max="5" class="form-control-range" id="questionDifficulty" value={this.state.questionDifficulty}
              onChange={this.updateQuestionDifficulty} />
          </div>
        </div>
        <div className="form-group row p-2">
          <label for="questionDelay" className="col-5 col-form-label text-right">Time between question popups</label>
          <div class="col-6">
            <select class="form-control" name="questionDelay" id="questionDelay" onChange={this.updateQuestionDelay} value={this.state.questionDelay}>
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
    );
  }
}

export default ManageQuestions;