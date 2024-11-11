/* eslint-disable */
// Consts
import { colors } from '../../consts/colors';

export class Nodes {
	static createSimpleNode(id, type, position, label, name, element_type) {
		return {
			id: id,
			position: position,
			data: {
				id: id,
				type: type,
				label: label,
				name: name,
				element_type: element_type,
			},
			name: name,
			...(type === 'input'
				? {
						type: 'customInput',
						style: {
							backgroundColor: '#fff',
							border: `1px solid ${colors.taskInput}`,
							borderRadius: '5px',
							padding: 10,
							zIndex: 0,
						},
				  }
				: {
						type: 'customOutput',
						style: {
							backgroundColor: '#fff',
							border: `1px solid ${colors.taskOutput}`,
							borderRadius: '5px',
							padding: 10,
							zIndex: 0,
						},
				  }),
		};
	}

	static createMetadataNode(id, type, position, label, name, element_type) {
		return {
			id: id,
			type: 'customMetadata',
			data: {
				id: id,
				type: type,
				label: label,
				name: name,
				element_type: element_type,
			},
			name: name,
			position: position,
			style: {
				backgroundColor: '#fff',
				border: `1px solid ${colors.taskMetaData}`,
				borderRadius: '5px',
				padding: 10,
				zIndex: 0,
			},
		};
	}

	static createGroupNode(id, position, label, name) {
		return {
			id: id,
			type: 'group',
			position: position,
			data: {
				label: label,
			},
			name: name,
			style: {
				backgroundColor: '#fff',
				border: 'none',
				padding: 0,
				// border: `3px solid ${colors.blue}`,
				// borderRadius: '30%',
				// padding: 10,
				zIndex: 0,
			},
			// style: {
			// 	position: 'relative',
			// 	display: 'inline-block',
			// 	backgroundColor: '#fff',
			// 	borderRadius: '20px',
			// 	boxShadow: '0 0 0 10px #87CEEB, 0 0 0 15px #fff',

			// 	'& > .cloud-border::before, .cloud-border::after': {
			// 		content: '',
			// 		position: 'absolute',
			// 		background: '#87CEEB',
			// 		borderRadius: '50%',
			// 	},

			// 	'& > .cloud-border::before': {
			// 		width: '80px',
			// 		height: '80px',
			// 		top: '-40px',
			// 		left: '20px',
			// 	},

			// 	'& > .cloud-border::after': {
			// 		width: '100px',
			// 		height: '100px',
			// 		top: '-50px',
			// 		right: '20px',
			// 	},
			// },
		};
	}
}
