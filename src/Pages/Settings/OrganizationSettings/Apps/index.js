/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { differenceInDays, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Manage roles and permissions
import { HasAccess } from '@permify/react-role';

// Components
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import {
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Table,
	TableBody,
	IconButton,
	Avatar,
	Skeleton,
} from '@mui/material';
import CardItem from '../../../../Components/Shared/CardItem';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import AccessDenied from '../../../../Components/Core/AccessDenied';
import { CustomPagination } from '../../../../Components/Shared/CustomPagination';

// Modals
import { AddAppModal } from './components/AddAppModal';
import { EditAppModal } from './components/EditAppModal';

// Syles
import styles from './styles';
import cssStyles from './styles.module.css';

// Consts
import { colors } from '../../../../consts/colors';
import { measures } from '../../../../consts/sizes';
import { defaultRoles } from '../../../../consts/rolesAndPermissions';

const Apps = () => {
	// Global states
	const { apps: organizationAppsState } = useSelector(
		(state) => state.organization
	);
	const { organizationSettings: organizationSettingsLoaderManager } =
		useSelector((state) => state.loaders);

	// Local states
	const [selectedAppId, setSelectedAppId] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const [openCreateAppModal, setOpenCreateAppModal] = useState(false);
	const [openEditAppModal, setOpenEditAppModal] = useState(false);

	const handleCopyApiKey = (appId) => {
		const tmpApp = organizationAppsState.find((app) => app.id === appId);
		navigator.clipboard.writeText(tmpApp.apiKey);
	};

	const handleOpenCreateAppModal = () => {
		setOpenCreateAppModal(!openCreateAppModal);
	};

	const handleOpenEditAppModal = (appId) => {
		setSelectedAppId(appId);
		setOpenEditAppModal(!openEditAppModal);
	};

	const handleChangePage = (e, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(event.target.value);
		setPage(0);
	};

	return (
		<HasAccess
			roles={defaultRoles}
			permissions="organization.read"
			renderAuthFailed={<AccessDenied />}
		>
			<CardItem
				type="noIcon"
				titlelink={
					<HasAccess
						roles={defaultRoles}
						permissions="organization.create"
						renderAuthFailed={
							<StandardButton type="disabled" value="Create App" />
						}
					>
						<StandardButton
							value="Create App"
							handleClick={handleOpenCreateAppModal}
						/>
					</HasAccess>
				}
				title={
					<p style={styles().totalRoles}>{`Apps: ${
						(organizationAppsState && organizationAppsState.length) || '0'
					}`}</p>
				}
				elevation={measures.cardItemElevation}
				sx={{
					display: 'flex',
					padding: 1,
					marginBottom: 3,
				}}
			>
				<TableContainer
					sx={{
						marginTop: '12px',
					}}
				>
					<Table
						className={cssStyles.table_main}
						sx={{ minWidth: 650 }}
						size="small"
						aria-label="organization roles table"
					>
						<TableHead>
							<TableRow
								sx={{ borderBottom: `2px solid ${colors.lightBorderColor}` }}
							>
								<TableCell sx={styles().tableTitle}>APP logo</TableCell>
								<TableCell sx={styles().tableTitle}>Name</TableCell>
								<TableCell sx={styles().tableTitle}>Description</TableCell>
								<TableCell sx={styles().tableTitle}>Expire at</TableCell>
								<TableCell sx={styles().tableTitle} align="center" width={100}>
									Copy key
								</TableCell>
								<TableCell sx={styles().tableTitle} align="center" width={100}>
									Manage
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{!organizationSettingsLoaderManager.apps && organizationAppsState
								? organizationAppsState
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((app) => (
											<TableRow
												key={app.id}
												sx={{
													'&:lastChild td, &:lastChild th': {
														border: `0 !important`,
													},
												}}
											>
												<TableCell sx={styles().tableContent}>
													<Avatar
														alt="APP logo"
														src={
															app.icon !== null
																? app.icon['download_url']
																: null
														}
													>
														{app.name[0]}
													</Avatar>
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{app.name}
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{app.description}
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{app.expireAt === null
														? 'Never expires'
														: differenceInDays(
																new Date(),
																new Date(app.expireAt)
														  ) > 0
														? '¡Expired!'
														: `${format(
																new Date(app.expireAt),
																'dd/MM/yy, HH:mm'
														  )} - (${differenceInDays(
																new Date(app.expireAt),
																new Date()
														  )} days left)`}
												</TableCell>
												<TableCell sx={styles().tableContent} align="center">
													<div style={styles().apiKeyButtonsContainer}>
														<IconButton
															edge="end"
															aria-label="copy api key"
															onClick={() => handleCopyApiKey(app.id)}
														>
															<ContentCopyOutlinedIcon />
														</IconButton>
													</div>
												</TableCell>
												<TableCell sx={styles().tableContent} align="center">
													<HasAccess
														roles={defaultRoles}
														permissions="organization.update"
														renderAuthFailed={
															<IconButton>
																<SettingsOutlinedIcon
																	sx={{
																		color: `${colors.gray} !important`,
																	}}
																/>
															</IconButton>
														}
													>
														<IconButton
															onClick={() => handleOpenEditAppModal(app.id)}
														>
															<SettingsOutlinedIcon
																sx={{
																	color: `${colors.blue} !important`,
																}}
															/>
														</IconButton>
													</HasAccess>
												</TableCell>
											</TableRow>
										))
								: [...Array(5)].map((e, i) => (
										<TableRow
											key={i}
											sx={{
												'&:lastChild td, &:lastChild th': {
													border: `0 !important`,
												},
											}}
										>
											{[...Array(5)].map(() => (
												<TableCell key={uuidv4()} sx={styles().tableContent}>
													<Skeleton variant="text" />
												</TableCell>
											))}
											<TableCell
												align="center"
												sx={{
													...styles().tableContent,
													width: '100%',
													display: 'flex',
													justifyContent: 'center',
												}}
											>
												<Skeleton variant="circular" width={20} height={20} />
											</TableCell>
										</TableRow>
								  ))}
						</TableBody>
					</Table>
				</TableContainer>

				{organizationAppsState.length > 0 && (
					<CustomPagination
						total={organizationAppsState.length}
						rowsPerPage={rowsPerPage}
						page={page}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				)}

				{/* Modals */}
				<>
					{openCreateAppModal && (
						<AddAppModal
							open={openCreateAppModal}
							setOpen={setOpenCreateAppModal}
						/>
					)}
					{openEditAppModal && (
						<EditAppModal
							open={openEditAppModal}
							setOpen={setOpenEditAppModal}
							appId={selectedAppId || ''}
							handleSelectAppId={setSelectedAppId}
						/>
					)}
				</>
			</CardItem>
		</HasAccess>
	);
};

export default Apps;
