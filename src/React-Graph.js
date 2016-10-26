import React, { Component, PropTypes } from 'react';
import './App.css';

class Graphy extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    graph: PropTypes.func.isRequired,
    columnName: PropTypes.string.isRequired,
    coordinateSystem: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    })
  }

  componentDidMount() {
		console.log("componentDidMount", this.props);
		// initialize D3

    const { id, data, graph, columnName } = this.props;
    const { width, height } = this.props.coordinateSystem;
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

      const { id, data, graph, columnName } = nextProps;
      const { width, height } = this.props.coordinateSystem;

      graph(id, data, columnName, width, height);
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

export default Graphy;
