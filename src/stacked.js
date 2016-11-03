import { event, keys, min, max, scaleLinear, stackOrderAscending, scaleBand, select, stack, scaleOrdinal, axisLeft, axisBottom } from 'd3';
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

function calcYDomain(series) {

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

function generateRects(selection, xAxisDomainKey, series, tooltip, x, y) {

  const usedKeys = series.map(s => s.key);

  selection.enter()
    .append("rect")
      .attr("width", x.bandwidth())
      .attr("x", d => x(d.data[xAxisDomainKey]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .on("mouseover", function(d) {
        const key = select(this.parentNode).datum().key;
        tooltip.over(extractInformationFromSlice(d, key, usedKeys))
      })
			.on("mousemove", d => tooltip.move(event.pageY-10, event.pageX+10))
      .on("mouseout", tooltip.out);
}

function initialize(data, config) {

  const { id, xAxisDomainKey, coordinateSystem,
          xAxisLabel, yAxisLabel, stackKeys, tooltip } = config;
  const { width, height } = calcDimentions(margin, coordinateSystem.width, coordinateSystem.height);
  const x = memoScaleBand(width);
  const y = memoScaleLinear(height);
  const color = scaleOrdinal(colors);
  const series = calcSeries(stackKeys, data, xAxisDomainKey);

  x.domain(data.map(d => d[xAxisDomainKey]));
  console.log("x domain is ", x.domain());

  y.domain(calcYDomain(series)).nice();
  console.log("y domain is ", y.domain());

  let svg = select(`#${id}`)
              .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const main = svg.selectAll(".stack").data(series);

  // yaxis comes first so it is behind the graph
  // size of -width to cover the whole width of the graph
  svg.append("g")
       .attr("class", "yaxis")
       .call(axisLeft(y).tickSize(-width));

  const stacks = main.enter()
                   .append("g")
                     .attr("class", "stack")
                     .style("fill", (d, i) => color(d.key));

  const rectangles = stacks.selectAll("rect").data(d => d);

  generateRects(rectangles, xAxisDomainKey, series, tooltip, x, y);

  svg
   .append("g")
     .attr("class", "xaxis")
     .attr("transform", "translate(0," + height + ")")
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
       .attr("transform", `translate(${width - 50}, ${height + (margin.bottom/1.5)})`)
       .style("text-anchor", "start")
       .text(xAxisLabel);
  }

	generateLegend(svg.selectAll("g.legend"), calcSortedKeys(series), color, width);
}

function update(data, config) {

  const { id, xAxisDomainKey, coordinateSystem,
          xAxisLabel, yAxisLabel, stackKeys, tooltip } = config;
  const { width, height } = calcDimentions(margin, coordinateSystem.width, coordinateSystem.height);
  const x = memoScaleBand(width);
  const y = memoScaleLinear(height);
  const color = scaleOrdinal(colors);
 	const series = calcSeries(stackKeys, data, xAxisDomainKey);

  x.domain(data.map(d => d[xAxisDomainKey]));
  console.log("x domain is ", x.domain());

  y.domain(calcYDomain(series)).nice();
  console.log("y domain is ", y.domain());

	let svg = select(`#${id} g`);

  const main = svg.selectAll(".stack").data(series, d => d);

  main.exit().remove();

  // yaxis comes first so it is behind the graph
	svg.select("g.yaxis")
  // size of -width to cover the whole width of the graph
  .call(axisLeft(y).tickSize(-width));

  const stacks = main.enter()
                   .append("g")
                     .attr("class", "stack")
                     .style("fill", (d, i) => color(d.key));

  const rectangles = stacks.selectAll("rect").data(d => d);

  generateRects(rectangles, xAxisDomainKey, series, tooltip, x, y);

  rectangles.exit().remove();

  svg.select("g.xaxis")
       .call(axisBottom(x));

  svg.select("text.xaxis").remove();

  if (yAxisLabel) {
    svg.select("text.yaxislabel")
         .text(yAxisLabel);
  }

  if (xAxisLabel) {
    svg.select("text.xaxislabel")
         .text(xAxisLabel);
  }

	generateLegend(svg.selectAll("g.legend"), calcSortedKeys(series), color, width);
}

const graph = {initialize: initialize, update: update};

export default graph;
