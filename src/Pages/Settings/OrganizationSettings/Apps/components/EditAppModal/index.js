import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { formatInTimeZone } from 'date-fns-tz';
import { addDays } from 'date-fns';

// Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
	Checkbox,
	FormControlLabel,
	IconButton,
	Input,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckIcon from '@mui/icons-material/Check';
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';
import PageRow from '../../../../../../Components/Shared/PageRow';
import Section from '../../../../../../Components/Shared/Section';

// Modals
import { DeleteAppModal } from './Components';

// Alerts
import { ADD_ALERT, REMOVE_ALERT } from '../../../../../../redux/alerts.slice';
import { ORGANIZATION_APP_UPDATED } from '../../../../../../AlertsList/organizationSettingsAlerts';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Consts
import { colors } from '../../../../../../consts/colors';

// Redux
import {
	UPDATE_ORGANIZATION_APP,
	GET_ORGANIZATION_APPS,
} from '../../../../../../redux/organization.slice';
import { LOAD_ORGANIZATION_APPS } from '../../../../../../redux/loaders.slice';

// Services
import { getLocalDateTime } from '../../../../../../services/date';

const expirationDatesOptions = [
	'Custom',
	'7 days',
	'30 days',
	'60 days',
	'90 days',
];

export const EditAppModal = (props) => {
	const { open, setOpen, appId, handleSelectAppId } = props;

	const dispatch = useDispatch();

	// Global states
	const organizationAppsState = useSelector((state) => state.organization.apps);
	const { id: organizationId } = useSelector(
		(state) => state.organization.info
	);
	const { location: userLocationState } = useSelector((state) => state.user);
	const userState = useSelector((state) => state.user);

	// Local states
	const [app, setApp] = useState({
		id: null,
		name: '',
		description: '',
		apiKey: '',
		scopes: [],
		expireAt: '',
		expires: false,
		expiresOption: 'Custom',
	});
	const [apiKeyVisible, setApiKeyVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Modals
	const [openDeleteAppModal, setOpenDeleteAppModal] = useState(false);

	useEffect(() => {
		setApiKeyVisible(false);
	}, [open]);

	useEffect(() => {
		if (appId) {
			const tmpApp = organizationAppsState.find((app) => app.id === appId);
			setApp({
				...app,
				id: tmpApp.id,
				name: tmpApp.name,
				description: tmpApp.description,
				apiKey: tmpApp.apiKey,
				scopes: tmpApp.scopes,
				expireAt: tmpApp.expireAt,
				expires: tmpApp.expireAt === null,
			});
		}
	}, [appId]);

	useEffect(() => {
		if (app.expiresOption !== 'Custom') {
			const days = app.expiresOption.split(' ');
			setApp({
				...app,
				expireAt: formatInTimeZone(
					new Date(addDays(new Date(), days[0])),
					'UTC',
					"yyyy-MM-dd'T'HH:mm:ss"
				),
			});
		}
	}, [app.expiresOption]);

	const handleShowApiKey = () => {
		setApiKeyVisible(!apiKeyVisible);
	};

	const handleChange = (e) => {
		if (e.target) {
			const { name, value, checked } = e.target;
			if (name === 'expires') setApp({ ...app, [name]: checked });
			else setApp({ ...app, [name]: value });
		} else {
			setApp({
				...app,
				expireAt: e,
			});
		}
	};

	const handleChangeAppScope = (scope) => {
		if (app.scopes.includes(scope)) {
			const tmpScopes = app.scopes.filter((tmpScope) => tmpScope !== scope);
			setApp({
				...app,
				scopes: tmpScopes,
			});
		} else {
			setApp({
				...app,
				scopes: [...app.scopes, scope],
			});
		}
	};

	const handleCopyApiKey = (appId) => {
		const tmpApp = organizationAppsState.find((app) => app.id === appId);
		navigator.clipboard.writeText(tmpApp.apiKey);
	};

	const handleClose = async () => {
		setIsLoading(false);
		dispatch(LOAD_ORGANIZATION_APPS(true));
		setApp({
			id: null,
			name: '',
			description: '',
			apiKey: '',
			scopes: [],
			expireAt: '',
			expire: false,
			expiresOption: 'Custom',
		});
		setApiKeyVisible(false);
		handleSelectAppId(null);
		await dispatch(
			GET_ORGANIZATION_APPS({ organizationId, userState, dispatch })
		);
		setOpen(!open);
		dispatch(LOAD_ORGANIZATION_APPS(false));
	};

	const handleSave = async () => {
		setIsLoading(true);
		const { name, description, icon, scopes, expires, expireAt } = app;
		await dispatch(
			UPDATE_ORGANIZATION_APP({
				organizationId,
				appInfo: {
					client: { name, description, icon },
					apiKey: {
						scopes,
						expire_at: expires
							? null
							: formatInTimeZone(
									new Date(expireAt),
									'UTC',
									"yyyy-MM-dd'T'HH:mm:ss"
							  ),
					},
				},
				userState,
				appId,
			})
		);

		dispatch(ADD_ALERT({ type: 'success', message: ORGANIZATION_APP_UPDATED }));
		setTimeout(() => {
			dispatch(REMOVE_ALERT(ORGANIZATION_APP_UPDATED));
		}, 2000);
		handleClose();
	};

	const handleOpenDeleteUserModal = () => {
		setOpenDeleteAppModal(!openDeleteAppModal);
	};

	return (
		appId !== '' && (
			<>
				<StandardModal
					open={open}
					setOpen={setOpen}
					title="Manage app:"
					content={
						<Box sx={styles().modalContainer}>
							<Box sx={styles().dialogContentContainer}>
								<Box sx={styles().dialogContent}>
									<Typography
										sx={{
											...styles().dialogContentText,
											fontSize: 'small',
										}}
									>
										Name
									</Typography>
									<FormControl>
										<Input
											className={cssStyles.common_input_type}
											id="name"
											name="name"
											value={app && app.name}
											onChange={(e) => handleChange(e)}
										/>
									</FormControl>
								</Box>
								<Box sx={styles().dialogContent}>
									<Typography
										sx={{
											...styles().dialogContentText,
											fontSize: 'small',
										}}
									>
										Description
									</Typography>
									<FormControl>
										<Input
											className={cssStyles.common_input_type}
											id="description"
											name="description"
											value={app && app.description}
											onChange={(e) => handleChange(e)}
										/>
									</FormControl>
								</Box>
								<Box sx={styles().dialogContent}>
									<Typography
										sx={{
											...styles().dialogContentText,
											fontSize: 'small',
										}}
									>
										Expiration date
									</Typography>
									<FormControl>
										<div
											style={{
												display: 'flex',
												'&>*': { width: '100% !important' },
											}}
										>
											<FormControlLabel
												control={<Checkbox />}
												label={
													<Typography
														sx={{
															...styles().dialogContentText,
															fontSize: 'small',
														}}
													>
														Never expires
													</Typography>
												}
												name="expires"
												checked={app.expires}
												onChange={(e) => handleChange(e)}
											/>
											<div style={{ display: 'flex', flexDirection: 'column' }}>
												<Select
													id="expiresOption"
													name="expiresOption"
													className={`${Date} ${cssStyles.common_input_type}`}
													sx={{
														...styles().dialogContentText,
														fontSize: 'small',
													}}
													disabled={app.expires}
													value={app.expiresOption}
													onChange={(e) => handleChange(e)}
												>
													{Object.entries(expirationDatesOptions).map(
														([elementTypeName, elementTypeDisplayName]) => (
															<MenuItem
																key={elementTypeName}
																value={elementTypeDisplayName}
															>
																{elementTypeDisplayName}
															</MenuItem>
														)
													)}
												</Select>
												<LocalizationProvider dateAdapter={AdapterDayjs}>
													<DateTimePicker
														className={`${Date} ${cssStyles.common_input_type}`}
														name="expiredAt"
														disabled={
															app.expires || app.expiresOption !== 'Custom'
														}
														value={
															app &&
															app.expireAt &&
															new Date(
																getLocalDateTime(
																	new Date(app.expireAt),
																	userLocationState
																)
															)
														}
														onChange={(newValue) => handleChange(newValue)}
														renderInput={(params) => (
															<TextField {...params} helperText={null} />
														)}
														inputFormat="YYYY/MM/DD hh:mm A"
													/>
												</LocalizationProvider>
											</div>
										</div>
									</FormControl>
								</Box>
								<Box sx={styles().dialogContent}>
									<Typography
										sx={{
											...styles().dialogContentText,
											fontSize: 'small',
										}}
									>
										API Key
									</Typography>
									<div style={styles().apiKeyContainer}>
										<FormControl>
											<Input
												className={cssStyles.common_input_type}
												sx={styles().apiKeyInput}
												type={apiKeyVisible ? 'text' : 'password'}
												id="apiKey"
												name="apiKey"
												value={app && app.apiKey}
												onChange={(e) => handleChange(e)}
											/>
										</FormControl>
										<div style={styles().apiKeyButtons}>
											{apiKeyVisible ? (
												<IconButton
													edge="end"
													aria-label="view api key"
													onClick={handleShowApiKey}
												>
													<VisibilityIcon />
												</IconButton>
											) : (
												<IconButton
													edge="end"
													aria-label="view api key"
													onClick={handleShowApiKey}
												>
													<VisibilityOutlinedIcon />
												</IconButton>
											)}
											<IconButton
												edge="end"
												aria-label="copy api key"
												onClick={() => handleCopyApiKey(app.id)}
											>
												<ContentCopyOutlinedIcon />
											</IconButton>
										</div>
									</div>
								</Box>
							</Box>

							<div style={styles().scopesContainer}>
								<h3>Scopes</h3>
								<TableContainer>
									<Table sx={{ minWidth: '100%' }} aria-label="simple table">
										<TableHead>
											<TableRow sx={styles().scopeTableHeader}>
												<TableCell sx={styles().scopeTableHeadCell} />
												<TableCell
													sx={styles().scopeTableHeadCell}
													align="center"
												>
													Create
												</TableCell>
												<TableCell
													sx={styles().scopeTableHeadCell}
													align="center"
												>
													Read
												</TableCell>
												<TableCell
													sx={styles().scopeTableHeadCell}
													align="center"
												>
													Update
												</TableCell>
												<TableCell
													sx={styles().scopeTableHeadCell}
													align="center"
												>
													Delete
												</TableCell>
											</TableRow>
										</TableHead>

										{app && app.scopes && app.scopes.length > 0 && (
											<TableBody sx={styles().scopeTableBody}>
												<TableRow key={uuidv4()}>
													<TableCell
														component="th"
														scope="row"
														sx={styles().scopeTitle}
													>
														Organization
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('organizations.create')
														}
													>
														{app.scopes.includes('organizations.create') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('organizations.read')
														}
													>
														{app.scopes.includes('organizations.read') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('organizations.update')
														}
													>
														{app.scopes.includes('organizations.update') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('organizations.delete')
														}
													>
														{app.scopes.includes('organizations.delete') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
												</TableRow>
												<TableRow key={uuidv4()}>
													<TableCell
														component="th"
														scope="row"
														sx={styles().scopeTitle}
													>
														Tasks
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() => handleChangeAppScope('tasks.create')}
													>
														{app.scopes.includes('tasks.create') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() => handleChangeAppScope('tasks.read')}
													>
														{app.scopes.includes('tasks.read') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() => handleChangeAppScope('tasks.update')}
													>
														{app.scopes.includes('tasks.update') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() => handleChangeAppScope('tasks.delete')}
													>
														{app.scopes.includes('tasks.delete') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
												</TableRow>
												<TableRow key={uuidv4()}>
													<TableCell
														component="th"
														scope="row"
														sx={styles().scopeTitle}
													>
														Examples
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('examples.create')
														}
													>
														{app.scopes.includes('examples.create') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('examples.read')
														}
													>
														{app.scopes.includes('examples.read') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('examples.update')
														}
													>
														{app.scopes.includes('examples.update') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('examples.delete')
														}
													>
														{app.scopes.includes('examples.delete') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
												</TableRow>
												<TableRow key={uuidv4()}>
													<TableCell
														component="th"
														scope="row"
														sx={styles().scopeTitle}
													>
														Models
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('models.create')
														}
													>
														{app.scopes.includes('models.create') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() => handleChangeAppScope('models.read')}
													>
														{app.scopes.includes('models.read') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('models.update')
														}
													>
														{app.scopes.includes('models.update') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() =>
															handleChangeAppScope('models.delete')
														}
													>
														{app.scopes.includes('models.delete') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
												</TableRow>
												<TableRow key={uuidv4()}>
													<TableCell
														component="th"
														scope="row"
														sx={styles().scopeTitle}
													>
														Files
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() => handleChangeAppScope('files.create')}
													>
														{app.scopes.includes('files.create') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() => handleChangeAppScope('files.read')}
													>
														{app.scopes.includes('files.read') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() => handleChangeAppScope('files.update')}
													>
														{app.scopes.includes('files.update') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
													<TableCell
														align="center"
														sx={styles().scopeCrudElement}
														onClick={() => handleChangeAppScope('files.delete')}
													>
														{app.scopes.includes('files.delete') && (
															<CheckIcon sx={{ color: colors.blue }} />
														)}
													</TableCell>
												</TableRow>
											</TableBody>
										)}
									</Table>
								</TableContainer>
							</div>

							{
								// Delete app
							}
							<PageRow
								type="danger"
								column1={
									<Section title="Delete this app">
										<span style={{ fontSize: 'small', color: colors.darkGray }}>
											Once deleted, it will be gone forever. Please be certain.
										</span>
									</Section>
								}
								column2={
									<Section style={{ fontWeight: 'bold' }}>
										<StandardButton
											handleClick={handleOpenDeleteUserModal}
											type="danger"
											value="Delete this app"
										/>
									</Section>
								}
							/>
						</Box>
					}
					actions={
						<>
							<StandardButton
								value="Save changes"
								handleClick={handleSave}
								loading={isLoading}
								type="submit"
								close
							/>
							<StandardButton value="Close" handleClick={handleClose} close />
						</>
					}
				/>
				{openDeleteAppModal && (
					<DeleteAppModal
						open={openDeleteAppModal}
						setOpen={setOpenDeleteAppModal}
						appId={appId}
						handleCloseParent={handleClose}
					/>
				)}
			</>
		)
	);
};

EditAppModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	appId: PropTypes.string,
	handleSelectAppId: PropTypes.func,
};
