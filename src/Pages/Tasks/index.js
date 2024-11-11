import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// Components
import { Grid } from '@mui/material';
import PageTitle from '../../Components/Shared/PageTitle';
import {
	TaskStatus,
	TaskSchema,
	TaskExamples,
	TaskModels,
	TaskAITesting,
	TaskAIPredictions,
	TaskSettings,
} from './components';

// Consts
import { measures } from '../../consts/sizes';

// Redux
import { SET_CURRENT_TASK } from '../../redux/tasks.slice';

export const Tasks = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	const { currentTask: currentTaskState, tasks: tasksState } = useSelector(
		(state) => state.tasks
	);

	const [currentTab, setCurrentTab] = useState('examples');

	useEffect(() => {
		if (Object.keys(currentTaskState).length === 0) {
			const currentTaskId = location.pathname.split('/')[2];
			if (tasksState.length > 0) {
				dispatch(SET_CURRENT_TASK(currentTaskId));
			}
		}
	}, [tasksState]);

	return (
		<>
			<PageTitle
				title={currentTaskState.name}
				task={currentTaskState}
				tabs={{
					currentTab,
					setCurrentTab,
					tabsArray: [
						{
							label: 'Status',
							linkTo: 'status',
						},
						{
							label: 'Schema',
							linkTo: 'schema',
						},
						{
							label: 'Examples',
							linkTo: 'examples',
						},
						{
							label: 'AI Models',
							linkTo: 'aimodels',
						},
						{
							label: 'AI Testing',
							linkTo: 'aitesting',
						},
						{
							label: 'AI Predictions',
							linkTo: 'aipredictions',
						},
						{
							label: 'Settings',
							linkTo: 'settings',
						},
					],
				}}
			/>
			<Grid
				item
				xs={12}
				sm={12}
				md={12}
				sx={{
					px: {
						xs: 1,
						sm: 4,
						md: measures.mdGeneralMargin,
						lg: measures.lgGeneralMargin,
					},
					width: '100%',
					marginTop: '30px',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{currentTab === 'status' && (
					<TaskStatus setCurrentTab={setCurrentTab} />
				)}
				{currentTab === 'schema' && <TaskSchema />}
				{currentTab === 'examples' && <TaskExamples />}
				{currentTab === 'aimodels' && <TaskModels />}
				{currentTab === 'aitesting' && <TaskAITesting />}
				{currentTab === 'aipredictions' && <TaskAIPredictions />}
				{currentTab === 'settings' && <TaskSettings />}
			</Grid>
		</>
	);
};
