/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// Manage roles and permissions
import { HasAccess } from '@permify/react-role';

// Components
import {
	IconButton,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CardItem from '../../../../Components/Shared/CardItem';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import AccessDenied from '../../../../Components/Core/AccessDenied';
import { CustomPagination } from '../../../../Components/Shared/CustomPagination';
import {
	EditCollaboratorModal,
	AddCollaboratorModal,
} from './components/modals';

// Syles
import styles from './styles';
import cssStyles from './styles.module.css';

// Consts
import { colors } from '../../../../consts/colors';
import { measures } from '../../../../consts/sizes';
import { defaultRoles } from '../../../../consts/rolesAndPermissions';

const Collaborators = () => {
	// Global states
	const organizationCollaboratorsState = useSelector(
		(state) => state.organization.collaborators
	);
	const { organizationSettings: organizationSettingsLoaderManager } =
		useSelector((state) => state.loaders);

	// Local states
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');
	const [openInviteCollaboratorModal, setOpenInviteCollaboratorModal] =
		useState(false);
	const [openEditCollaboratorModal, setOpenEditCollaboratorModal] =
		useState(false);

	const handleOpenInviteCollaboratorModal = () => {
		setOpenInviteCollaboratorModal(true);
	};

	const handleOpenEditCollaboratorModal = (collaboratorId) => {
		setSelectedCollaboratorId(collaboratorId);
		setOpenEditCollaboratorModal(true);
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
							<StandardButton type="disabled" value="Add collaborator" />
						}
					>
						<StandardButton
							value="Add collaborator"
							handleClick={handleOpenInviteCollaboratorModal}
						/>
					</HasAccess>
				}
				title={
					<p
						style={styles().totalCollaborators}
					>{`Collaborators: ${organizationCollaboratorsState.totalCollaborators}`}</p>
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
						aria-label="organization collaborators table"
					>
						<TableHead>
							<TableRow
								sx={{ borderBottom: `2px solid ${colors.lightBorderColor}` }}
							>
								<TableCell sx={styles().tableTitle}>Id</TableCell>
								<TableCell sx={styles().tableTitle}>Email</TableCell>
								<TableCell sx={styles().tableTitle}>First name</TableCell>
								<TableCell sx={styles().tableTitle}>Last name</TableCell>
								<TableCell sx={styles().tableTitle} align="center">
									Manage
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{!organizationSettingsLoaderManager.users &&
							organizationCollaboratorsState
								? organizationCollaboratorsState.displayedCollaborators
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((collaborator) => (
											<TableRow
												key={collaborator.uuid}
												sx={{
													'&:lastChild td, &:lastChild th': {
														border: `0 !important`,
													},
												}}
											>
												<TableCell sx={styles().tableContent}>
													{collaborator.id}
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{collaborator.email}
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{collaborator.first_name}
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{collaborator.last_name}
												</TableCell>
												<TableCell sx={styles().tableContent} align="center">
													<HasAccess
														roles={defaultRoles}
														permissions="organization.update"
														renderAuthFailed={
															<IconButton>
																<SettingsOutlinedIcon
																	sx={{ color: `${colors.gray} !important` }}
																/>
															</IconButton>
														}
													>
														<IconButton
															onClick={() =>
																handleOpenEditCollaboratorModal(collaborator.id)
															}
														>
															<SettingsOutlinedIcon
																sx={{ color: `${colors.blue} !important` }}
															/>
														</IconButton>
													</HasAccess>
												</TableCell>
											</TableRow>
										))
								: [...Array(5)].map(() => (
										<TableRow
											key={uuidv4()}
											sx={{
												'&:lastChild td, &:lastChild th': {
													border: `0 !important`,
												},
											}}
										>
											{[...Array(4)].map(() => (
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
				{organizationCollaboratorsState &&
					organizationCollaboratorsState.displayedCollaborators &&
					organizationCollaboratorsState.totalCollaborators > 0 && (
						<CustomPagination
							total={organizationCollaboratorsState.totalCollaborators}
							rowsPerPage={rowsPerPage}
							page={page}
							handleChangePage={handleChangePage}
							handleChangeRowsPerPage={handleChangeRowsPerPage}
							simple
						/>
					)}
				<>
					{openInviteCollaboratorModal && (
						<AddCollaboratorModal
							open={openInviteCollaboratorModal}
							setOpen={setOpenInviteCollaboratorModal}
						/>
					)}
					{openEditCollaboratorModal && selectedCollaboratorId && (
						<EditCollaboratorModal
							open={openEditCollaboratorModal}
							setOpen={setOpenEditCollaboratorModal}
							collaboratorId={selectedCollaboratorId}
							handleSelectCollaboratorId={setSelectedCollaboratorId}
						/>
					)}
				</>
			</CardItem>
		</HasAccess>
	);
};

export default Collaborators;
