import { schemeCategory20, scaleLinear, scaleBand, select, stack, scaleOrdinal, axisBottom } from 'd3';

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

function graph(id, data, width, height) {

  const svg = select(`#${id}`).attr("style", "background-color: red;");
  const x = memoScaleBand(width);
  const y = memoScaleLinear(height);
  const color = memoize(scaleOrdinal(schemeCategory20));

// derive
var keys = ["amt", "pv", "uv", "xv"];
var series = stack().keys(keys)(data);

var xData = data.map(d => d.name);
x.domain(xData);

// derive
y.domain([0, 35000]).nice();

  const main = svg.selectAll(".stack").data(series, d => d);

  const stacks = main.enter()
                   .append("g")
                     .attr("class", "stack")
                     .style("fill", (d, i) => color(i));

  main.exit().remove();

  const rectangles = stacks.selectAll("rect").data(d => d);

  rectangles.enter()
    .append("rect")
      .attr("width", x.bandwidth)
      .attr("x", d => x(d.data.name))
      .attr("y", d => y(d[0] + d[1]))
      .attr("height", d => y(d[0]) - y(d[1] + d[0]));

  rectangles.exit().remove();

  svg.select("g.xaxis").remove();

  svg
   .append("g")
     .attr("class", "xaxis")
     .attr("transform", "translate(0," + (height -70) + ")")
     .call(axisBottom(x));

  svg.select("text.xaxis").remove();

  // text label for the x axis
  svg
   .append("text")
     .attr("class", "xaxis")
     .attr("transform",
           "translate(" + (width/2) + " ," +
                          (height - 20) + ")")
     .style("text-anchor", "middle")
     .text("Name");
}

export default graph;
