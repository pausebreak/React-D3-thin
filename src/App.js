import React, { PropTypes, Component } from 'react';
import logo from './logo.svg';
import Graphy from './React-Graph.js';
import graph from './stacked-horizontal.js';
import Tooltip from './Tooltip.js';
import StackTooltipContent from './StackTooltipContent.js';
import './App.css';
import './stacked-horizontal.css';

class App extends Component {

  static propTypes = {
    state: PropTypes.shape({
      data: PropTypes.array.isRequired,
      showTooltip: PropTypes.bool,
      tooltipX: PropTypes.number,
      tooltipY: PropTypes.number,
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
    const { data, handlers, showTooltip, tooltipX, tooltipY, tooltipData } = this.props.state
    const graphConfig = {
      domainKey: "name",
      domainLabel: "Rooms",
      stackLabel: "Pets",
      stackKeys: ["dogs", "cats", "goats"],
      // this should be derived or imported
      svgClass: "stackedHorizontal",
      id: "stack",
      // this becomes viewBox but is also used for internal
      // calculations similar to http://bl.ocks.org/mbostock/3019563
      coordinateSystem: { x:0, y:0, width: 800, height: 600 },
      tooltip: handlers.tooltip
    };

    let tooltipOut = null;
    if (tooltipData) {
      const value = tooltipData[tooltipData.key];
      tooltipOut = (
        <StackTooltipContent header={tooltipData.name} segment={tooltipData.key} value={value} />
      );
    }

    return (
      <div className="App">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Graphy data={data} graph={graph} config={graphConfig} />
        <Tooltip show={showTooltip} x={tooltipX} y={tooltipY}>
          {tooltipOut}
        </Tooltip>
      </div>
    );
  }
}

export default App;
