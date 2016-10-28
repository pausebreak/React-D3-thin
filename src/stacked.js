import { keys, min, max, scaleLinear, stackOrderAscending, scaleBand, select, stack, scaleOrdinal, axisLeft, axisBottom } from 'd3';
import colors from './colors.js';

let memoize = fn => {
  const cache = {};
  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    return cache[stringifiedArgs] = cache[stringifiedArgs] || fn(...args);
  };
};

let getScaleBand = width => scaleBand().range([0, width]).paddingInner(0.4).paddingOuter(0.4),
    memoScaleBand = memoize(getScaleBand);

let getScaleLinear = height => scaleLinear().rangeRound([height, 0]),
    memoScaleLinear = memoize(getScaleLinear);

function graph(data, config) {

  const { id, xAxisDomainKey, coordinateSystem, xAxisLabel, yAxisLabel, stackKeys } = config;
  const { width, height } = coordinateSystem;

  const margin = {top: 50, right: 10, bottom: 40, left: 10};
  const _width = width - margin.left - margin.right;
  const _height = height - margin.top - margin.bottom;
  const x = memoScaleBand(_width);
  const y = memoScaleLinear(_height);
  // this might be slower to memoize than to just run each time
  const color = memoize(scaleOrdinal(colors));

  let svg = select(`#${id} g`);

  // we have to guard against recreating g
  // can this be achieved via data binding?
  if (svg.empty()) {
    svg = select(`#${id}`)
            .append("g")
              .attr("transform", `translate(${margin.left}, ${margin.top})`);
  }

  let _keys = stackKeys || keys(data[0]).filter(d => d !== xAxisDomainKey);

  console.log("Column keys ", _keys);

  const series = stack().keys(_keys).order(stackOrderAscending)(data);

  const xData = data.map(d => d[xAxisDomainKey]);
  x.domain(xData);

  console.log("x domain is ", x.domain());

  const upper = max(series.map(d => max(d.map(i => i[1]))));
  const lower = min(series.map(d => min(d.map(i => i[0]))));

  y.domain([lower, upper]).nice();

  console.log("y domain is ", y.domain());

  const main = svg.selectAll(".stack").data(series, d => d);

  main.exit().remove();

  // yaxis comes first so it is behind the graph
  svg.select("g.yaxis").remove();
  svg
    .append("g")
      .attr("class", "yaxis")
	    // size of -_width to cover the whole width of the graph
      .call(axisLeft(y).tickSize(-_width));

  const stacks = main.enter()
                   .append("g")
                     .attr("class", "stack")
                     .style("fill", (d, i) => color(d.key));

	stacks.exit().remove();

  const rectangles = stacks.selectAll("rect").data(d => d);

  rectangles.enter()
    .append("rect")
      .attr("width", x.bandwidth())
      .attr("x", d => x(d.data[xAxisDomainKey]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]));

  rectangles.exit().remove();

  svg.select("g.xaxis").remove();

  svg
   .append("g")
     .attr("class", "xaxis")
     .attr("transform", "translate(0," + _height + ")")
     .call(axisBottom(x));

  svg.select("text.xaxis").remove();

  if (yAxisLabel) {
    svg.select("text.yaxislabel").remove();
    svg
     .append("text")
       .attr("class", "yaxislabel")
       .attr("transform", "translate(-50, 30) rotate(-90)")
       .style("text-anchor", "start")
       .text(yAxisLabel);
  }

  if (xAxisLabel) {
    svg.select("text.xaxislabel").remove();
    svg
     .append("text")
       .attr("class", "xaxislabel")
       .attr("transform", `translate(${_width - 50}, ${_height + (margin.bottom/1.5)})`)
       .style("text-anchor", "start")
       .text(xAxisLabel);
  }

  const seriesSortedKeys = series.reduce((p, n) => { p[n.index] = n.key; return p}, [])
                                 .reverse();

  svg.selectAll(".legend").remove();

  const legend = svg.selectAll(".legend")
    .data(seriesSortedKeys, d => d)
    .enter()
      .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`)
        .style("font", "10px sans-serif");

  legend
    .append("rect")
      .attr("x", width + 50)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", d => color(d));

  legend
    .append("text")
      .attr("x", width +25 )
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(d => d);
}

export default graph;
