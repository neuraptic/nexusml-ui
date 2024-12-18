import React, { useState } from 'react';
import { Button } from '@mui/material';
import DropdownMenu from './DropdownMenu';

export default {
	title: 'Components/DropdownMenu',
	component: DropdownMenu,
	tags: ['autodocs'],
	argTypes: {
		menuItems: { control: 'array' },
		anchorOrigin: { control: 'object' },
		transformOrigin: { control: 'object' },
	},
};

export const Default = (args) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<div>
			<Button variant="contained" onClick={handleClick}>
				Open Menu
			</Button>
			<DropdownMenu {...args} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
		</div>
	);
};

Default.args = {
	menuItems: [
		{ title: 'Item 1', link: '/item1' },
		{ title: 'Item 2', link: '/item2' },
		{ title: 'Item 3', link: '/item3' },
	],
	anchorOrigin: {
		vertical: 'bottom',
		horizontal: 'left',
	},
	transformOrigin: {
		vertical: 'top',
		horizontal: 'left',
	},
};
