import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Manage roles & permissions
import { HasAccess } from '@permify/react-role';

// Components
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Card, Grid } from '@mui/material';
import StatusBar from '../../../Components/Shared/StatusBar';
import AccessDenied from '../../../Components/Core/AccessDenied';
import { TaskCardSkeleton } from '../../../Components/Shared/Skeleton/TaskCardSkeleton';

// Redux
import { SET_CURRENT_TASK } from '../../../redux/tasks.slice';
import { RESET_EXAMPLES_STATE } from '../../../redux/examples.slice';

// Styles
import styles from './styles';

// Consts
import { defaultRoles } from '../../../consts/rolesAndPermissions';

// Services
import { getIntervalDate, getLocalDateTime } from '../../../services/date';

// Hooks
import { useWindowSize } from '../../../services/hooks/useWindowResize';

function Tasks() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const windowSize = useWindowSize();

	const { tasks: tasksState } = useSelector((state) => state.tasks);
	const { location: userLocationState } = useSelector((state) => state.user);
	const { dashboard: dashboardLoaderManager } = useSelector(
		(state) => state.loaders
	);

	const [shownTasks, setShownTasks] = useState([]);

	const [moreTasksLoading, setMoreTasksLoading] = useState(false);
	const [rowsPerPage, setRowsPerPage] = useState(9);

	useEffect(() => {
		if (windowSize.width > 1535) {
			setRowsPerPage(12);
			setShownTasks(tasksState.slice(0, 12));
		} else {
			setRowsPerPage(9);
			setShownTasks(tasksState.slice(0, 9));
		}
	}, []);

	useEffect(() => {
		if (windowSize.width > 1535) setRowsPerPage(12);
		else setRowsPerPage(9);
	}, [windowSize.width]);

	useEffect(() => {
		setShownTasks(tasksState.slice(0, rowsPerPage));
	}, [rowsPerPage, tasksState]);

	const handleSelectTask = (taskId) => {
		if (localStorage.getItem('oldTaskId') !== taskId)
			dispatch(RESET_EXAMPLES_STATE());
		window.localStorage.setItem('currentTaskId', taskId);
		dispatch(SET_CURRENT_TASK(taskId));
		navigate(`/tasks/${taskId}`);
	};

	const fetchMoreTasks = () => {
		setMoreTasksLoading(true);
		setTimeout(() => {
			setShownTasks(tasksState.slice(0, shownTasks.length + rowsPerPage));
			setMoreTasksLoading(false);
		}, 1000);
	};

	return (
		<HasAccess
			roles={defaultRoles}
			permissions="task.read"
			renderAuthFailed={<AccessDenied />}
		>
			<InfiniteScroll
				style={{ padding: '6px' }}
				dataLength={tasksState.length}
				next={fetchMoreTasks}
				hasMore={shownTasks.length < tasksState.length}
			>
				<Grid container spacing={2} sx={styles().tasksContainer}>
					{dashboardLoaderManager.tasks &&
						[...Array(rowsPerPage)].map((e, i) => (
							<Grid key={i} item xs={12} sm={6} md={4} lg={4} xl={3}>
								<TaskCardSkeleton />
							</Grid>
						))}
					{shownTasks.map((task) => (
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={4}
							xl={3}
							key={task.id}
							onClick={() => handleSelectTask(task.uuid)}
						>
							<Card elevation={3} sx={styles().taskCard}>
								<div style={styles().taskIcon}>
									<Avatar
										src={task.icon ? task.icon['download_url'] : null}
										variant="circle"
									/>
								</div>
								<div style={styles().taskName}>{task.name}</div>
								<div style={styles().taskDescription}>
									<b>Description: </b>
									{task.description}
								</div>
								<div style={styles().taskLastModification}>
									<b>Last modification:</b>
									{getIntervalDate(
										getLocalDateTime(task.modified_at, userLocationState)
									)}
								</div>
								<div style={styles().taskStatus}>
									{Object.keys(task)?.length > 0 &&
										task.status &&
										task.status.status_code && (
											<StatusBar
												type="task"
												code={task.status.status_code}
												name={task.status.display_name}
												description={task.status.description}
											/>
										)}
								</div>
							</Card>
						</Grid>
					))}
				</Grid>
			</InfiniteScroll>

			{moreTasksLoading && (
				<Grid container spacing={2} sx={styles().tasksContainer}>
					{[...Array(rowsPerPage)].map((e, i) => (
						<Grid key={i} item xs={12} sm={6} md={4} lg={4} xl={3}>
							<TaskCardSkeleton />
						</Grid>
					))}
				</Grid>
			)}
		</HasAccess>
	);
}

export default Tasks;
