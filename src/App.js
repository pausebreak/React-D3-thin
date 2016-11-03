import React, { PropTypes, Component } from 'react';
import logo from './logo.svg';
import Graphy from './React-Graph.js';
import graph from './stacked.js';
import './App.css';

class App extends Component {

  static propTypes = {
    state: PropTypes.shape({
      data: PropTypes.array.isRequired,
      handlers: PropTypes.shape({
        tooltip: PropTypes.shape({
          over: PropTypes.func.isRequired,
          out: PropTypes.func.isRequired,
          move: PropTypes.func.isRequired
        }).isRequired,
      }).isRequired
    }).isRequired
  }

  render() {
    const { data, handlers } = this.props.state
    const config = {
      xAxisDomainKey: "name",
      xAxisLabel: "Rooms",
      yAxisLabel: "Pets",
      stackKeys: ["dogs", "cats", "goats"],
      id: "stack",
      // this becomes viewBox but is also used for internal
      // calculations similar to http://bl.ocks.org/mbostock/3019563
      coordinateSystem: { x:0, y:0, width: 800, height: 600 },
      tooltip: handlers.tooltip
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
