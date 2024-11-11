import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Manage roles & permissions
import { HasAccess } from '@permify/react-role';

// Components
import { Grid } from '@mui/material';
import CardItem from '../../Components/Shared/CardItem';
import Tasks from './Tasks';
import StandardButton from '../../Components/Shared/Buttons/StandardButton';
import { CreateTaskDialog } from './components/CreateTaskDialog';
import { EmailVerification } from '../EmailVerification';

// Consts
import { measures } from '../../consts/sizes';
import { defaultRoles } from '../../consts/rolesAndPermissions';

// Redux
import { GET_TASKS } from '../../redux/tasks.slice';

function Dashboard() {
	const dispatch = useDispatch();

	// Global states
	const tasksState = useSelector((state) => state.tasks);
	const organizationState = useSelector((state) => state.organization);
	const userState = useSelector((state) => state.user);
	const { accessToken, isVerified } = useSelector((state) => state.user);

	// Local states
	const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
	const [openIsVerifiedModal, setOpenIsVerifiedModal] = useState(false);

	useEffect(() => {
		if (!isVerified) setOpenIsVerifiedModal(true);
	}, [isVerified]);

	useEffect(() => {
		// Refresh tasks list if tasks is empty (probably some tasks are creating)
		if (
			tasksState.length === 0 &&
			userState.id !== '' &&
			organizationState.info.id !== ''
		) {
			dispatch(GET_TASKS({ userState, dispatch }));
		}
	}, []);

	useEffect(() => {
		if (!tasksState.isLoading && tasksState.tasks.length === 0)
			dispatch(GET_TASKS({ userState, dispatch }));
	}, [accessToken]);

	const handleCreateTask = () => {
		setOpenCreateTaskModal(true);
	};

	return (
		<>
			<Grid
				container
				component="main"
				sx={{
					px: {
						xs: 1,
						sm: 4,
						md: measures.mdGeneralMargin,
						lg: measures.lgGeneralMargin,
					},
					display: 'flex',
					alignItems: 'flex-center',
				}}
				spacing={2}
			>
				{
					// FIRST ROW
				}

				<Grid
					item
					xs={12}
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'flex-center',
					}}
				>
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							display: 'flex',
							padding: 1,
							marginBottom: 3,
						}}
						title="Tasks"
						titlelink={
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<HasAccess
									roles={defaultRoles}
									permissions="task.create"
									renderAuthFailed={
										<StandardButton type="disabled" value="Create task" />
									}
								>
									<StandardButton
										value="Create task"
										handleClick={handleCreateTask}
									/>
								</HasAccess>
							</div>
						}
					>
						<Tasks />
					</CardItem>
				</Grid>
			</Grid>
			{/* Modals */}
			{openCreateTaskModal && (
				<CreateTaskDialog
					parentOpen={openCreateTaskModal}
					onClose={setOpenCreateTaskModal}
				/>
			)}
			{openIsVerifiedModal && (
				<EmailVerification
					open={openIsVerifiedModal}
					setOpen={setOpenIsVerifiedModal}
				/>
			)}
		</>
	);
}

export default Dashboard;
