/* eslint-disable camelcase */
import { max } from 'wavesurfer.js/src/util';

// Components
import { Nodes } from './nodes';

export const schema2elements = (schema) => {
	const elements = { nodes: [], edges: [] };
	const group_y = 50;
	const group_x = 400;
	let input_y = 50;
	let output_y = 50;
	let metadata_x = 200;
	const metadata_offset =
		max([
			schema.inputs?.length,
			schema.outputs?.length,
			schema.groups?.length,
		]) * 75;
	const metadata_y = 100 + metadata_offset;

	// Check if group has any element in its inputs, outputs or metadata and add it to the elements array
	if (
		schema.inputs?.length > 0 ||
		schema.outputs?.length > 0 ||
		schema.metadata?.length > 0
	) {
		// Create NexusML group node to group all the elements
		elements.nodes.push(
			Nodes.createGroupNode(
				'test_id',
				{ x: group_x, y: group_y },
				'NexusML',
				'NexusML'
			)
		);

		// Create input nodes
		schema.inputs?.forEach((input) => {
			const element = elements.nodes.find((element) => element.id === input.id);
			if (!element) {
				elements.nodes.push(
					Nodes.createSimpleNode(
						input.id,
						'input',
						{ x: 50, y: input_y },
						input.display_name || input.name,
						input.name,
						input.type
					)
				);
				input_y += 50;
			}
			elements.edges.push({
				id: `${input.id}-test_id`,
				source: input.id,
				target: 'test_id',
				targetHandle: 'inputs',
				animated: true,
				style: { stroke: '#676767', strokeWidth: 1 },
			});
		});

		// Create metadata nodes
		schema.metadata?.forEach((metadata) => {
			const element = elements.nodes.find(
				(element) => element.id === metadata.id
			);
			if (!element) {
				elements.nodes.push(
					Nodes.createMetadataNode(
						metadata.id,
						'metadata',
						{ x: metadata_x, y: metadata_y },
						metadata.display_name ? metadata.display_name : metadata.name,
						metadata.name,
						metadata.type
					)
				);
				metadata_x += 200;
			}
			elements.edges.push({
				id: `${metadata.id}-test_id`,
				source: metadata.id,
				target: 'test_id',
				targetHandle: 'metadata',
				animated: true,
				style: { stroke: '#676767', strokeWidth: 1 },
			});
		});

		// Create output nodes
		schema.outputs?.forEach((output) => {
			const element = elements.nodes.find(
				(element) => element.name === output.name
			);
			if (!element) {
				elements.nodes.push(
					Nodes.createSimpleNode(
						output.id,
						'output',
						{ x: 750, y: output_y },
						output.display_name || output.name,
						output.name,
						output.type
					)
				);
				output_y += 50;
			}
			elements.edges.push({
				id: `test_id-${output.id}`,
				source: 'test_id',
				target: output.id,
				targetHandle: 'outputs',
				animated: true,
				style: { stroke: '#676767', strokeWidth: 1 },
			});
		});
	}

	// for (let i = 0; i < schema.groups?.length; i += 1) {
	// 	const group = schema.groups[i];
	// 	// Check if group has any element in its inputs, outputs or metadata and add it to the elements array
	// 	if (
	// 		group.inputs?.length > 0 ||
	// 		group.outputs?.length > 0 ||
	// 		group.metadata?.length > 0
	// 	) {
	// 		elements.nodes.push(
	// 			Nodes.createGroupNode(
	// 				group.id,
	// 				{ x: group_x, y: group_y },
	// 				group.display_name || group.name,
	// 				group.name
	// 			)
	// 		);
	// 		group_y += 100;
	// 		for (const groupInput of group.inputs) {
	// 			const input = schema.inputs.find((input) => input.name === groupInput);
	// 			const element = elements.nodes.find(
	// 				(element) => element.id === input.id
	// 			);
	// 			if (!element) {
	// 				elements.nodes.push(
	// 					Nodes.createSimpleNode(
	// 						input.id,
	// 						'input',
	// 						{ x: 50, y: input_y },
	// 						input.display_name || input.name,
	// 						input.name,
	// 						input.type
	// 					)
	// 				);
	// 				input_y += 50;
	// 			}
	// 			elements.edges.push({
	// 				id: `${input.id}-${group.id}`,
	// 				source: input.id,
	// 				target: group.id,
	// 				targetHandle: 'inputs',
	// 				animated: true,
	// 				style: { stroke: '#676767', strokeWidth: 1 },
	// 			});
	// 		}
	// 		if (group.outputs) {
	// 			for (const groupOutput of group.outputs) {
	// 				const output = schema.outputs.find(
	// 					(output) => output.name === groupOutput
	// 				);
	// 				const element = elements.nodes.find(
	// 					(element) => element.name === output.name
	// 				);
	// 				if (!element) {
	// 					elements.nodes.push(
	// 						Nodes.createSimpleNode(
	// 							output.id,
	// 							'output',
	// 							{ x: 750, y: output_y },
	// 							output.display_name || output.name,
	// 							output.name,
	// 							output.type
	// 						)
	// 					);
	// 					output_y += 50;
	// 				}
	// 				// todo: check if is group.id-output.id or output.id-group.id as inputs and metadata
	// 				elements.edges.push({
	// 					id: `${group.id}-${output.id}`,
	// 					source: group.id,
	// 					target: output.id,
	// 					targetHandle: 'outputs',
	// 					animated: true,
	// 					style: { stroke: '#676767', strokeWidth: 1 },
	// 				});
	// 			}
	// 		}
	// 		if (group.metadata) {
	// 			metadata_x = 200;
	// 			for (const groupMetadata of group.metadata) {
	// 				const metadata = schema.metadata.find(
	// 					(metadata) => metadata.name === groupMetadata
	// 				);
	// 				const element = elements.nodes.find(
	// 					(element) => element.id === metadata.id
	// 				);
	// 				if (!element) {
	// 					elements.nodes.push(
	// 						Nodes.createMetadataNode(
	// 							metadata.id,
	// 							'metadata',
	// 							{ x: metadata_x, y: metadata_y },
	// 							metadata.display_name ? metadata.display_name : metadata.name,
	// 							metadata.name,
	// 							metadata.type
	// 						)
	// 					);
	// 					metadata_x += 200;
	// 				}
	// 				elements.edges.push({
	// 					id: `${metadata.id}-${group.id}`,
	// 					source: metadata.id,
	// 					target: group.id,
	// 					targetHandle: 'metadata',
	// 					animated: true,
	// 					style: { stroke: '#676767', strokeWidth: 1 },
	// 				});
	// 			}
	// 		}
	// 	}
	// }
	return elements;
};
