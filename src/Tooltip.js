import React, { PropTypes, Component } from 'react';
import './tooltip.css';

class Tooltip extends Component {

  static propTypes = {
		show: PropTypes.bool,
		x: PropTypes.number,
		y: PropTypes.number
  }

  render() {
    const { show, x, y } = this.props;

		if (!show) {
			return null;
		}

    return (
      <div className="tooltip" style={{top: `${x}px`, left: `${y}px`}}>
				{this.props.children}
      </div>
    );
  }
}

export default Tooltip;
