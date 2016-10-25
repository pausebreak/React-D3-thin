import React, { Component } from 'react';
import logo from './logo.svg';
import Graphy from './React-Graph.js';
import graph from './stacked.js';
import './App.css';

class App extends Component {

  render() {
    const { count, data } = this.props.state;

    return (
      <div className="App">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <Graphy data={data} graph={graph} count={count} id={"ff"} coordinateSystem={{ width: 500, height: 500}}/>
      </div>
    );
  }
}

export default App;
