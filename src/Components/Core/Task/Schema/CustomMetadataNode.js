import { memo } from 'react';
import { Handle } from 'reactflow';
import PropTypes from 'prop-types';

// Components
import { Typography } from '@mui/material';

// Services
import { elementTypeToIconMap } from '../../../../services/tasks';

/**
 * CustomMetadataNode is a HOC that defines a custom node for the reactflow library. It is used to render a schema
 * metadata node, which represents a additional information for the inputs of NexusML.
 *
 * @param {Object} data
 * @param {boolean} isConnectable
 * @return {JSX.Element} The rendered node
 */
function CustomMetadataNode({ data, isConnectable }) {
	return (
		<div style={{ display: 'flex', gap: '6px', fontSize: '1rem' }}>
			<Handle
				id="nodeOutput"
				type="source"
				position="top"
				isConnectable={isConnectable}
			/>
			{elementTypeToIconMap[data.element_type](data.type)}
			<Typography variant="body2">{data.label}</Typography>
		</div>
	);
}

export default memo(CustomMetadataNode);

CustomMetadataNode.propTypes = {
	data: PropTypes.any,
	isConnectable: PropTypes.any,
};
