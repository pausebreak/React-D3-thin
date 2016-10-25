import React, { Component, PropTypes } from 'react';
import { schemeCategory20, scaleLinear, scaleBand, select, stack, max, scaleOrdinal, axisBottom } from 'd3';
import './App.css';


function setup(id, width, height) {

  const svg = select(`#${id}`).attr("style", "background-color: red;");
  const x = scaleBand().rangeRound([0, width], .35);
  const y = scaleLinear().rangeRound([height, 0]);
  const color = scaleOrdinal(schemeCategory20);



}

function graph(id, data, width, height) {

  const svg = select(`#${id}`).attr("style", "background-color: red;");
  const x = scaleBand().rangeRound([0, width], .35);
  const y = scaleLinear().rangeRound([height, 0]);
  const color = scaleOrdinal(schemeCategory20);

// derive
var keys = ["amt", "pv", "uv", "xv"];
var series = stack().keys(keys)(data);

var xData = data.map((d) => { return d.name; } );
x.domain(xData);

// derive
y.domain([0, 25000])
  .nice();

let stacks = svg.selectAll(".stack").data(series).enter()
  .append("g")
    .attr("class", "stack")
    .style("fill", (d, i) => color(i));

let rectangles = stacks.selectAll("rect").data((d) => d);

rectangles.enter()
  .append("rect")
    .attr("width", x.bandwidth())
    .attr("x", (d) => x(d.data.name))
    .attr("y", (d) => y(d[0] + d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1] + d[0]));

rectangles.exit().remove();

svg.select("g.xaxis").remove();
 // Add the x Axis
  svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + (height -70) + ")")
      .call(axisBottom(x));

svg.select("text.xaxis").remove();

  // text label for the x axis
  svg.append("text")
      .attr("class", "xaxis")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height - 20) + ")")
      .style("text-anchor", "middle")
      .text("Name");
}

class Graphy extends Component {

  componentDidMount() {
		console.log("componentDidMount", this.props);
		// initialize D3

    const { id, data } = this.props;
    const { width, height } = this.props.coordinateSystem;
    graph(id, data, width, height);
  }

  componentWillUnmount() {
		console.log("componentWillUnmount");
    // clean up D3
  }

	componentWillReceiveProps(nextProps) {
		console.log("componentWillReceiveProps", nextProps);
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log("shouldComponentUpdate", nextProps, nextState);

    if (nextProps !== this.props) {
      const { width, height } = this.props.coordinateSystem;
      graph(nextProps.id, nextProps.data, width, height);
    }
    // never update ( ie, call render() )
    return false;
  }

  render() {
		console.log("render", this.props);

    const { width, height } = this.props.coordinateSystem;
		const viewBox = `0 0 ${width} ${height}`;
		// this will only be called once
    return (
      <svg id={this.props.id} viewBox={viewBox} version="1.1"></svg>
    );
  }
}

Graphy.propTypes = {
  id: PropTypes.string.isRequired,
  coordinateSystem: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
  })
}

export default Graphy;
