import React from 'react';

// Components
import PageTitle from './index';

// Services
import { newLog } from '../../../services/logger';

export default {
	title: 'Components/PageTitle',
	component: PageTitle,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		task: { control: 'object' },
		tabs: { control: 'object' },
	},
};

export const Default = (args) => <PageTitle {...args} />;

Default.args = {
	title: 'My Page Title',
	task: {
		icon: { download_url: 'https://via.placeholder.com/40' },
	},
	tabs: {
		currentTab: 'tab1',
		setCurrentTab: (tab) => newLog(`Switched to ${tab}`),
		tabsArray: [
			{ label: 'Tab 1', linkTo: 'tab1' },
			{ label: 'Tab 2', linkTo: 'tab2', comingSoon: true },
			{ label: 'Tab 3', linkTo: 'tab3' },
		],
	},
};

export const NoTabs = (args) => <PageTitle {...args} />;

NoTabs.args = {
	title: 'Page Title Without Tabs',
	task: {
		icon: { download_url: 'https://via.placeholder.com/40' },
	},
	tabs: null,
};
