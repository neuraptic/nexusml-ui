import React from 'react';
import StatusBar from './index';
import { statuses } from '../../../consts/status';

export default {
	title: 'Components/StatusBar',
	component: StatusBar,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: { type: 'select' },
			options: ['service', null],
		},
		status: { control: 'select', options: Object.keys(statuses) },
		code: { control: 'text' },
		name: { control: 'text' },
		description: { control: 'text' },
	},
};

export const ServiceStatus = (args) => <StatusBar {...args} />;

ServiceStatus.args = {
	type: 'service',
	code: 'service_disabled',
	name: '',
	description: '',
};

export const CustomStatus = (args) => <StatusBar {...args} />;

CustomStatus.args = {
	type: null,
	status: '',
	code: '',
	name: 'Custom Status',
	description: 'This is a custom status description.',
};
