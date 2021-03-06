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

let localState = {data: data, handlers: handlers};

// mori where are you?
function mutate(state) {

  const mutation = Object.assign({}, localState, state);

  localState = mutation;

  return mutation;
}

function showTooltip(d) {
  render(mutate({showTooltip: true, tooltipData: d}));
}

function hideTooltip() {
  render(mutate({showTooltip: false}));
}

function moveTooltip (x, y) {
  // here is where we set the offsets based on
  // on the shape of StackTooltipContent
  render(mutate({tooltipX: x-35, tooltipY: y-40}));
}

function render(state) {
  ReactDOM.render(
    <App state={state} />,
    document.getElementById('root')
  );
}

render(localState);

window.setTimeout(() => {
  const d = localState.data.slice();
  d.push({name: 'H', ducks: 3490, cats: 4300, goats: 2900, dogs: 16660});
  render(mutate({data: d}));
  },
  2500);
