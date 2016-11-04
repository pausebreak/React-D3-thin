import React, { PropTypes } from 'react';

const StackTooltipContent = ({header, segment, value}) => (
  <article>
	 <header>{header}</header>
   {segment}: {value}
  </article>
);

StackTooltipContent.propTypes = {
	header: PropTypes.string.isRequired,
	segment: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([
    PropTypes.string,
		PropTypes.number
	]).isRequired
};

export default StackTooltipContent;
