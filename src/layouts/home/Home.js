import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <p>This is your own container</p>
            <div>{ this.props.children }</div>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
