import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactFlow, { Background } from 'reactflow';
import PropTypes from 'prop-types';

// Components
import CustomGroupNode from './CustomGroupNode';
import CustomInputNode from './CustomInputNode';
import CustomOutputNode from './CustomOutputNode';
import CustomMetadataNode from './CustomMetadataNode';

// Redux
import { SET_CURRENT_SCHEMA_ELEMENTS } from '../../../../redux/schema.slice';

// Styles
import 'reactflow/dist/style.css';

// Consts
import { colors } from '../../../../consts/colors';

// Services
import { schema2elements } from '../../../../services/flow/schema';
import { newLog } from '../../../../services/logger';

/**
 * FixedFlow is a component that allows the user to see the task's schema defined, represented
 * by nodes and connections between them. None of the nodes can be moved or deleted, nor edges can be added.
 *
 * @param props
 * @return {JSX.Element}
 */
function FixedFlow(props) {
	const nodeTypes = useMemo(
		() => ({
			group: CustomGroupNode,
			customInput: CustomInputNode,
			customOutput: CustomOutputNode,
			customMetadata: CustomMetadataNode,
		}),
		[]
	);

	const { tmpSchema } = props;

	const dispatch = useDispatch();

	// Global states
	const {
		currentSchemaElements: currentSchemaElementsState,
		schema: schemaState,
	} = useSelector((state) => state.schema);

	useEffect(() => {
		if (schemaState)
			dispatch(SET_CURRENT_SCHEMA_ELEMENTS(schema2elements(schemaState)));

		if (tmpSchema)
			dispatch(SET_CURRENT_SCHEMA_ELEMENTS(schema2elements(tmpSchema)));
	}, [schemaState]);

	/**
	 * This function saves the rf when the canvas and the react-flow-rendered library is ready to be used
	 * and fits the viewport in order to show all the elements represented in the canvas.
	 *
	 * @param flowInstance
	 */
	const onInit = (rf) => {
		rf.fitView();
	};

	/**
	 * This function is triggered when the user clicks on a node. It sets the selected node to the node that was clicked and
	 * updates the style of the node to its selected style. If the element selected is a node, it will highlight all the
	 * edges that are connected to that node. If the element selected is an edge, it will highlight the edge and show the
	 * delete button.
	 *
	 * @param event
	 * @param elementClicked - The react-flow-rendered element that was clicked.
	 */
	const onNodeClick = (event, elementClicked) => {
		const tmpNodes = currentSchemaElementsState.nodes.map((node) => {
			if (node.id === elementClicked.id)
				return {
					...node,
					style: { ...node.style, backgroundColor: colors[node.type] },
				};
			return {
				...node,
				style: { ...node.style, backgroundColor: 'transparent' },
			};
		});
		const tmpEdges = currentSchemaElementsState.edges.map((edge) => {
			let tmpNode = {};
			tmpNode = currentSchemaElementsState.nodes.find(
				(node) => node.id === elementClicked.id
			);

			if (edge.source === elementClicked.id) {
				if (tmpNode.type === 'group')
					tmpNode = currentSchemaElementsState.nodes.find(
						(node) => node.id === edge.target
					);
				return {
					...edge,
					style: {
						...edge.style,
						stroke: colors[tmpNode.type],
						strokeWidth: 10,
					},
				};
			}
			if (edge.target === elementClicked.id) {
				if (tmpNode.type === 'group')
					tmpNode = currentSchemaElementsState.nodes.find(
						(node) => node.id === edge.source
					);
				return {
					...edge,
					style: {
						...edge.style,
						stroke: colors[tmpNode.type],
						strokeWidth: 10,
					},
				};
			}

			return {
				...edge,
				style: { ...edge.style, stroke: '#676767', strokeWidth: 1 },
			};
		});

		dispatch(
			SET_CURRENT_SCHEMA_ELEMENTS({
				nodes: tmpNodes,
				edges: tmpEdges,
			})
		);
	};

	/**
	 * This function is triggered when the user clicks on a edge. It will highlight the edge and show the
	 * delete button.
	 *
	 * @param event
	 * @param elementClicked - The react-flow-rendered element that was clicked.
	 */
	const onEdgeClick = (event, elementClicked) => {
		dispatch(
			SET_CURRENT_SCHEMA_ELEMENTS({
				...currentSchemaElementsState,
				edges: currentSchemaElementsState.edges.map((edge) => {
					if (edge.id === elementClicked.id)
						return {
							...elementClicked,
							style: {
								...elementClicked.style,
								strokeWidth: 5,
								stroke: 'red',
							},
						};
					return {
						...edge,
						style: {
							...elementClicked.style,
							stroke: '#676767',
							strokeWidth: 1,
						},
						type: null,
					};
				}),
			})
		);
	};

	/**
	 * This function is triggered when the user clicks on the react-flow-rendered canvas. It is intended to set to null the
	 * selected node and update the style of all the nodes to their default (non-selected) style.
	 *
	 */
	const onPaneClick = () => {
		newLog('onPaneClick');
		const newElements = {
			nodes: currentSchemaElementsState.nodes.map((element) => ({
				...element,
				style: {
					...element.style,
					stroke: '#676767',
					strokeWidth: 1,
					backgroundColor: 'transparent',
				},
			})),
			edges: currentSchemaElementsState.edges.map((element) => ({
				...element,
				style: {
					...element.style,
					stroke: '#676767',
					strokeWidth: 1,
				},
				type: '',
			})),
		};

		dispatch(SET_CURRENT_SCHEMA_ELEMENTS(newElements));
	};

	return (
		currentSchemaElementsState &&
		currentSchemaElementsState.nodes &&
		currentSchemaElementsState.nodes.length > 0 && (
			<ReactFlow
				onNodeClick={onNodeClick}
				onEdgeClick={onEdgeClick}
				onInit={onInit}
				nodes={currentSchemaElementsState.nodes}
				edges={currentSchemaElementsState.edges}
				nodeTypes={nodeTypes}
				panOnDrag={false}
				zoomOnScroll={false}
				onPaneClick={onPaneClick}
			>
				<Background />
			</ReactFlow>
		)
	);
}

export default FixedFlow;

FixedFlow.propTypes = {
	tmpSchema: PropTypes.any,
};
