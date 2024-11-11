import { memo } from 'react';
import PropTypes from 'prop-types';
import { Handle } from 'reactflow';

// Components
import { Typography } from '@mui/material';

// Services
import { elementTypeToIconMap } from '../../../../services/tasks';

/**
 * CustomInputNode is a HOC that defines a custom node for the reactflow library. It is used to render a schema
 * input node, which represents a single input for NexusML.
 *
 * @param {Object} data
 * @param {boolean} isConnectable
 * @return {JSX.Element} The rendered node
 */
function CustomInputNode({ data, isConnectable }) {
	return (
		<div style={{ display: 'flex', gap: '6px', fontSize: '1rem' }}>
			{elementTypeToIconMap[data.element_type](data.type)}
			<Typography variant="body2">{data.label}</Typography>
			<Handle
				id="nodeOutput"
				type="source"
				position="right"
				isConnectable={isConnectable}
			/>
		</div>
	);
}

export default memo(CustomInputNode);

CustomInputNode.propTypes = {
	data: PropTypes.any,
	isConnectable: PropTypes.any,
};
