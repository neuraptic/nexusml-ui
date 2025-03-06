import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Manage roles and permissions
import { HasAccess } from '@permify/react-role';

// Components
import { Grid, Skeleton } from '@mui/material';
import PageRow from '../../../../Components/Shared/PageRow';
import Section from '../../../../Components/Shared/Section';
import CircleProgress from '../../../../Components/Shared/CircleProgress';
import AccessDenied from '../../../../Components/Core/AccessDenied';

// Syles
import styles from './styles';

// Consts1
import { colors } from '../../../../consts/colors';
import { defaultRoles } from '../../../../consts/rolesAndPermissions';
import { isEmptyObject } from '../../../../services/extraServices';

// Contexts
import ConfigContext from '../../../../Providers/ConfigContext';

const Usage = () => {
	const { appName } = useContext(ConfigContext);

	// Global states
	const organizationInfoState = useSelector((state) => state.organization.info);
	const organizationSubscriptionPlanState = useSelector(
		(state) => state.organization.subscription.plan
	);
	const organizationSubscriptionUsageState = useSelector(
		(state) => state.organization.subscription.usage
	);
	const { organizationSettings: organizationSettingsLoaderManager } =
		useSelector((state) => state.loaders);

	// Local states
	const [tmpOrganizationData, setTmpOrganizationData] = useState({
		name: (organizationInfoState !== null && organizationInfoState.name) || '',
		trn: (organizationInfoState !== null && organizationInfoState.trn) || '',
		domain:
			(organizationInfoState !== null && organizationInfoState.domain) || '',
		address:
			(organizationInfoState !== null && organizationInfoState.address) || '',
	});

	useEffect(() => {
		setTmpOrganizationData({
			...tmpOrganizationData,
			name: organizationInfoState !== null && organizationInfoState.name,
			trn: organizationInfoState !== null && organizationInfoState.trn,
			domain: organizationInfoState !== null && organizationInfoState.domain,
			address: organizationInfoState !== null && organizationInfoState.address,
		});
	}, [organizationInfoState]);

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
						<Section title="Usage">
							<span style={{ fontSize: 'small', color: colors.darkGray }}>
								This is your organization usage of the {appName} subscription.
							</span>
						</Section>
					}
					column2={
						<div>
							<div style={styles().usageCharts}>
								<div style={styles().chartContainer}>
									{organizationSettingsLoaderManager.usage ||
									isEmptyObject(organizationSubscriptionPlanState) ||
									isEmptyObject(organizationInfoState) ? (
										<>
											<Skeleton variant="circular" width={40} height={40} />
											<Skeleton variant="text" width={50} />
										</>
									) : (
										<>
											<CircleProgress
												value={organizationSubscriptionUsageState.num_users}
												max={organizationSubscriptionPlanState.max_users}
											/>
											<span style={styles().chartInfo}>Users</span>
											<span style={styles().chartInfo}>
												{organizationSubscriptionUsageState.num_users}/
												{organizationSubscriptionPlanState.max_users}
											</span>
										</>
									)}
								</div>
								<div style={styles().chartContainer}>
									{organizationSettingsLoaderManager.usage ||
									isEmptyObject(organizationSubscriptionPlanState) ||
									isEmptyObject(organizationInfoState) ? (
										<>
											<Skeleton variant="circular" width={40} height={40} />
											<Skeleton variant="text" width={50} />
										</>
									) : (
										<>
											<CircleProgress
												value={
													organizationSubscriptionUsageState.num_collaborators
												}
												max={
													organizationSubscriptionPlanState.max_collaborators
												}
											/>
											<span style={styles().chartInfo}>Collaborators</span>
											<span style={styles().chartInfo}>
												{organizationSubscriptionUsageState.num_collaborators}/
												{organizationSubscriptionPlanState.max_collaborators}
											</span>
										</>
									)}
								</div>
								<div style={styles().chartContainer}>
									{organizationSettingsLoaderManager.usage ||
									isEmptyObject(organizationSubscriptionPlanState) ||
									isEmptyObject(organizationInfoState) ? (
										<>
											<Skeleton variant="circular" width={40} height={40} />
											<Skeleton variant="text" width={50} />
										</>
									) : (
										<>
											<CircleProgress
												value={organizationSubscriptionUsageState.num_roles}
												max={organizationSubscriptionPlanState.max_roles}
											/>
											<span style={styles().chartInfo}>Roles</span>
											<span style={styles().chartInfo}>
												{organizationSubscriptionUsageState.num_roles}/
												{organizationSubscriptionPlanState.max_roles}
											</span>
										</>
									)}
								</div>
								<div style={styles().chartContainer}>
									{organizationSettingsLoaderManager.usage ||
									isEmptyObject(organizationSubscriptionPlanState) ||
									isEmptyObject(organizationInfoState) ? (
										<>
											<Skeleton variant="circular" width={40} height={40} />
											<Skeleton variant="text" width={50} />
										</>
									) : (
										<>
											<CircleProgress
												value={organizationSubscriptionUsageState.num_tasks}
												max={organizationSubscriptionPlanState.max_tasks}
											/>
											<span style={styles().chartInfo}>Tasks</span>
											<span style={styles().chartInfo}>
												{organizationSubscriptionUsageState.num_tasks}/
												{organizationSubscriptionPlanState.max_tasks}
											</span>
										</>
									)}
								</div>
								<div style={styles().chartContainer}>
									{organizationSettingsLoaderManager.usage ||
									isEmptyObject(organizationSubscriptionPlanState) ||
									isEmptyObject(organizationInfoState) ? (
										<>
											<Skeleton variant="circular" width={40} height={40} />
											<Skeleton variant="text" width={50} />
										</>
									) : (
										<>
											<CircleProgress
												value={
													organizationSubscriptionUsageState.num_deployments
												}
												max={organizationSubscriptionPlanState.max_deployments}
											/>
											<span style={styles().chartInfo}>Deployments</span>
											<span style={styles().chartInfo}>
												{organizationSubscriptionUsageState.num_deployments}/
												{organizationSubscriptionPlanState.max_deployments}
											</span>
										</>
									)}
								</div>
								<div style={styles().chartContainer}>
									{organizationSettingsLoaderManager.usage ||
									isEmptyObject(organizationSubscriptionPlanState) ||
									isEmptyObject(organizationInfoState) ? (
										<>
											<Skeleton variant="circular" width={40} height={40} />
											<Skeleton variant="text" width={50} />
										</>
									) : (
										<>
											<CircleProgress
												value={organizationSubscriptionUsageState.num_apps}
												max={organizationSubscriptionPlanState.max_apps}
											/>
											<span style={styles().chartInfo}>Apps</span>
											<span style={styles().chartInfo}>
												{organizationSubscriptionUsageState.num_apps}/
												{organizationSubscriptionPlanState.max_apps}
											</span>
										</>
									)}
								</div>

								<div style={styles().chartContainer}>
									{organizationSettingsLoaderManager.usage ||
									isEmptyObject(organizationSubscriptionPlanState) ||
									isEmptyObject(organizationInfoState) ? (
										<>
											<Skeleton variant="circular" width={40} height={40} />
											<Skeleton variant="text" width={50} />
										</>
									) : (
										<>
											<CircleProgress
												value={Math.round(
													organizationSubscriptionUsageState.space_usage /
														(1024 * 1024 * 1024)
												)}
												max={
													organizationSubscriptionPlanState.space_limit /
													(1024 * 1024 * 1024)
												}
											/>
											<span style={styles().chartInfo}>Space (GB)</span>
											<span style={styles().chartInfo}>
												{(
													organizationSubscriptionUsageState.space_usage /
													(1024 * 1024 * 1024)
												).toFixed(2)}
												/
												{organizationSubscriptionPlanState.space_limit /
													(1024 * 1024 * 1024)}
											</span>
										</>
									)}
								</div>
							</div>
						</div>
					}
				/>
			</Grid>
		</HasAccess>
	);
};

export default Usage;
