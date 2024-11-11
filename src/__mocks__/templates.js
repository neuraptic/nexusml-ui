import { v4 as uuid } from 'uuid';

export const templates = {
	'object-detection': {
		inputs: [
			{
				uuid: uuid(),
				id: 'asdfasdfasdf1',
				name: 'Image Input',
				type: 'image',
			},
		],
		outputs: [
			{
				uuid: uuid(),
				id: 'asdfasdfasdf2',
				name: 'Object Location',
				type: 'shape',
				'multi-value': 'unordered',
			},
			{
				uuid: uuid(),
				id: 'asdfasdfasdf3',
				name: 'Object Type',
				type: 'categorical',
				categories: [],
			},
			{
				uuid: uuid(),
				id: 'asdfasdfasdf4',
				name: 'Object Probability',
				type: 'numeric',
			},
		],
		metadata: [],
		groups: [
			{
				name: 'Image input',
				caption: 'Image input',
				description: 'Image input',
				inputs: ['asdfasdfasdf1'],
				outputs: ['asdfasdfasdf2', 'asdfasdfasdf3', 'asdfasdfasdf4'],
				metadata: [],
			},
		],
	},
	'image-classification': {
		inputs: [
			{
				uuid: uuid(),
				id: 'asdfasdfasdf1',
				name: 'Image Input',
				type: 'image',
			},
		],
		outputs: [
			{
				uuid: uuid(),
				id: 'asdfasdfasdf2',
				name: 'Classification',
				type: 'categorical',
				categories: [],
			},
			{
				uuid: uuid(),
				id: 'asdfasdfasdf3',
				name: 'Classification Probability',
				type: 'numeric',
			},
		],
		metadata: [],
		groups: [
			{
				name: 'Image input',
				caption: 'Image input',
				description: 'Image input',
				inputs: ['asdfasdfasdf1'],
				outputs: ['asdfasdfasdf2', 'asdfasdfasdf3'],
				metadata: [],
			},
		],
	},
	'speech-recognition': {
		inputs: [
			{
				uuid: uuid(),
				id: 'asdfasdfasdf1',
				name: 'Audio Input',
				type: 'audio',
			},
		],
		outputs: [
			{
				uuid: uuid(),
				id: 'asdfasdfasdf2',
				name: 'Recognized Text',
				type: 'text',
			},
			{
				uuid: uuid(),
				id: 'asdfasdfasdf3',
				name: 'Recognition Confidence',
				type: 'numeric',
			},
		],
		metadata: [],
		groups: [
			{
				name: 'Audio input',
				caption: 'Audio input',
				description: 'Audio input',
				inputs: ['asdfasdfasdf1'],
				outputs: ['asdfasdfasdf2', 'asdfasdfasdf3'],
				metadata: [],
			},
		],
	},
};
