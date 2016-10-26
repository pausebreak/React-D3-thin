import { keys, min, max, schemeCategory20, scaleLinear, scaleBand, select, stack, scaleOrdinal, axisBottom } from 'd3';

let memoize = fn => {
  const cache = {};
  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    return cache[stringifiedArgs] = cache[stringifiedArgs] || fn(...args);
  };
};

let getScaleBand = width => scaleBand().rangeRound([0, width], .35),
    memoScaleBand = memoize(getScaleBand);

let getScaleLinear = height => scaleLinear().rangeRound([height, 0]),
    memoScaleLinear = memoize(getScaleLinear);

function graph(id, data, columnName, width, height) {

  var margin = {top: 50, right: 10, bottom: 40, left: 10};
  var _width = width - margin.left - margin.right,
      _height = height - margin.top - margin.bottom;

  const getSVG = id => select(`#${id}`)
                       .attr("style", "background-color: red;")
                       .append("g")
                         .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const memoGetSVG = memoize(getSVG);

  let svg = select(`#${id} g`);

  if (svg.empty()) {
    svg = memoGetSVG(id);
  }

  const x = memoScaleBand(_width);
  const y = memoScaleLinear(_height);
  const color = memoize(scaleOrdinal(schemeCategory20));

  let _keys = keys(data[0]).filter(d => d !== columnName);

  console.log("Column keys ", _keys);
  var series = stack().keys(_keys)(data);

  var xData = data.map(d => d[columnName]);
  x.domain(xData);

  console.log("x domain is ", x.domain());

  const upperValues = series.map(d => {
	  // there is an index: and key: in a series
    // which we don't want
    return d.length ? d[d.length -1][1] : null;
  });
  const lowerValues = series.map(d => {
  	// there is an index: and key: in a series
    // which we don't want
    return d.length ? d[0][0] : null;
  });
  const upper = max(upperValues);
  const lower = min(lowerValues);

  y.domain([lower, upper]).nice();

  console.log("y domain is ", y.domain());

  const main = svg.selectAll(".stack").data(series, d => d);

  main.exit().remove();

  const stacks = main.enter()
                   .append("g")
                     .attr("class", "stack")
                     .style("fill", (d, i) => color(i));

	svg.exit().remove();
	stacks.exit().remove();

  const rectangles = stacks.selectAll("rect").data(d => d);

  rectangles.enter()
    .append("rect")
      .attr("width", x.bandwidth)
      .attr("x", d => x(d.data[columnName]))
      .attr("y", d => y(d[0] + d[1]))
      .attr("height", d => y(d[0]) - y(d[1] + d[0]));

  rectangles.exit().remove();

  svg.select("g.xaxis").remove();

  svg
   .append("g")
     .attr("class", "xaxis")
     .attr("transform", "translate(0," + (_height) + ")")
     .call(axisBottom(x));

  svg.select("text.xaxis").remove();

  // text label for the x axis
  svg
   .append("text")
     .attr("class", "xaxis")
     .attr("transform",
           "translate(" + (_width/2) + " ," +
                          (_height + 30) + ")")
     .style("text-anchor", "middle")
     .text("Name");
}

export default graph;
