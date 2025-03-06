import { action } from '@storybook/addon-actions';
import { CustomPagination } from './index';

export default {
	title: 'Components/CustomPagination',
	component: CustomPagination,
	tags: ['autodocs'],
	argTypes: {
		total: { control: 'number' },
		rowsPerPage: { control: 'number' },
		page: { control: 'number' },
		simple: { control: 'boolean' },
		rowsPerPageOptions: { control: 'array' },
		column: { control: 'object' },
	},
};

export const Default = (args) => <CustomPagination {...args} />;

Default.args = {
	total: 100,
	rowsPerPage: 10,
	page: 0,
	simple: false,
	rowsPerPageOptions: [5, 10, 25],
	handleChangePage: action('Page changed'),
	handleChangeRowsPerPage: action('Rows per page changed'),
};

export const SimplePagination = (args) => <CustomPagination {...args} />;

SimplePagination.args = {
	total: 100,
	rowsPerPage: 10,
	page: 0,
	simple: true,
	rowsPerPageOptions: [5, 10, 25],
	handleChangePage: action('Page changed'),
	handleChangeRowsPerPage: action('Rows per page changed'),
};

export const WithColumn = (args) => <CustomPagination {...args} />;

WithColumn.args = {
	total: 100,
	rowsPerPage: 10,
	page: 0,
	simple: false,
	rowsPerPageOptions: [5, 10, 25],
	column: { fieldType: 'data' },
	handleChangePage: action('Page changed'),
	handleChangeRowsPerPage: action('Rows per page changed'),
};
