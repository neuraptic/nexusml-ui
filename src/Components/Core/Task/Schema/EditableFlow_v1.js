import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, { Background, Controls, ReactFlowProvider } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';

// Manage roles & permissions
import { HasAccess } from '@permify/react-role';

// Components
import { Box, Grid } from '@mui/material';
import CustomGroupNode from './CustomGroupNode';
import CustomInputNode from './CustomInputNode';
import CustomOutputNode from './CustomOutputNode';
import CustomMetadataNode from './CustomMetadataNode';
import { Nodes } from '../../../../services/flow/nodes';
import { schema2elements } from '../../../../services/flow/schema';
import CustomEdgeWithButton from './CustomEdgeWithButton';
import { FlowActionsProvider } from './FlowContext';
import { Loader } from '../../../Shared/Loader';

// Services
import requestFactory from '../../../../services/request.factory';
import { newLog } from '../../../../services/logger';

// Redux
import {
	GET_SCHEMA,
	SET_CURRENT_SCHEMA_ELEMENTS,
} from '../../../../redux/schema.slice';

// Styles
import 'reactflow/dist/style.css';

// Consts
import { colors } from '../../../../consts/colors';
import { defaultRoles } from '../../../../consts/rolesAndPermissions';

const nodeTypes = {
	group: CustomGroupNode,
	customInput: CustomInputNode,
	customOutput: CustomOutputNode,
	customMetadata: CustomMetadataNode,
};

const edgeTypes = {
	customButtonEdge: CustomEdgeWithButton,
};

/**
 * EditableFlow is a component that allows the user to create a flow where the task's schema is defined and represented
 * by nodes and connections between them.
 *
 * @return {JSX.Element}
 */
function EditableFlow() {
	const dispatch = useDispatch();

	const reactFlowWrapper = useRef(null);

	// Global states
	const {
		schema: schemaState,
		currentSchemaElements: currentSchemaElementsState,
	} = useSelector((state) => state.schema);
	const userState = useSelector((state) => state.user);

	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { schema: schemaLoaderState } = useSelector(
		(state) => state.loaders.task
	);

	// Local states
	const [selectedElement, setSelectedElement] = useState(null);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);

	/**
	 * This function is called when the component is mounted, and it initializes the ReactFlow instance by creating
	 * the nodes and edges given by the schemas elements.
	 */

	useEffect(() => {
		if (schemaState) {
			dispatch(
				SET_CURRENT_SCHEMA_ELEMENTS(
					schema2elements(schemaState, selectedElement)
				)
			);
		}
	}, [schemaState]);

	/**
	 * This function saves the _reactFlowInstance when the canvas and the react-flow-rendered library is ready to be used
	 * and fits the viewport in order to show all the elements represented in the canvas.
	 *
	 * @param _reactFlowInstance
	 */
	const onInit = (rf) => {
		rf.fitView();
		setReactFlowInstance(rf);
	};

	/**
	 * This function is triggered when the user clicks on a node. It sets the selected node to the node that was clicked and
	 * updates the style of the node to its selected style. If the element selected is a node, it will highlight all the
	 * edges that are connected to that node.
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
					type: '',
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
					type: '',
				};
			}

			return {
				...edge,
				style: { ...edge.style, stroke: '#676767', strokeWidth: 1 },
				type: '',
			};
		});

		setSelectedElement(elementClicked);
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
		setSelectedElement(elementClicked);
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
							type: 'customButtonEdge',
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
	 * This function is called to perform the connection between an element node to a group node. It adds the new element
	 * to the group and updates both the group and the schema. It also creates the custom edge between the group and the element.
	 *
	 * @param {string} groupId - The id of the group node.
	 * @param {string} elementType - The type of the element that is being added, i.e. "inputs", "outputs" or "metadata".
	 * @param {string} elementName - The name of the element that is being added.
	 * @param {Object} params - Additional params generated by reactflow.
	 */
	const addElementToGroup = async (groupId, elementType, elementName) => {
		newLog('addElementToGroup');
		let oldGroup = schemaState.groups.find((group) => group.id === groupId);
		oldGroup = JSON.parse(JSON.stringify(oldGroup));
		delete oldGroup['purpose_conflicts'];

		if (oldGroup[elementType]) {
			oldGroup[elementType].push(elementName);
		} else {
			oldGroup[elementType] = [elementName];
		}

		const tmpElements = [];

		if (oldGroup.inputs)
			oldGroup.inputs.forEach((input) => tmpElements.push(input));
		if (oldGroup.outputs)
			oldGroup.outputs.forEach((output) => tmpElements.push(output));
		if (oldGroup.metadata)
			oldGroup.metadata.forEach((metadata) => tmpElements.push(metadata));

		const newGroup = {
			display_name: oldGroup.display_name || '',
			description: oldGroup.description || '',
			name: oldGroup.name || '',
			elements: tmpElements,
		};

		const res = await requestFactory({
			type: 'PUT',
			url: `/tasks/${currentTaskState.id}/schema/groups/${groupId}`,
			userState,
			dispatch,
			data: newGroup,
		});

		if (res) {
			dispatch(
				GET_SCHEMA({ userState, taskId: currentTaskState.id, dispatch })
			);
		}
	};

	/**
	 * This function is triggered when the user connects two nodes by dragging an edge from one element node to a group node.
	 * It only performs the connection if the source node is an input/metadata and the target node is a group, or if the source
	 * node is a group and the target node is an output.
	 *
	 * @param {Object} params - Additional params generated by reactflow.
	 */
	const onConnect = (params) => {
		newLog('onConnect');
		if (params.source !== params.target) {
			const source = currentSchemaElementsState.nodes.find(
				(element) => element.id === params.source
			);
			const target = currentSchemaElementsState.nodes.find(
				(element) => element.id === params.target
			);
			if (
				source &&
				source.type === 'group' &&
				target &&
				target.type !== 'group'
			) {
				addElementToGroup(source.id, params.sourceHandle, target.name, params);
			} else if (
				source &&
				source.type !== 'group' &&
				target &&
				target.type === 'group'
			) {
				if (
					(source.type === 'customInput' && params.targetHandle === 'inputs') ||
					(source.type === 'customOutput' &&
						params.targetHandle === 'outputs') ||
					(source.type === 'customMetadata' &&
						params.targetHandle === 'metadata')
				) {
					addElementToGroup(
						target.id,
						params.targetHandle,
						source.name,
						params
					);
				}
			}
		}
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

	/**
	 * This function is used to remove the selected node from the flow. It is passed to the <CustomEdgeWithButton/>
	 * component as a callback through the <FlowActionsProvider/>. It updates both the group that the edge is connected to
	 * in the server and also the task schema.
	 *
	 * @param edgeId - The id of the edge to be removed.
	 */
	const onRemoveEdge = async (event, edgeId) => {
		event.stopPropagation();
		newLog('onRemoveEdge');

		const edgeToRemove = currentSchemaElementsState.edges.find(
			(edge) => edge.id === edgeId
		);
		const source = currentSchemaElementsState.nodes.find(
			(node) => node.id === edgeToRemove.source
		);
		const target = currentSchemaElementsState.nodes.find(
			(node) => node.id === edgeToRemove.target
		);
		const groupNode = source.type === 'group' ? source : target;
		const elementNode = source.type === 'group' ? target : source;
		const group = schemaState.groups.find((group) => group.id === groupNode.id);

		const newGroup = {
			display_name: group.display_name || '',
			description: group.description || '',
			name: group.name || '',
			elements: [],
		};

		let input;
		let metadata;
		let output;

		const tmpElements = [];

		switch (elementNode.type) {
			case 'customInput':
				input = schemaState.inputs.find((input) => input.id === elementNode.id);
				group.inputs.forEach((tmpInput) => {
					if (input.name !== tmpInput) {
						tmpElements.push(tmpInput);
					}
				});
				if (group.outputs)
					group.outputs.forEach((tmpOutput) => tmpElements.push(tmpOutput));
				if (group.metadata)
					group.metadata.forEach((tmpMetadata) =>
						tmpElements.push(tmpMetadata)
					);
				break;
			case 'customMetadata':
				metadata = schemaState.metadata.find(
					(meta) => meta.id === elementNode.id
				);
				group.metadata.forEach((tmpmeta) => {
					if (metadata.name !== tmpmeta) tmpElements.push(tmpmeta);
				});
				if (group.inputs)
					group.inputs.forEach((tmpInput) => tmpElements.push(tmpInput));
				if (group.outputs)
					group.outputs.forEach((tmpOutput) => tmpElements.push(tmpOutput));
				break;
			case 'customOutput':
				output = schemaState.outputs.find(
					(output) => output.id === elementNode.id
				);
				group.outputs.forEach((tmpOutput) => {
					if (output.name !== tmpOutput) tmpElements.push(tmpOutput);
				});
				if (group.inputs)
					group.inputs.forEach((tmpInput) => tmpElements.push(tmpInput));
				if (group.metadata)
					group.metadata.forEach((tmpMetadata) =>
						tmpElements.push(tmpMetadata)
					);
				break;
			default:
				break;
		}

		delete newGroup['purpose_conflicts'];

		newGroup.elements = tmpElements;

		const res = await requestFactory({
			type: 'PUT',
			url: `/tasks/${currentTaskState.id}/schema/groups/${group.id}`,
			userState,
			dispatch,
			data: newGroup,
		});

		if (res) {
			dispatch(
				GET_SCHEMA({ userState, taskId: currentTaskState.id, dispatch })
			);

			dispatch(
				SET_CURRENT_SCHEMA_ELEMENTS({
					...currentSchemaElementsState,
					edges: currentSchemaElementsState.edges.filter(
						(edge) => edge.id !== edgeId
					),
				})
			);
		}
	};

	/**
	 * This function is triggered when the user drags some html element over the canvas, and changes the cursor to a
	 * hand.
	 *
	 * @param event
	 */
	const onDragOver = (event) => {
		newLog('onDragOver');
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	};

	/**
	 * This function is triggered when the user drops an html element over the canvas, and adds the element to the
	 * react-flow-rendered library canvas by creating a new custom node depending on the type of the element.
	 *
	 * @param event
	 */
	const onDrop = (event) => {
		newLog('onDrop');
		event.preventDefault();

		const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
		let data = event.dataTransfer.getData('application/reactflow');

		data = JSON.parse(data);

		if (currentSchemaElementsState.nodes.find((node) => node.id === data.id)) {
			return;
		}

		const position = reactFlowInstance.project({
			x: event.clientX - reactFlowBounds.left,
			y: event.clientY - reactFlowBounds.top,
		});

		let newNode = null;
		if (data.type === 'group') {
			newNode = Nodes.createGroupNode(data.id, position, data.name);
		} else if (data.type === 'metadata') {
			newNode = Nodes.createMetadataNode(
				data.id,
				data.type,
				position,
				schemaState.metadata.find((element) => element.name === data.name)
					.display_name || data.name,
				data.name
			);
		} else {
			newNode = Nodes.createSimpleNode(
				data.id,
				data.type,
				position,
				schemaState[`${data.type}s`].find(
					(element) => element.name === data.name
				).display_name || data.name,
				data.name
			);
		}

		dispatch(
			SET_CURRENT_SCHEMA_ELEMENTS({
				...currentSchemaElementsState,
				nodes: currentSchemaElementsState.nodes.concat(newNode),
			})
		);
	};

	return (
		<ReactFlowProvider>
			<FlowActionsProvider
				onRemoveEdgeButtonClick={onRemoveEdge}
				selectedElement={selectedElement}
			>
				<Grid
					container
					direction="row"
					spacing={3}
					sx={{
						height: '100%',
					}}
				>
					<Grid item xs={12}>
						<Box
							ref={reactFlowWrapper}
							sx={{
								m: 2,
								height: '100%',
								maxHeight: '67vh',
								width: '100%',
								position: 'relative',
								border: '1px dashed #ccc',
							}}
						>
							{schemaLoaderState ? (
								<Loader size="L" />
							) : (
								<HasAccess
									roles={defaultRoles}
									permissions=""
									renderAuthFailed={
										<ReactFlow
											onInit={onInit}
											onNodeClick={onNodeClick}
											nodes={currentSchemaElementsState.nodes}
											edges={currentSchemaElementsState.edges}
											nodeTypes={nodeTypes}
											edgeTypes={edgeTypes}
										>
											<Background />
											<Controls />
										</ReactFlow>
									}
								>
									<ReactFlow
										onInit={onInit}
										onNodeClick={onNodeClick}
										onEdgeClick={onEdgeClick}
										nodes={currentSchemaElementsState.nodes}
										edges={currentSchemaElementsState.edges}
										nodeTypes={nodeTypes}
										edgeTypes={edgeTypes}
										onDrop={onDrop}
										onDragOver={onDragOver}
										onPaneClick={onPaneClick}
										onConnect={onConnect}
									>
										<Background />
										<Controls />
									</ReactFlow>
								</HasAccess>
							)}
						</Box>
					</Grid>
				</Grid>
			</FlowActionsProvider>
		</ReactFlowProvider>
	);
}

export default EditableFlow;
