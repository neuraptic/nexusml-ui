import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Manage roles and permissions
import { HasAccess } from '@permify/react-role';

// Components
import { Avatar, FormControl, Grid, Input, Skeleton } from '@mui/material';
import PageRow from '../../../../Components/Shared/PageRow';
import Section from '../../../../Components/Shared/Section';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import AccessDenied from '../../../../Components/Core/AccessDenied';

// Redux
import {
	CREATE_ORGANIZATION_FILE,
	UPDATE_ORGANIZATION_INFO,
} from '../../../../redux/organization.slice';

// Syles
import styles from '../styles';
import cssStyles from '../styles.module.css';

// Consts
import { colors } from '../../../../consts/colors';
import { defaultRoles } from '../../../../consts/rolesAndPermissions';

// Services
import { isEmptyObject } from '../../../../services/extraServices';
import { DeleteOrganizationModal } from './Components/DeleteOrganizationModal';

// Contexts
import ConfigContext from '../../../../Providers/ConfigContext';

const Info = () => {
	const dispatch = useDispatch();

	const { appName } = useContext(ConfigContext);

	// Global states
	const { accessToken } = useSelector((state) => state.user);
	const userState = useSelector((state) => state.user);
	const organizationInfoState = useSelector((state) => state.organization.info);
	const { organizationSettings: organizationSettingsLoaderManager } =
		useSelector((state) => state.loaders);

	// Local states
	const [tmpOrganizationData, setTmpOrganizationData] = useState({
		name: (organizationInfoState !== null && organizationInfoState.name) || '',
		trn: (organizationInfoState !== null && organizationInfoState.trn) || '',
		address:
			(organizationInfoState !== null && organizationInfoState.address) || '',
	});
	const [openDeleteOrganizationModal, setOpenDeleteOrganizationModal] =
		useState(false);

	useEffect(() => {
		setTmpOrganizationData({
			...tmpOrganizationData,
			name: organizationInfoState !== null && organizationInfoState.name,
			trn: organizationInfoState !== null && organizationInfoState.trn,
			address: organizationInfoState !== null && organizationInfoState.address,
		});
	}, [organizationInfoState]);

	const handleChangeOrganizationInfo = (e) => {
		const { id, value } = e.target;
		setTmpOrganizationData({ ...tmpOrganizationData, [id]: value });
	};

	const handleUpdateOrganizationInfo = async () => {
		const organizationId = organizationInfoState.uuid;

		await dispatch(
			UPDATE_ORGANIZATION_INFO({
				organizationId,
				organizationInfo: tmpOrganizationData,
				userState,
			})
		);
	};

	const handleUploadImage = async (e) => {
		if (organizationInfoState.id && e.target.files.length > 0 && accessToken) {
			const file = e.target.files[0];
			const res = await dispatch(
				CREATE_ORGANIZATION_FILE({
					organizationId: organizationInfoState.id,
					file,
					userState,
					dispatch,
				})
			);
			const { id: logoId } = res.payload;

			const organizationDataToUpdate = {
				trn: organizationInfoState.trn,
				logo: logoId,
				address: organizationInfoState.address,
				name: organizationInfoState.name,
			};

			dispatch(
				UPDATE_ORGANIZATION_INFO({
					organizationId: organizationInfoState.id,
					organizationInfo: organizationDataToUpdate,
					userState,
				})
			);
		}
	};

	const handleOpenDeleteOrganizationModal = () => {
		setOpenDeleteOrganizationModal(!openDeleteOrganizationModal);
	};

	return (
		<HasAccess
			roles={defaultRoles}
			permissions="organization.read"
			renderAuthFailed={<AccessDenied />}
		>
			<Grid
				item
				xs={12}
				sm={12}
				md={12}
				sx={{
					width: '100%',
					marginTop: '24px',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<PageRow
					column1={
						<Section title="Details">
							<span style={{ fontSize: 'small', color: colors.darkGray }}>
								This is your organization information of the {appName}{' '}
								subscription displayed on your dashboard. The organization
								information can only be modified by the administrator or
								maintainer of it.
							</span>
						</Section>
					}
					column2={
						<>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>Organization image</div>
									<div style={styles().uploadImageContainer}>
										<div style={styles().currentOrganizationImage}>
											<Avatar
												alt="Task"
												src={
													organizationInfoState.logo
														? organizationInfoState.logo['download_url']
														: null
												}
												variant="circle"
											/>
										</div>
										{organizationSettingsLoaderManager.info ||
										isEmptyObject(organizationInfoState) ? (
											<Skeleton
												variant="rounded"
												width={150}
												height={20}
												sx={{ margin: '8px 0px' }}
											/>
										) : (
											<HasAccess
												roles={defaultRoles}
												permissions="organization.update"
												renderAuthFailed={
													<StandardButton
														type="disabled"
														value="Upload image"
													/>
												}
											>
												<StandardButton
													type="uploadFile"
													value="Upload image"
													handleChange={handleUploadImage}
												/>
											</HasAccess>
										)}
									</div>
								</div>
							</div>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>TRN *</div>
									{organizationSettingsLoaderManager.info ||
									isEmptyObject(organizationInfoState) ? (
										<Skeleton
											variant="rounded"
											width={350}
											height={30}
											sx={{ margin: '8px 0px' }}
										/>
									) : (
										<FormControl>
											<HasAccess
												roles={defaultRoles}
												permissions="organization.update"
												renderAuthFailed={
													<Input
														className={cssStyles.common_input_type}
														id="trn"
														value={tmpOrganizationData.trn}
														disabled
													/>
												}
											>
												<Input
													className={cssStyles.common_input_type}
													id="trn"
													value={tmpOrganizationData.trn}
													onChange={handleChangeOrganizationInfo}
												/>
											</HasAccess>
										</FormControl>
									)}
								</div>
							</div>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>Name</div>
									{organizationSettingsLoaderManager.info ||
									isEmptyObject(organizationInfoState) ? (
										<Skeleton
											variant="rounded"
											width={350}
											height={30}
											sx={{ margin: '8px 0px' }}
										/>
									) : (
										<FormControl>
											<HasAccess
												roles={defaultRoles}
												permissions="organization.update"
												renderAuthFailed={
													<Input
														className={cssStyles.common_input_type}
														id="name"
														value={tmpOrganizationData.name}
														disabled
													/>
												}
											>
												<Input
													className={cssStyles.common_input_type}
													id="name"
													value={tmpOrganizationData.name}
													onChange={handleChangeOrganizationInfo}
												/>
											</HasAccess>
										</FormControl>
									)}
								</div>
							</div>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>Domain</div>
									{organizationSettingsLoaderManager.info ||
									isEmptyObject(organizationInfoState) ? (
										<Skeleton
											variant="rounded"
											width={350}
											height={30}
											sx={{ margin: '8px 0px' }}
										/>
									) : (
										<FormControl>
											<Input
												className={cssStyles.common_input_type}
												id="domain"
												value={organizationInfoState.domain}
												disabled
											/>
										</FormControl>
									)}
								</div>
							</div>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>Address</div>
									{organizationSettingsLoaderManager.info ||
									isEmptyObject(organizationInfoState) ? (
										<Skeleton
											variant="rounded"
											width={350}
											height={30}
											sx={{ margin: '8px 0px' }}
										/>
									) : (
										<FormControl>
											<HasAccess
												roles={defaultRoles}
												permissions="organization.update"
												renderAuthFailed={
													<Input
														className={cssStyles.common_input_type}
														id="address"
														value={tmpOrganizationData.address}
														disabled
													/>
												}
											>
												<Input
													className={cssStyles.common_input_type}
													id="address"
													value={tmpOrganizationData.address}
													onChange={handleChangeOrganizationInfo}
												/>
											</HasAccess>
										</FormControl>
									)}
								</div>
							</div>

							{!organizationSettingsLoaderManager.info ||
							isEmptyObject(organizationInfoState) ? (
								<HasAccess
									roles={defaultRoles}
									permissions="organization.update"
									renderAuthFailed={
										<StandardButton type="disabled" value="Save changes" />
									}
								>
									<StandardButton
										loading={organizationInfoState.isLoading}
										value="Save changes"
										handleClick={handleUpdateOrganizationInfo}
									/>
								</HasAccess>
							) : (
								''
							)}
						</>
					}
				/>
				{
					// Delete app
				}
				<PageRow
					type="danger"
					column1={
						<Section title="Delete this organization">
							<span style={{ fontSize: 'small', color: colors.darkGray }}>
								Once deleted, it will be gone forever. Please be certain.
							</span>
						</Section>
					}
					column2={
						<Section style={{ fontWeight: 'bold' }}>
							<StandardButton
								handleClick={handleOpenDeleteOrganizationModal}
								type="danger"
								value="Delete this organization"
							/>
						</Section>
					}
				/>
			</Grid>
			<DeleteOrganizationModal
				open={openDeleteOrganizationModal}
				setOpen={setOpenDeleteOrganizationModal}
			/>
		</HasAccess>
	);
};

export default Info;
