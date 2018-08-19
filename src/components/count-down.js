import React, { Component } from 'react'

class CountDown extends Component {
  interval = null;

  componentWillMount() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = null;
  }

  get secondsUntilEnd() {
    return parseInt(this.props.endTime - (Date.now()/1000), 10);
  }

  render() {
    return (
      <span>{ this.secondsUntilEnd } seconds</span>
    );
  }
}

export default CountDown