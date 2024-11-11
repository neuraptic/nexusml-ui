import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// Components
import { Grid } from '@mui/material';
import PageTitle from '../../../Components/Shared/PageTitle';

// Pages
import Info from './Info';
import Users from './Users';
import Usage from './Usage';
import Subscription from './Subscription';
import Roles from './Roles';
import Collaborators from './Collaborators';
import Apps from './Apps';

// Consts
import { measures } from '../../../consts/sizes';

function OrganizationSettings() {
	const organizationInfo = useSelector((state) => state.organization.info);

	const [currentTab, setCurrentTab] = useState('info');

	return (
		organizationInfo !== null && (
			<>
				<PageTitle
					title="Organization settings"
					organizationId={organizationInfo.uuid}
					tabs={{
						currentTab,
						setCurrentTab,
						tabsArray: [
							{
								label: 'Info',
								linkTo: 'info',
							},
							{
								label: 'Usage',
								linkTo: 'usage',
							},
							{
								label: 'Subscription',
								linkTo: 'subscription',
							},
							{
								label: 'Users',
								linkTo: 'users',
							},
							{
								label: 'Collaborators',
								linkTo: 'collaborators',
							},
							{
								label: 'Roles',
								linkTo: 'roles',
							},
							{
								label: 'Apps',
								linkTo: 'apps',
							},
						],
					}}
				/>
				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					sx={{
						px: {
							xs: 1,
							sm: 4,
							md: measures.mdGeneralMargin,
							lg: measures.lgGeneralMargin,
						},
						width: '100%',
						marginTop: '50px',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{currentTab === 'info' && <Info />}
					{currentTab === 'users' && <Users />}
					{currentTab === 'usage' && <Usage />}
					{currentTab === 'subscription' && <Subscription />}
					{currentTab === 'collaborators' && <Collaborators />}
					{currentTab === 'roles' && <Roles />}
					{currentTab === 'apps' && <Apps />}
				</Grid>
			</>
		)
	);
}

export default OrganizationSettings;
