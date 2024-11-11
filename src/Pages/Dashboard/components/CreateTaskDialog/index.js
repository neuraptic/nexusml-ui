import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Components
import Box from '@mui/material/Box';
import { Avatar, FormControl, Grid, MenuItem, Select } from '@mui/material';
import StandardModal from '../../../../Components/Shared/StandardModal';
import { TextInput } from '../../../../Components/Shared/Inputs/TextInput';
import { Loader } from '../../../../Components/Shared/Loader';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';

// Styles
import styles from './styles';

// Consts
import { templates } from '../../../../consts/task';

// Redux
import {
	CREATE_TASK,
	CREATE_TASK_FILE,
	GET_TASKS,
	SET_CURRENT_TASK,
	UPDATE_TASK,
} from '../../../../redux/tasks.slice';

// Alerts
import { ADD_ALERT, REMOVE_ALERT } from '../../../../redux/alerts.slice';

export const CreateTaskDialog = (props) => {
	const { parentOpen, onClose } = props;

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Global states
	const userState = useSelector((state) => state.user);

	// Local states
	const [taskName, setTaskName] = useState('');
	const [taskIcon, setTaskIcon] = useState({
		id: '',
		url: '',
		isLoading: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [template, setTemplate] = useState('empty');
	const [taskDescription, setTaskDescription] = useState('');
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(parentOpen);
	}, [parentOpen]);

	useEffect(() => {
		if (template !== '') {
			setTaskDescription(templates[template].description);
		}
	}, [template]);

	const handleChangeTaskName = useCallback((e) => {
		setTaskName(e.target.value);
	}, []);

	const handleChangeTemplate = useCallback((e) => {
		setTemplate(e.target.value);
	}, []);

	const handleChangeTaskDescription = useCallback((e) => {
		setTaskDescription(e.target.value);
	}, []);

	const handleUploadImage = async (e) => {
		setTaskIcon({ ...taskIcon, isLoading: true });
		const file = e.target.files[0];

		setTaskIcon({
			...taskIcon,
			file,
			url: URL.createObjectURL(file),
			isLoading: false,
		});
	};

	const handleClose = () => {
		setIsLoading(false);
		setOpen(false);
		onClose(false);
	};

	const handleCreateNewTask = async () => {
		setIsLoading(true);
		const newTask = {
			name: taskName,
			description: taskDescription,
		};
		if (template !== '' && template !== 'empty') newTask.template = template;

		const createdTask = await dispatch(
			CREATE_TASK({ newTask, dispatch, userState })
		);

		if (createdTask.payload && taskIcon.file) {
			const res = await dispatch(
				CREATE_TASK_FILE({
					taskId: createdTask.payload.id,
					file: taskIcon.file,
					usedFor: 'picture',
					fileType: 'image',
					userState,
					dispatch,
				})
			);
			const { id: iconId } = res.payload;
			if (iconId)
				await dispatch(
					UPDATE_TASK({
						taskId: createdTask.payload.id,
						data: { name: taskName, icon: iconId },
						userState,
						dispatch,
					})
				);
		}

		if (createdTask.payload) {
			dispatch(
				ADD_ALERT({ type: 'success', message: 'Task created successfuly' })
			);
			setTimeout(() => {
				dispatch(REMOVE_ALERT('Task created successfuly'));
			}, 3000);
			dispatch(GET_TASKS({ userState, dispatch }));
			handleClose();
			dispatch(SET_CURRENT_TASK(createdTask.payload.uuid));
			localStorage.setItem('currentTaskId', createdTask.payload.uuid);
			navigate(`/tasks/${createdTask.payload.uuid}`);
		}
		setIsLoading(false);
	};

	return (
		<StandardModal
			open={open}
			setOpen={onClose}
			title="Create task"
			content={
				<Grid container spacing={3}>
					<Grid item xs={12} sx={styles().inputContainer}>
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
								alt="Task"
								src={taskIcon.url && taskIcon.url}
								variant="circle"
							/>
						</div>
					</Grid>
					<Grid item xs={12} sx={styles().inputContainer}>
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

					<Grid item xs={12} md={6} sx={styles().inputContainer}>
						<Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
							<h4 style={{ minWidth: '80px' }}>Templates</h4>
							<FormControl sx={{ width: '100%', maxWidth: '344px' }}>
								<Select
									id="templates"
									value={template}
									onChange={handleChangeTemplate}
									name="templates"
								>
									{Object.keys(templates).map((template) => (
										<MenuItem key={templates[template].name} value={template}>
											{templates[template].name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					</Grid>
					<Grid item xs={12} md={6} sx={styles().inputContainer}>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								color: '#1A1C21',
							}}
						>
							<p>Start with empty schema or copy schema from templates</p>
						</Box>
					</Grid>

					<Grid item xs={12} sx={styles().inputContainer}>
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
						type="filled"
						loading={isLoading}
						disabled={isLoading}
						handleClick={handleCreateNewTask}
						value="Create new task"
					/>
					<StandardButton handleClick={handleClose} value="Close" close />
				</>
			}
		/>
	);
};

CreateTaskDialog.propTypes = {
	parentOpen: PropTypes.bool,
	onClose: PropTypes.func,
};
