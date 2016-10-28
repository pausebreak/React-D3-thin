import React, { Component, PropTypes } from 'react';
import './App.css';

class Graphy extends Component {

  static propTypes = {
    graph: PropTypes.func.isRequired,
    config: PropTypes.shape({
      id: PropTypes.string.isRequired,
      columnName: PropTypes.string.isRequired,
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
    const { id, columnName, coordinateSystem } = config;
    const { width, height } = coordinateSystem;
    graph(id, data, columnName, width, height);
  }

  componentWillUnmount() {
		console.log("componentWillUnmount");
    // clean up D3
    // in general you don't have to clean up D3
    // removing the SVG node is all you need and
    // react will take care of that since React
    // created the SVG.
  }

	componentWillReceiveProps(nextProps) {
		console.log("componentWillReceiveProps", nextProps);
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log("shouldComponentUpdate", nextProps, nextState);

    if (nextProps !== this.props) {

      const { data, graph, config } = nextProps;
      const { id, columnName, coordinateSystem } = config;
      const { width, height } = coordinateSystem;

      graph(id, data, columnName, width, height);
    }
    // never update ( ie, call render() )
    return false;
  }

  render() {
		console.log("render", this.props);

    const { id, width, height, coordinateSystem } = this.props.config;
    const cs = coordinateSystem;
		const viewBox = `${cs.x} ${cs.y} ${cs.width} ${cs.height}`;
    const other = {};

    if (width && height) {
      other.width = width;
      other.height = height;
    }

		// this will only be called once
    return (
      <svg {...other} id={id} viewBox={viewBox} version="1.1"></svg>
    );
  }
}

export default Graphy;
