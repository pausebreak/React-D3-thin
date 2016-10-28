import React, { Component } from 'react';
import logo from './logo.svg';
import Graphy from './React-Graph.js';
import graph from './stacked.js';
import './App.css';

class App extends Component {

  render() {
    const { data } = this.props.state
    const config = {
      xAxisDomainKey: "name",
      xAxisLabel: "Rooms",
      yAxisLabel: "Pets",
      stackKeys: ["dogs", "cats", "goats"],
      id: "stack",
      // this becomes viewBox but is also used for internal
      // calculations similar to http://bl.ocks.org/mbostock/3019563
      coordinateSystem: { x:0, y:0, width: 800, height: 600 }
    };

    return (
      <div className="App">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Graphy data={data} graph={graph} config={config} />
      </div>
    );
  }
}

export default App;
