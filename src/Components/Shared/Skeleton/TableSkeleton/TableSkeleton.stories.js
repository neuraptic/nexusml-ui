import React from 'react';
import TableSkeleton from './index';

export default {
	title: 'Components/TableSkeleton',
	component: TableSkeleton,
	tags: ['autodocs'],
	argTypes: {
		colsNumber: { control: 'number' },
	},
};

export const Default = (args) => <TableSkeleton {...args} />;

Default.args = {
	colsNumber: 5,
};

export const FewColumns = (args) => <TableSkeleton {...args} />;

FewColumns.args = {
	colsNumber: 3,
};

export const ManyColumns = (args) => <TableSkeleton {...args} />;

ManyColumns.args = {
	colsNumber: 10,
};
