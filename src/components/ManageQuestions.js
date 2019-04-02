/* global chrome */
import React, { Component } from 'react';

class ManageQuestions extends React.Component {
    constructor(props){
        super(props);

        this.state = {questionDifficulty: 1, numQuestions: 1};
        this.updateNumQuestions = this.updateNumQuestions.bind(this);
        this.updateQuestionDifficulty = this.updateQuestionDifficulty.bind(this);
    }

    componentWillMount() {
        chrome.storage.sync.get(['questionDifficulty'], (result) => {
            if (result.questionDifficulty){
                this.setState({questionDifficulty: result.questionDifficulty});
            } else {
                this.setState({questionDifficulty: 1});
            }
        });

        chrome.storage.sync.get(['numQuestions'], (result) => {
            if (result.numQuestions){
                this.setState({numQuestions: result.numQuestions});
            } else {
                this.setState({numQuestions: 1});
            }
        })
    }

    updateNumQuestions(event){
        let newVal = event.target.value;
        if (!isNaN(newVal) && newVal >= 1 && newVal <= 10){
            chrome.storage.sync.set({numQuestions: newVal}, () => {
                this.setState({numQuestions: newVal});
            })
        }
    }

    updateQuestionDifficulty(event){
        let newVal = event.target.value;
        if (!isNaN(newVal) && newVal >= 1 && newVal <= 5){
            chrome.storage.sync.set({questionDifficulty: newVal}, () => {
                this.setState({questionDifficulty: newVal})
            })
        }
    }
    
    render() {
      return (
          <form className='my-4 py-4 container card' style={{ maxWidth: '700px' }} onSubmit={event => event.preventDefault()}>
              <div className="form-group row p-2">
                  <label for="numQuestions" className="col-5 col-form-label">Number of questions</label>
                  <div class="col-7">
                      <input type="number" min="1" max="10" className="form-control" id="numQuestions" placeholder="" value={this.state.numQuestions}
                          onChange={this.updateNumQuestions} />
                  </div>
              </div>

              <div className="form-group row p-2">
                  <label for="questionDifficulty" className="col-5 col-form-label">Question Difficulty: {this.state.questionDifficulty}</label>
                  <div class="col-7 my-auto">
                      <input type="range" className="custom-range" min="1" max="5" class="form-control-range" id="questionDifficulty" value={this.state.questionDifficulty}
                          onChange={this.updateQuestionDifficulty} />
                  </div>
              </div>
          </form>
      );
    }
  }

  export default ManageQuestions;