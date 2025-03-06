import React from 'react';
import { TaskCardSkeleton } from './index';

export default {
	title: 'Components/TaskCardSkeleton',
	component: TaskCardSkeleton,
	tags: ['autodocs'],
};

export const Default = () => <TaskCardSkeleton />;

export const CustomHeight = () => (
	<TaskCardSkeleton style={{ height: '300px' }} />
);
