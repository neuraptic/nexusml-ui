import React, { useState } from 'react';
import { TextInput } from './index';

export default {
	title: 'Components/TextInput',
	component: TextInput,
	tags: ['autodocs'],
	argTypes: {
		placeholder: { control: 'text' },
		handleChange: { action: 'onChange' },
	},
};

export const Default = (args) => {
	const { handleChange } = args;
	const [inputValue, setInputValue] = useState('');

	const onChange = (e) => {
		setInputValue(e.target.value);
		handleChange(e);
	};

	return <TextInput {...args} value={inputValue} onChange={onChange} />;
};

Default.args = {
	placeholder: 'Enter text...',
};
