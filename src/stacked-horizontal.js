import { event, keys, min, max, scaleLinear, stackOrderAscending, scaleBand, select, stack, scaleOrdinal, axisLeft, axisBottom } from 'd3';
import colors from './colors.js';
import './stacked-horizontal.css';

let memoize = fn => {
  const cache = {};
  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    return cache[stringifiedArgs] = cache[stringifiedArgs] || fn(...args);
  };
};

const scaleStack = memoize(limit => scaleBand().range([0, limit]).paddingInner(0.4).paddingOuter(0.4));
const scaleValues = memoize(limit => scaleLinear().rangeRound([0, limit]));

const margin = {top: 30, right: 85, bottom: 45, left: 85};

function calcDimentions(margin, width, height) {

  // right and left should be the same value to maintain symmetry
  // during scaling
  const _width = width - margin.left - margin.right;
  const _height = height - margin.top - margin.bottom;

  return {width: _width, height: _height};
}

function calcSeries(givenKeys, data, domainKey) {

  // this is assuming all rows have the same keys
  let _keys = givenKeys || keys(data[0]).filter(d => d !== domainKey);
  console.log("Column keys ", _keys);

  return stack().keys(_keys).order(stackOrderAscending)(data);
}

function calcStackDomain(series) {

  const upper = max(series.map(d => max(d.map(i => i[1]))));
  const lower = min(series.map(d => min(d.map(i => i[0]))));

  return [lower, upper];
}

function calcSortedKeys(series) {

  // the keys need to be in the order the stack has them in
  return series.reduce((p, n) => { p[n.index] = n.key; return p}, [])
               .reverse();
}

function generateLegend(selection, data, color, widthOffset) {

  // data key is combination of position and label
  const legend = selection.data(data, (d, i) => d+i);

  const g = legend
              .enter()
								// one g per datum
                .append("g")
                  .attr("class", "legend")
                  .attr("transform", (d, i) => `translate(0, ${i * 20})`)
                  .style("font", "10px sans-serif");

  // then add a circle
  g.append("circle")
    .attr("cx", widthOffset + 65)
    .attr("cy", 9)
    .attr("r", 9)
    .attr("fill", d => color(d));

  // then the label
  g.append("text")
    .attr("x", widthOffset + 50)
    .attr("y", 9)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .text(d => d);

  // remove old entries
  legend.exit().remove()
}

function extractInformationFromSlice(data, parentKey, usedKeys) {

  // there may be more keys than shown
  const datum = usedKeys.reduce((l, k) => {
    l[k] = data.data[k];
    return l;
  }, {});

  datum.name = data.data.name;
  datum.key = parentKey;

  return datum;
}

function generateRects(selection, domainKey, series, tooltip, x, y) {

  const usedKeys = series.map(s => s.key);

  selection.enter()
    .append("rect")
      .attr("height", y.bandwidth())
      .attr("y", d => y(d.data[domainKey]))
      .attr("x", d => x(d[0]))
      .attr("width", d => x(d[1]) - x(d[0]))
      .on("mouseover", function(d) {
        const key = select(this.parentNode).datum().key;
        tooltip.over(extractInformationFromSlice(d, key, usedKeys))
      })
      .on("mousemove", d => tooltip.move(event.pageX, event.pageY))
      .on("mouseout", tooltip.out);
}

function initialize(data, config) {

  const { id, domainKey, coordinateSystem,
          domainLabel, stackLabel, stackKeys, tooltip } = config;
  const { width, height } = calcDimentions(margin, coordinateSystem.width, coordinateSystem.height);

  const x = scaleValues(width);
  const y = scaleStack(height);

  const color = scaleOrdinal(colors);
  const series = calcSeries(stackKeys, data, domainKey);

  y.domain(data.map(d => d[domainKey]));
  console.log("y domain is ", y.domain());

  x.domain(calcStackDomain(series)).nice();
  console.log("x domain is ", x.domain());

  let svg = select(`#${id}`)
              .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // yaxis comes first so it is behind the graph
  // size of -width to cover the whole width of the graph
  svg.append("g")
       .attr("class", "yaxis")
       .call(axisLeft(y));

  const main = svg.selectAll(".stack").data(series);

  const stacks = main.enter()
                   .append("g")
                     .attr("class", "stack")
                     .style("fill", (d, i) => color(d.key));

  const rectangles = stacks.selectAll("rect").data(d => d);

  generateRects(rectangles, domainKey, series, tooltip, x, y);

  svg
   .append("g")
     .attr("class", "xaxis")
     .attr("transform", "translate(0," + height + ")")
     .call(axisBottom(x));

  svg.select("text.xaxis").remove();

  if (stackLabel) {
    svg.select("text.xaxislabel").remove();
    svg
     .append("text")
       .attr("class", "xaxislabel")
       .attr("transform", `translate(${width - 50}, ${height + (margin.bottom/1.2)})`)
       .style("text-anchor", "start")
       .text(stackLabel);
  }

  if (domainLabel) {
    svg.select("text.yaxislabel").remove();
    svg
     .append("text")
       .attr("class", "yaxislabel")
       .attr("transform", "translate(-40, 80) rotate(-90)")
       .style("text-anchor", "start")
       .text(domainLabel);
  }

	generateLegend(svg.selectAll("g.legend"), calcSortedKeys(series), color, width);
}

function update(data, config) {

  const { id, domainKey, coordinateSystem,
          xAxisLabel, yAxisLabel, stackKeys, tooltip } = config;
  const { width, height } = calcDimentions(margin, coordinateSystem.width, coordinateSystem.height);

  const x = scaleValues(width);
  const y = scaleStack(height);

  const color = scaleOrdinal(colors);
 	const series = calcSeries(stackKeys, data, domainKey);

  y.domain(data.map(d => d[domainKey]));
  console.log("y domain is ", y.domain());

  x.domain(calcStackDomain(series)).nice();
  console.log("x domain is ", x.domain());

	let svg = select(`#${id} g`);

  const main = svg.selectAll(".stack").data(series, d => d);

  main.exit().remove();

  // yaxis comes first so it is behind the graph
	svg.select("g.yaxis")
  // size of -width to cover the whole width of the graph
  .call(axisLeft(x).tickSize(-width));

  const stacks = main.enter()
                   .append("g")
                     .attr("class", "stack")
                     .style("fill", (d, i) => color(d.key));

  const rectangles = stacks.selectAll("rect").data(d => d);

  generateRects(rectangles, domainKey, series, tooltip, x, y);

  rectangles.exit().remove();

  svg.select("g.yaxis")
       .call(axisLeft(y));

  svg.select("g.xaxis")
       .call(axisBottom(x));

  if (xAxisLabel) {
    svg.select("text.xaxislabel")
         .text(xAxisLabel);
  }

  if (yAxisLabel) {
    svg.select("text.yaxislabel")
         .text(yAxisLabel);
  }

	generateLegend(svg.selectAll("g.legend"), calcSortedKeys(series), color, width);
}

const graph = {initialize: initialize, update: update};

export default graph;
