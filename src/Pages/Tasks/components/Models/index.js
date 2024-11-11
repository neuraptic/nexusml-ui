import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';

// Manage roles & permissions
import { HasAccess, usePermify } from '@permify/react-role';

// Components
import { Container, Box, Grid, Typography, Skeleton } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import CardItem from '../../../../Components/Shared/CardItem';
import AccessDenied from '../../../../Components/Core/AccessDenied';
import { ConfirmationDialog } from '../../../../Components/Shared/ConfirmationDialog';
import StandardModal from '../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';

// Redux
import {
	GET_MODELS,
	GET_PRODUCTION_MODEL,
	GET_TESTING_MODEL,
	SET_PRODUCTION_MODEL,
	SET_TESTING_MODEL,
} from '../../../../redux/aimodels.slice';

// Styles
import styles from './styles';

// Consts
import { defaultRoles } from '../../../../consts/rolesAndPermissions';
import { colors } from '../../../../consts/colors';
import { measures } from '../../../../consts/sizes';

// Services
import checkIsAuthorized from '../../../../services/checkIsAuthorized';
import { getLocalDateTime } from '../../../../services/date';

export const TaskModels = () => {
	const dispatch = useDispatch();
	const { isAuthorized } = usePermify();

	// Global states
	const { aimodels: aimodelsLoaderState } = useSelector(
		(state) => state.loaders.task
	);
	const aimodels = useSelector((state) => state.aimodels);
	const userState = useSelector((state) => state.user);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);

	// Local states
	const [currentSchema, setCurrentSchema] = useState(false);
	const [canUpdate, setCanUpdate] = useState(false);
	const [selectedModel, setSelectedModel] = useState();
	const [openShowSchema, setOpenShowSchema] = useState(false);
	const [openConfirmProduction, setOpenConfirmProduction] = useState(false);
	const [openConfirmTesting, setOpenConfirmTesting] = useState(false);

	useEffect(() => {
		checkIsAuthorized({
			isAuthorized,
			setCanUpdate,
			permission: 'task.update',
		});
	}, []);

	const handleSetProductionModel = async () => {
		if (selectedModel.uuid !== aimodels.productionAIModel.uuid) {
			await dispatch(
				SET_PRODUCTION_MODEL({
					taskId: currentTaskState.uuid,
					userState,
					dispatch,
					modelId: selectedModel.uuid,
				})
			);

			await dispatch(
				GET_MODELS({ userState, dispatch, taskId: currentTaskState.uuid })
			);
			await dispatch(
				GET_TESTING_MODEL({
					taskId: currentTaskState.uuid,
					userState,
					dispatch,
				})
			);
			await dispatch(
				GET_PRODUCTION_MODEL({
					taskId: currentTaskState.uuid,
					userState,
					dispatch,
				})
			);
		}
	};
	const handleSetTestingModel = async () => {
		await dispatch(
			SET_TESTING_MODEL({
				taskId: currentTaskState.uuid,
				userState,
				dispatch,
				modelId: selectedModel.uuid,
			})
		);

		await dispatch(
			GET_MODELS({ userState, dispatch, taskId: currentTaskState.uuid })
		);
		await dispatch(
			GET_TESTING_MODEL({
				taskId: currentTaskState.uuid,
				userState,
				dispatch,
			})
		);
		await dispatch(
			GET_PRODUCTION_MODEL({
				taskId: currentTaskState.uuid,
				userState,
				dispatch,
			})
		);
	};

	const handleCloseShowModal = () => {
		setOpenConfirmProduction(false);
		setOpenConfirmTesting(false);
		setCurrentSchema({});
		setOpenShowSchema(false);
	};

	return (
		<HasAccess
			roles={defaultRoles}
			permissions="task.read"
			renderAuthFailed={<AccessDenied />}
		>
			<Box
				sx={{
					backgroundColor: 'Background.default',
					minHeight: '100%',
					pt: 3,
				}}
			>
				<Container maxWidth={false} style={{ padding: '0px' }}>
					<Grid container spacing={3}>
						<Grid
							item
							xs={12}
							sx={{
								paddingLeft: '0px',
								paddingRight: '0px',
							}}
						>
							<Box
								sx={{
									paddingLeft: '0px',
									paddingRight: '0px',
								}}
							>
								{/* Models */}
								<CardItem
									elevation={measures.cardItemElevation}
									sx={{
										display: 'flex',
										padding: 0,
									}}
									title="AI models"
									type="noIcon"
								>
									<Box
										pl={2}
										pb={4}
										pr={2}
										sx={{
											display: 'flex',
											gap: 3,
											flexDirection: 'column',
											paddingLeft: '0px !important',
											paddingRight: '0px !important',
										}}
									>
										{!aimodelsLoaderState ? (
											aimodels &&
											aimodels.AIModelss &&
											aimodels.AIModelss.map((model) => (
												<Box
													key={uuidv4()}
													sx={{
														...styles().modelItemContainer,
														padding: '12px',
														outline:
															aimodels.productionAIModels?.uuid ===
																model.uuid &&
															`2px solid ${colors.buttonPrimaryColor}`,
														borderRadius: '12px',
													}}
												>
													<Box sx={styles().modelLeftContainer}>
														<Box
															sx={{
																display: 'flex',
																flexDirection: 'column',
															}}
														>
															<Typography
																variant="span"
																sx={{ color: '#666666', fontSize: 13 }}
															>
																Id: {model.uuid}
															</Typography>

															<Box display="flex" alignItems="center">
																<Typography
																	variant="span"
																	sx={{ color: '#666666', fontSize: 13 }}
																>
																	Version: {model.version || ''}
																</Typography>
															</Box>

															<Box display="flex" alignItems="center">
																Creation date:
																<Typography
																	variant="span"
																	sx={{ color: '#666666', fontSize: 13 }}
																>
																	{format(
																		new Date(
																			getLocalDateTime(model.created_at)
																		),
																		'yyyy/MM/dd, HH:mm'
																	)}
																</Typography>
															</Box>

															<Box
																sx={{
																	marginTop: '24px',
																	display: 'flex',
																	alignItems: 'center',
																	gap: 2,
																}}
															>
																<StandardButton
																	value="Show schema"
																	handleClick={() => {
																		setOpenShowSchema(true);
																		setCurrentSchema(model.task_schema);
																	}}
																/>
																<StandardButton
																	value="Deploy in production"
																	type={
																		(model.uuid ===
																			aimodels.productionAIModel?.uuid &&
																			'disabled') ||
																		''
																	}
																	handleClick={() => {
																		if (canUpdate) {
																			if (
																				aimodels.productionAIModel?.uuid !==
																				model.uuid
																			) {
																				setOpenConfirmProduction(true);
																				setSelectedModel(model);
																			}
																		}
																	}}
																/>
																<StandardButton
																	value="Deploy in testing"
																	type={
																		(model.uuid ===
																			aimodels.testingAIModel?.uuid &&
																			'disabled') ||
																		''
																	}
																	handleClick={() => {
																		if (canUpdate) {
																			if (
																				aimodels.testingAIModel?.uuid !==
																				model.uuid
																			) {
																				setOpenConfirmTesting(true);
																				setSelectedModel(model);
																			}
																		}
																	}}
																/>
															</Box>
														</Box>
														<Box sx={styles().modelActiveContainer}>
															{aimodels.productionAIModel?.uuid &&
																model.uuid ===
																	aimodels.productionAIModel.uuid && (
																	<Box
																		sx={{
																			display: 'flex',
																			alignItems: 'center',
																			gap: '5px',
																		}}
																	>
																		<CircleIcon
																			sx={{
																				color: colors.modelActive,
																				fontSize: 10,
																			}}
																		/>
																		<Typography
																			variant="subtitle1"
																			sx={{ fontSize: 12 }}
																		>
																			Production
																		</Typography>
																	</Box>
																)}
															{aimodels.testingAIModel?.uuid &&
																model.uuid === aimodels.testingAIModel.uuid && (
																	<Box
																		sx={{
																			...styles().modelActiveContainer,
																			display: 'flex',
																			flexDirection: 'row',
																			alignItems: 'center',
																		}}
																	>
																		<CircleIcon
																			sx={{
																				color: colors.buttonPrimaryColor,
																				fontSize: 10,
																			}}
																		/>
																		<Typography
																			variant="subtitle1"
																			sx={{ fontSize: 12 }}
																		>
																			Testing
																		</Typography>
																	</Box>
																)}

															{model.uuid !==
																aimodels.productionAIModel?.uuid &&
																model.uuid !==
																	aimodels.testingAIModel?.uuid && (
																	<Box
																		sx={{
																			...styles().modelActiveContainer,
																			display: 'flex',
																			flexDirection: 'row',
																			alignItems: 'center',
																		}}
																	>
																		<CircleIcon
																			sx={{
																				color: colors.errorAlertDark,
																				fontSize: 10,
																			}}
																		/>
																		<Typography
																			variant="subtitle1"
																			sx={{ fontSize: 12 }}
																		>
																			Inactive
																		</Typography>
																	</Box>
																)}
														</Box>
													</Box>
												</Box>
											)).reverse()
										) : (
											<Box
												key={uuidv4()}
												sx={{
													...styles().modelItemContainer,
													padding: '12px',
													outline: '2px solid #eee',
													borderRadius: '12px',
												}}
											>
												<Box sx={styles().modelLeftContainer}>
													<Box
														sx={{
															display: 'flex',
															flexDirection: 'column',
														}}
													>
														<div style={{ display: 'flex', gap: 12 }}>
															Id:
															<Skeleton
																variant="text"
																style={{
																	height: '18px',
																	width: '150px',
																}}
															/>
														</div>

														<div style={{ display: 'flex', gap: 12 }}>
															Version:
															<Skeleton
																variant="text"
																style={{
																	height: '18px',
																	width: '150px',
																}}
															/>
														</div>

														<div style={{ display: 'flex', gap: 12 }}>
															Creation date:
															<Skeleton
																variant="text"
																style={{
																	height: '18px',
																	width: '150px',
																}}
															/>
														</div>

														<Box display="flex" alignItems="center">
															<Skeleton
																variant="text"
																style={{
																	height: '48px',
																	width: '150px',
																}}
															/>
														</Box>
													</Box>
													<div style={styles().modelActiveContainer}>
														<CircleIcon
															sx={{
																color: '#eee',
																fontSize: 10,
															}}
														/>
														<Skeleton
															variant="text"
															style={{
																height: '18px',
																width: '150px',
															}}
														/>
													</div>
												</Box>
											</Box>
										)}
									</Box>
								</CardItem>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>
			{openShowSchema && (
				<StandardModal
					open={openShowSchema}
					setOpen={handleCloseShowModal}
					title="Production AI Model schema"
					content={
						<Box sx={{ height: '584px' }}>
							{/* <FixedFlow tmpSchema={currentSchema} /> */}
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
			{openConfirmProduction && (
				<ConfirmationDialog
					title="Set this AI Model to production?"
					open={openConfirmProduction}
					setOpen={setOpenConfirmProduction}
					onConfirm={handleSetProductionModel}
					openShowSchema={openShowSchema}
				/>
			)}
			{openConfirmTesting && (
				<ConfirmationDialog
					title="Set this AI Model to testing?"
					open={openConfirmTesting}
					setOpen={setOpenConfirmTesting}
					onConfirm={handleSetTestingModel}
					openShowSchema={openShowSchema}
				/>
			)}
		</HasAccess>
	);
};
