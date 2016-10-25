import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

let data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400, xv: 2000},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210, xv: 3333},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290, xv: 0},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000, xv: 0},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181, xv: 0},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500, xv: 0},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100, xv: 0}
];

ReactDOM.render(
  <App state={{count: 1, data: data}} />,
  document.getElementById('root')
);

window.setTimeout(() => {

data.push({name: 'Page H', uv: 3490, pv: 4300, amt: 2900, xv: 0});

ReactDOM.render(
  <App state={{count: 2, data: data}} />,
  document.getElementById('root')
);

}, 2000);
