import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

let data = [
  {name: 'A', ducks: 4000, cats: 2400, goats: 2400, dogs: 2000},
  {name: 'B', ducks: 3000, cats: 1398, goats: 2210, dogs: 3333},
  {name: 'C', ducks: 2000, cats: 9800, goats: 2290, dogs: 0},
  {name: 'D', ducks: 2780, cats: 3908, goats: 2000, dogs: 0},
  {name: 'E', ducks: 1890, cats: 4800, goats: 2181, dogs: 0},
  {name: 'F', ducks: 2390, cats: 3800, goats: 2500, dogs: 0},
  {name: 'G', ducks: 3490, cats: 4300, goats: 2100, dogs: 0}
];

let handlers = {
  tooltip: {
    over: showTooltip,
    out: hideTooltip,
    move: moveTooltip
  }
};

const localState = {data: data, handlers: handlers};

function showTooltip(d) {
  console.log("App renderTooltip", d);
  localState.showTooltip = true;
  render(localState);
}

function hideTooltip(d) {
  console.log("App hideTooltip", d);
  localState.showTooltip = false;
  render(localState);
}

function moveTooltip (x, y) {
  console.log("App move", x, y);
  localState.tooltipX = x;
  localState.tooltipY = y;
  render(localState);
}

function render(state) {
  ReactDOM.render(
    <App state={state} />,
    document.getElementById('root')
  );
}

render(localState);

window.setTimeout(() => {
  localState.data.push({name: 'H', ducks: 3490, cats: 4300, goats: 2900, dogs: 16660});
  render(localState);
  },
  2500);
