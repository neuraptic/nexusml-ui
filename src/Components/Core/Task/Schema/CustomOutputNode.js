import { memo } from 'react';
import { Handle } from 'reactflow';
import PropTypes from 'prop-types';

// Components
import { Typography } from '@mui/material';

// Services
import { elementTypeToIconMap } from '../../../../services/tasks';

/**
 * CustomOutputNode is a HOC that defines a custom node for the reactflow library. It is used to render a schema
 * output node, which represents the outputs that NexusML should provide.
 *
 * @param {Object} data
 * @param {boolean} isConnectable
 * @return {JSX.Element} The rendered node
 */
function CustomOutputNode({ data, isConnectable }) {
	return (
		<div style={{ display: 'flex', gap: '6px', fontSize: '1rem' }}>
			{elementTypeToIconMap[data.element_type](data.type)}
			<Typography variant="body2">{data.label}</Typography>
			<Handle
				id="nodeInput"
				type="target"
				position="left"
				isConnectable={isConnectable}
			/>
		</div>
	);
}

export default memo(CustomOutputNode);

CustomOutputNode.propTypes = {
	data: PropTypes.any,
	isConnectable: PropTypes.any,
};
