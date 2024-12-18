import React from 'react';
import StandardTable from './index';

export default {
	title: 'Components/StandardTable',
	component: StandardTable,
	tags: ['autodocs'],
	argTypes: {
		tableContent: { control: 'object' },
	},
};

export const Default = (args) => <StandardTable {...args} />;

Default.args = {
	tableContent: {
		titles: ['Deployment', 'Version', 'Last Modification', 'Actions'],
		rows: [
			{
				logo: 'https://via.placeholder.com/40',
				deploymentName: 'Deployment 1',
				deploymentDescription: 'This is the description for deployment 1',
				version: 'v1.0.0',
				lastModification: new Date(),
			},
			{
				logo: 'https://via.placeholder.com/40',
				deploymentName: 'Deployment 2',
				deploymentDescription: 'This is the description for deployment 2',
				version: 'v1.1.0',
				lastModification: new Date(),
			},
			{
				logo: 'https://via.placeholder.com/40',
				deploymentName: 'Deployment 3',
				deploymentDescription: 'This is the description for deployment 3',
				version: 'v2.0.0',
				lastModification: new Date(),
			},
		],
	},
};
