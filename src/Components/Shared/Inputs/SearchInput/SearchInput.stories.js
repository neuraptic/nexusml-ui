import React, { useState } from 'react';
import { SearchInput } from './index';

export default {
	title: 'Components/SearchInput',
	component: SearchInput,
	tags: ['autodocs'],
	argTypes: {
		placeholder: { control: 'text' },
		value: { control: 'text' },
		handleChange: { action: 'handleChange' },
	},
};

export const Default = (args) => {
	const { handleChange } = args;
	const [searchValue, setSearchValue] = useState('');

	const onChange = (e) => {
		setSearchValue(e.target.value);
		handleChange(e);
	};

	return <SearchInput {...args} value={searchValue} handleChange={onChange} />;
};

Default.args = {
	placeholder: 'Search...',
};
