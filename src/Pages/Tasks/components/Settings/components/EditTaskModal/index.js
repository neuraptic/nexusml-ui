/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { Avatar, Box, Grid } from '@mui/material';
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';
import { TextInput } from '../../../../../../Components/Shared/Inputs';
import { Loader } from '../../../../../../Components/Shared/Loader';

// Redux
import {
	CREATE_TASK_FILE,
	GET_TASKS,
	SET_CURRENT_TASK,
	UPDATE_TASK,
} from '../../../../../../redux/tasks.slice';

export const EditTaskModal = (props) => {
	const { open, setOpen } = props;

	const dispatch = useDispatch();

	// Global states
	const userState = useSelector((state) => state.user);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);

	// Local states
	const [taskName, setTaskName] = useState('');
	const [taskIcon, setTaskIcon] = useState({
		id: '',
		url: '',
		isLoading: false,
	});
	const [taskDescription, setTaskDescription] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (Object.keys(currentTaskState)?.length > 0) {
			setTaskName(currentTaskState.name || '');
			setTaskIcon({
				...taskIcon,
				url: currentTaskState.icon ? currentTaskState.icon['download_url'] : '',
			});
			setTaskDescription(currentTaskState.description || '');
		}
	}, [currentTaskState]);

	const handleClose = () => {
		setIsLoading(false);
		setOpen(false);
	};

	const handleUpdateTask = async () => {
		const dataCleanup = {};
		if (taskName !== '') dataCleanup.name = taskName;
		if (taskDescription !== '') dataCleanup.description = taskDescription;
		if (taskIcon.id !== '') dataCleanup.icon = taskIcon.id;

		await dispatch(
			UPDATE_TASK({
				taskId: currentTaskState.uuid,
				data: dataCleanup,
				userState,
				dispatch,
			})
		);

		await dispatch(
			GET_TASKS({
				userState,
				dispatch,
			})
		);

		dispatch(SET_CURRENT_TASK(currentTaskState.uuid));

		handleClose();
	};

	const handleChangeTaskName = useCallback((e) => {
		setTaskName(e.target.value);
	}, []);

	const handleChangeTaskDescription = useCallback((e) => {
		setTaskDescription(e.target.value);
	}, []);

	const handleUploadImage = async (e) => {
		setIsLoading(true);
		setTaskIcon({ ...taskIcon, isLoading: true });
		const file = e.target.files[0];

		if (file) {
			const res = await dispatch(
				CREATE_TASK_FILE({
					taskId: currentTaskState.uuid,
					file,
					usedFor: 'picture',
					fileType: 'image',
					userState,
					dispatch,
				})
			);

			setTaskIcon({
				...taskIcon,
				id: res.payload.id,
				file,
				url: URL.createObjectURL(file),
				isLoading: false,
			});
		}

		setIsLoading(false);
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Edit view:"
			content={
				<Grid container spacing={3}>
					<Grid item xs={12} className="inputContainer">
						<h4 style={{ minWidth: '80px' }}>Task icon</h4>
						<div style={{ display: 'flex', gap: 12 }}>
							{taskIcon.isLoading ? (
								<StandardButton
									value={<Loader size="S" local />}
									type="uploadFile"
								/>
							) : (
								<StandardButton
									type="uploadFile"
									value="Upload image"
									handleChange={handleUploadImage}
								/>
							)}
							<Avatar
								alt="Task logo"
								src={
									taskIcon.url
										? taskIcon.url
										: currentTaskState.icon
										? currentTaskState.icon['download_url']
										: null
								}
								variant="circle"
							>
								{currentTaskState.name[0]}
							</Avatar>
						</div>
					</Grid>
					<Grid item xs={12} className="inputContainer">
						<h4 style={{ minWidth: '80px' }}>Task name</h4>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: '7px',
							}}
						>
							<TextInput
								placeholder="Type task name"
								onChange={handleChangeTaskName}
								value={taskName}
							/>
						</Box>
					</Grid>

					<Grid item xs={12} className="inputContainer">
						<h4 style={{ minWidth: '80px' }}>Description</h4>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: '7px',
								width: '65%',
							}}
						>
							<textarea
								placeholder="Type task description"
								style={{
									minWidth: '344px',
									width: '100%',
									minHeight: '150px',
									padding: '12px',
									background: '#fafbfd',
									border: '1px solid #70707045',
									borderRadius: '3px',
									letterSpacing: '0.17px',
									color: '#1a1c21',
									fontSize: '14px',
									resize: 'none',
								}}
								onChange={handleChangeTaskDescription}
								value={taskDescription}
							/>
						</Box>
					</Grid>
				</Grid>
			}
			actions={
				<>
					<StandardButton
						loading={isLoading}
						disabled={isLoading}
						value="Save changes"
						handleClick={handleUpdateTask}
					/>
					<StandardButton value="Close" handleClick={handleClose} close />
				</>
			}
		/>
	);
};

EditTaskModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
