import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';
import PropTypes from 'prop-types';
import { useFlowActions } from './FlowContext';

// Styles
import styles from './styles';

export default function CustomEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	markerEnd,
}) {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const { onRemoveEdgeButtonClick } = useFlowActions();

	return (
		<>
			<BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						fontSize: 12,
						pointerEvents: 'all',
					}}
					// TODO: review if this is necessary, no .css file is imported. Maybe imported from react-flow lib?
					className="nodrag nopan"
				>
					<button
						type="button"
						style={styles().edgebutton}
						onClick={(event) => onRemoveEdgeButtonClick(event, id)}
					>
						X
					</button>
				</div>
			</EdgeLabelRenderer>
		</>
	);
}

CustomEdge.propTypes = {
	id: PropTypes.any,
	sourceX: PropTypes.any,
	sourceY: PropTypes.any,
	targetX: PropTypes.any,
	targetY: PropTypes.any,
	sourcePosition: PropTypes.any,
	targetPosition: PropTypes.any,
	style: PropTypes.any,
	markerEnd: PropTypes.any,
};
