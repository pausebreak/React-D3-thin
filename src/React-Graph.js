import React, { Component, PropTypes } from 'react';

class Graphy extends Component {

  static propTypes = {
    graph: PropTypes.shape({
      initialize: PropTypes.func.isRequired,
      update: PropTypes.func.isRequired
    }),
    config: PropTypes.shape({
      id: PropTypes.string.isRequired,
      svgClass: PropTypes.string.isRequired,
      domainKey: PropTypes.string.isRequired,
      domainLabel: PropTypes.string,
      stackLabel: PropTypes.string,
      stackKeys: PropTypes.arrayOf(PropTypes.string),
      tooltip: PropTypes.shape({
        over: PropTypes.func.isRequired,
        out: PropTypes.func.isRequired
      }).isRequired,
      coordinateSystem: PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number,
          width: PropTypes.number,
          height: PropTypes.number,
      })
    }).isRequired
  }

  componentDidMount() {
		console.log("componentDidMount", this.props);
		// initialize D3

    const { data, graph, config } = this.props;

    graph.initialize(data, config);
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    // clean up D3
    // in general you don't have to clean up D3
    // removing the SVG node is all you need and
    // react will take care of that since React
    // created the SVG.
  }

	shouldComponentUpdate(nextProps, nextState) {
    // these are the properties we care about
    const { data, graph, config } = nextProps;

    let nextData = JSON.stringify(data),
        nextConfig = JSON.stringify(config),
        nextGraph = JSON.stringify(graph),
        propsData = JSON.stringify(this.props.data),
        propsConfig = JSON.stringify(this.props.config),
        propsGraph = JSON.stringify(this.props.graph);

    if (nextGraph !== propsGraph ||
        nextData !== propsData ||
        nextConfig !== propsConfig) {

      graph.update(data, config);
    }

    // never update ( ie, call render() )
    return false;
  }

  render() {
		console.log("render", this.props);

    const { id, width, height, coordinateSystem, svgClass } = this.props.config;
    const cs = coordinateSystem;
		const viewBox = `${cs.x} ${cs.y} ${cs.width} ${cs.height}`;
    const other = {};

    // you shouldn't set width and height on the svg if you want it
    // to fill the container.
    if (width && height) {
      other.width = width;
      other.height = height;
    }

		// this will only be called once
    return (
      <svg {...other} id={id} viewBox={viewBox} className={svgClass} version="1.1"></svg>
    );
  }
}

export default Graphy;
