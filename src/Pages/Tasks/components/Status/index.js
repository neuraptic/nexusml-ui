/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

// Manage roles & permissions
import { HasAccess } from '@permify/react-role';

// Components
import { Box, Grid, Typography, Skeleton, IconButton } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CardItem from '../../../../Components/Shared/CardItem';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import StandardModal from '../../../../Components/Shared/StandardModal';
import AccessDenied from '../../../../Components/Core/AccessDenied';
import StatusBar from '../../../../Components/Shared/StatusBar';

// Styles
import styles from './styles';

// Consts
import { measures } from '../../../../consts/sizes';
import { colors } from '../../../../consts/colors';
import { defaultRoles } from '../../../../consts/rolesAndPermissions';

// Services
import { getIntervalDate, getLocalDateTime } from '../../../../services/date';
import requestFactory from '../../../../services/request.factory';

// Redux
import { ADD_ALERT, REMOVE_ALERT } from '../../../../redux/alerts.slice';

export const TaskStatus = (props) => {
	const { setCurrentTab } = props;

	const dispatch = useDispatch();

	// Global states
	const {
		currentTask: currentTaskState,
		currentTaskSettings: currentTaskSettingsState,
	} = useSelector((state) => state.tasks);
	const { totalExamples: totalExamplesState } = useSelector(
		(state) => state.examples
	);
	const userState = useSelector((state) => state.user);
	const { productionAIModel: productionAIModelState } = useSelector(
		(state) => state.aimodels
	);
	const {
		info: taskInfoLoaderState,
		services: taskServiceLoaderState,
		productionModel: taskProductionModelLoaderState,
	} = useSelector((state) => state.loaders.task.status);
	const { location: userLocationState } = useSelector((state) => state.user);

	// Local states
	const [servicesStatus, setServicesStatus] = useState({
		active_learning: 0,
		continual_learning: 0,
		monitoring: 0,
		inference: 0,
		testing: 0,
	});

	// Modals
	const [openShowSchema, setOpenShowSchema] = useState(false);

	const handleCloseShowModal = () => {
		setOpenShowSchema(false);
	};

	const getServicesStatus = async () => {
		let tmpServices = servicesStatus;
		await requestFactory({
			type: 'GET',
			url: `/tasks/${currentTaskState.uuid}/services/inference`,
			userState,
			dispatch,
		}).then((res) => {
			tmpServices = {
				...tmpServices,
				inference: res.status,
			};
		});
		await requestFactory({
			type: 'GET',
			url: `/tasks/${currentTaskState.uuid}/services/monitoring`,
			userState,
			dispatch,
		}).then((res) => {
			tmpServices = {
				...tmpServices,
				monitoring: res.status,
			};
		});
		await requestFactory({
			type: 'GET',
			url: `/tasks/${currentTaskState.uuid}/services/active-learning`,
			userState,
			dispatch,
		}).then((res) => {
			tmpServices = {
				...tmpServices,
				active_learning: res.status,
			};
		});
		await requestFactory({
			type: 'GET',
			url: `/tasks/${currentTaskState.uuid}/services/continual-learning`,
			userState,
			dispatch,
		}).then((res) => {
			tmpServices = {
				...tmpServices,
				continual_learning: res.status,
			};
		});
		await requestFactory({
			type: 'GET',
			url: `/tasks/${currentTaskState.uuid}/services/testing`,
			userState,
			dispatch,
		}).then((res) => {
			tmpServices = {
				...tmpServices,
				testing: res.status,
			};
		});

		setServicesStatus(tmpServices);
	};

	useEffect(() => {
		if (currentTaskState.uuid) getServicesStatus();
	}, [currentTaskSettingsState]);

	const handleCopyTaskId = (uuid) => {
		navigator.clipboard.writeText(uuid);
		dispatch(ADD_ALERT({ type: 'success', message: 'Task UUID copied' }));
		setTimeout(() => {
			dispatch(REMOVE_ALERT('Task UUID copied'));
		}, 2000);
	};

	return (
		<HasAccess
			roles={defaultRoles}
			permissions="task.read"
			renderAuthFailed={<AccessDenied />}
		>
			<Grid container spacing={3}>
				<Grid
					item
					xs={12}
					md={4}
					xl={4}
					sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
				>
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							display: 'flex',
							padding: 1,
						}}
						type="noIcon"
						title="Status"
					>
						{!taskInfoLoaderState ? (
							<Box sx={styles().descriptionContent}>
								{currentTaskState?.status && (
									<>
										{Object.keys(currentTaskState)?.length > 0 &&
											currentTaskState.status &&
											currentTaskState.status.status_code && (
												<StatusBar
													type="task"
													code={currentTaskState.status.status_code}
													name={currentTaskState.status.display_name}
													description={currentTaskState.status.description}
												/>
											)}
										<h3 style={{ marginBottom: '0px' }}>Name:</h3>
										{currentTaskState.name || ''}
										<h3 style={{ marginBottom: '0px' }}>Description:</h3>
										{currentTaskState.description || ''}
										<h3 style={{ marginBottom: '0px' }}>Last modification:</h3>
										{currentTaskState.modified_at &&
											getIntervalDate(
												getLocalDateTime(
													currentTaskState.modified_at,
													userLocationState
												)
											)}
										<h3 style={{ marginBottom: '0px' }}>Task ID:</h3>
										<div style={{ display: 'flex', alignItems: 'center' }}>
											{Object.keys(currentTaskState).length > 0 && (
												<>
													{` ${currentTaskState.uuid}`}
													<IconButton
														sx={{ '& > *': { fontSize: '18px' } }}
														edge="end"
														aria-label="copy api key"
														onClick={() =>
															handleCopyTaskId(currentTaskState.uuid)
														}
													>
														<ContentCopyOutlinedIcon />
													</IconButton>
												</>
											)}
										</div>
									</>
								)}
							</Box>
						) : (
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<Skeleton
									variant="text"
									style={{
										height: '48px',
										width: '100%',
									}}
								/>
								<div
									style={{
										display: 'flex',
										gap: 12,
										alignItems: 'center',
									}}
								>
									<h3>Name:</h3>
									<Skeleton
										variant="text"
										style={{
											height: '18px',
											width: '50%',
										}}
									/>
								</div>
								<h3>Description:</h3>
								<Skeleton
									variant="text"
									style={{
										height: '18px',
										width: '100%',
									}}
								/>
								<Skeleton
									variant="text"
									style={{
										height: '18px',
										width: '100%',
									}}
								/>
								<h3>Last modification:</h3>
								<Skeleton
									variant="text"
									style={{
										height: '18px',
										width: '100%',
									}}
								/>
								<Skeleton
									variant="text"
									style={{
										height: '18px',
										width: '100%',
									}}
								/>
								<h3>Task ID:</h3>
								<Skeleton
									variant="text"
									style={{
										height: '18px',
										width: '100%',
									}}
								/>
							</div>
						)}
					</CardItem>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}
					xl={4}
					sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
				>
					{/* Examples */}
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							display: 'flex',
						}}
						type="noIcon"
						title="Services status"
					>
						{!taskServiceLoaderState &&
						currentTaskSettingsState.active_learning &&
						currentTaskSettingsState.continual_learning &&
						currentTaskSettingsState.inference &&
						currentTaskSettingsState.monitoring ? (
							<div
								style={{
									display: 'flex',
									alignItems: 'flex-start',
									flexDirection: 'column',
									gap: '12px',
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
									}}
								>
									<h4 style={{ margin: 0, padding: 0 }}>Inference:</h4>
									{servicesStatus.inference !== 0 ? (
										currentTaskSettingsState.inference.enabled ? (
											Object.keys(servicesStatus.inference)?.length > 0 &&
											servicesStatus.inference && (
												<div style={{ padding: '6px' }}>
													<StatusBar
														type="service"
														code={servicesStatus.inference.status_code}
														name={servicesStatus.inference.display_name}
														description={servicesStatus.inference.description}
													/>
												</div>
											)
										) : (
											<div style={{ padding: '6px' }}>
												<StatusBar type="service" code="service_disabled" />
											</div>
										)
									) : (
										<div style={{ padding: '3px' }}>
											<Skeleton
												variant="text"
												style={{
													height: '36px',
													width: '100%',
												}}
											/>
										</div>
									)}
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
									}}
								>
									<h4 style={{ margin: 0, padding: 0 }}>
										Continual Learning (CL):
									</h4>
									{servicesStatus.continual_learning !== 0 ? (
										currentTaskSettingsState.continual_learning.enabled ? (
											Object.keys(servicesStatus.continual_learning)?.length >
												0 &&
											servicesStatus.continual_learning && (
												<div style={{ padding: '6px' }}>
													<StatusBar
														type="service"
														code={servicesStatus.continual_learning.status_code}
														name={
															servicesStatus.continual_learning.display_name
														}
														description={
															servicesStatus.continual_learning.description
														}
													/>
												</div>
											)
										) : (
											<div style={{ padding: '6px' }}>
												<StatusBar type="service" code="service_disabled" />
											</div>
										)
									) : (
										<div style={{ padding: '6px' }}>
											<Skeleton
												variant="text"
												style={{
													height: '36px',
													width: '100%',
												}}
											/>
										</div>
									)}
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
									}}
								>
									<h4 style={{ margin: 0, padding: 0 }}>
										Active Learning (AL):
									</h4>
									{servicesStatus.active_learning !== 0 ? (
										currentTaskSettingsState.active_learning.enabled ? (
											Object.keys(servicesStatus.active_learning)?.length >
												0 && (
												<div style={{ padding: '6px' }}>
													<StatusBar
														type="service"
														code={servicesStatus.active_learning.status_code}
														name={servicesStatus.active_learning.display_name}
														description={
															servicesStatus.active_learning.description
														}
													/>
												</div>
											)
										) : (
											<div style={{ padding: '6px' }}>
												<StatusBar type="service" code="service_disabled" />
											</div>
										)
									) : (
										<div style={{ padding: '6px' }}>
											<Skeleton
												variant="text"
												style={{
													height: '36px',
													width: '100%',
												}}
											/>
										</div>
									)}
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
									}}
								>
									<h4 style={{ margin: 0, padding: 0 }}>Monitoring:</h4>
									{servicesStatus.monitoring !== 0 ? (
										currentTaskSettingsState.monitoring.enabled ? (
											Object.keys(servicesStatus.monitoring)?.length > 0 &&
											servicesStatus.monitoring && (
												<div style={{ padding: '6px' }}>
													<StatusBar
														type="service"
														code={servicesStatus.monitoring.status_code}
														name={servicesStatus.monitoring.display_name}
														description={servicesStatus.monitoring.description}
													/>
												</div>
											)
										) : (
											<div style={{ padding: '6px' }}>
												<StatusBar type="service" code="service_disabled" />
											</div>
										)
									) : (
										<div style={{ padding: '6px' }}>
											<Skeleton
												variant="text"
												style={{
													height: '36px',
													width: '100%',
												}}
											/>
										</div>
									)}
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
									}}
								>
									<h4 style={{ margin: 0, padding: 0 }}>Testing:</h4>
									{/* {servicesStatus.testing !== 0 ? (
										currentTaskSettingsState.testing?.enabled ? (
											Object.keys(servicesStatus.testing)?.length > 0 &&
											servicesStatus.testing && (
												<div style={{ padding: '6px' }}>
													<StatusBar
														type="service"
														code={servicesStatus.testing.status_code}
														name={servicesStatus.testing.display_name}
														description={servicesStatus.testing.description}
													/>
												</div>
											)
										) : (
											<div style={{ padding: '6px' }}>
												<StatusBar type="service" code="service_disabled" />
											</div>
										) */}
									{servicesStatus.testing !== 0 ? (
										// currentTaskSettingsState.testing?.enabled ? (
										Object.keys(servicesStatus.testing)?.length > 0 &&
										servicesStatus.testing && (
											<div style={{ padding: '6px' }}>
												<StatusBar
													type="service"
													code={servicesStatus.testing.status_code}
													name={servicesStatus.testing.display_name}
													description={servicesStatus.testing.description}
												/>
											</div>
										)
									) : (
										// ) : (
										//   <div style={{ padding: '6px' }}>
										//     <StatusBar type="service" code="service_disabled" />
										//   </div>
										// )
										<div style={{ padding: '6px' }}>
											<Skeleton
												variant="text"
												style={{
													height: '36px',
													width: '100%',
												}}
											/>
										</div>
									)}
								</div>
							</div>
						) : (
							<div
								style={{
									display: 'flex',
									alignItems: 'flex-start',
									flexDirection: 'column',
									gap: '12px',
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
									}}
								>
									<h4 style={{ margin: 0, padding: 0 }}>Inference:</h4>
									<div style={{ padding: '3px' }}>
										<Skeleton
											variant="text"
											style={{
												height: '36px',
												width: '100%',
											}}
										/>
									</div>
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
									}}
								>
									<h4 style={{ margin: 0, padding: 0 }}>
										Continual Learning (CL):
									</h4>
									<div style={{ padding: '6px' }}>
										<Skeleton
											variant="text"
											style={{
												height: '36px',
												width: '100%',
											}}
										/>
									</div>
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
									}}
								>
									<h4 style={{ margin: 0, padding: 0 }}>
										Active Learning (AL):
									</h4>
									<div style={{ padding: '6px' }}>
										<Skeleton
											variant="text"
											style={{
												height: '36px',
												width: '100%',
											}}
										/>
									</div>
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
									}}
								>
									<h4 style={{ margin: 0, padding: 0 }}>Monitoring:</h4>
									<div style={{ padding: '6px' }}>
										<Skeleton
											variant="text"
											style={{
												height: '36px',
												width: '100%',
											}}
										/>
									</div>
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
									}}
								>
									<h4 style={{ margin: 0, padding: 0 }}>Testing:</h4>
									<div style={{ padding: '6px' }}>
										<Skeleton
											variant="text"
											style={{
												height: '36px',
												width: '100%',
											}}
										/>
									</div>
								</div>
							</div>
						)}
					</CardItem>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}
					xl={4}
					sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
				>
					{/* Models */}
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							display: 'flex',
						}}
						type="noIcon"
						title="Production AI model"
					>
						{!taskProductionModelLoaderState ? (
							productionAIModelState &&
							Object.keys(productionAIModelState).length > 0 ? (
								<div
									style={{
										display: 'flex',
										alignItems: 'flex-start',
										flexDirection: 'column',
									}}
								>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											marginBottom: -12,
											gap: '6px',
										}}
									>
										<h3>Version: </h3>
										{productionAIModelState.docker_image?.tag || ''}
									</div>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											marginBottom: -12,
											gap: '6px',
										}}
									>
										<h3>ID: </h3>
										{productionAIModelState.id}
									</div>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '6px',
										}}
									>
										<h3>Creation date:</h3>
										{format(
											new Date(
												getLocalDateTime(
													productionAIModelState?.created_at,
													userLocationState
												)
											),
											'yyyy/MM/dd, HH:mm'
										)}
									</div>
									<div
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'center',
										}}
									>
										<StandardButton
											value="Show schema"
											handleClick={() => setOpenShowSchema(true)}
										/>
									</div>
								</div>
							) : (
								<div>No Production models found</div>
							)
						) : (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<div
									style={{
										display: 'flex',
										gap: 12,
										alignItems: 'center',
									}}
								>
									<h3>Version:</h3>
									<Skeleton
										variant="text"
										style={{
											height: '18px',
											width: '100%',
										}}
									/>
								</div>
								<div
									style={{
										display: 'flex',
										gap: 12,
										alignItems: 'center',
									}}
								>
									<h3>ID:</h3>
									<Skeleton
										variant="text"
										style={{
											height: '18px',
											width: '100%',
										}}
									/>
								</div>
								<div
									style={{
										display: 'flex',
										gap: 12,
										alignItems: 'center',
									}}
								>
									<h3>Creation date:</h3>
									<Skeleton
										variant="text"
										style={{
											height: '18px',
											width: '100%',
										}}
									/>
								</div>
								<div
									style={{
										width: '100%',
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<Skeleton
										variant="text"
										style={{
											height: '48px',
											width: '100%',
										}}
									/>
								</div>
							</div>
						)}
					</CardItem>

					{/* Examples */}
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							display: 'flex',
							'&:hover': {
								cursor: 'pointer',
								outline: `2px solid ${colors.buttonPrimaryColor}`,
							},
						}}
						type="noIcon"
						title="Total examples"
						onClick={() => setCurrentTab('examples')}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 12,
							}}
						>
							<StorageIcon sx={{ color: '#666666' }} />
							<Typography
								variant="span"
								sx={{
									fontSize: 22,
									color: '#666666',
								}}
							>
								{typeof totalExamplesState === 'number' ? (
									totalExamplesState
								) : (
									<Skeleton
										variant="text"
										style={{
											height: '48px',
											width: '150px',
										}}
									/>
								)}
							</Typography>
						</div>
					</CardItem>
				</Grid>
			</Grid>
			{openShowSchema && (
				<StandardModal
					open={openShowSchema}
					setOpen={handleCloseShowModal}
					title="Production AI Model schema"
					content={
						<Box sx={{ height: '584px' }}>
							{/* <FixedFlow tmpSchema={productionAIModelState.task_schema} /> */}
							{
								// TODO: When has a task with production model, check how is structured the schema response of the model to show the elements like task/schema view
							}
						</Box>
					}
					actions={
						<StandardButton
							close
							value="Close"
							handleClick={handleCloseShowModal}
						/>
					}
				/>
			)}
		</HasAccess>
	);
};

TaskStatus.propTypes = {
	setCurrentTab: PropTypes.func,
};
