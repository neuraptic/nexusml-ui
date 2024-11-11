import React from 'react';
import { Loader } from './index';

export default {
	title: 'Components/Loader',
	component: Loader,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: { type: 'select' },
			options: ['S', 'M', 'L'],
		},
		local: { control: 'boolean' },
	},
};

export const Default = (args) => <Loader {...args} />;

Default.args = {
	size: 'M',
	local: false,
};

export const SmallLocalLoader = (args) => <Loader {...args} />;

SmallLocalLoader.args = {
	size: 'S',
	local: true,
};

export const LargeGlobalLoader = (args) => <Loader {...args} />;

LargeGlobalLoader.args = {
	size: 'L',
	local: false,
};
