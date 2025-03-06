import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// Components
import { Grid } from '@mui/material';
import PageTitle from '../../../Components/Shared/PageTitle';

// Pages
import Info from './Info';
import Users from './Users';
import Usage from './Usage';
import Roles from './Roles';
import Collaborators from './Collaborators';
import Apps from './Apps';

// Consts
import { measures } from '../../../consts/sizes';

function OrganizationSettings(props) {
	const { customTabs } = props;

	const organizationInfo = useSelector((state) => state.organization.info);

	const [currentTab, setCurrentTab] = useState('info');
	const [organizationTabsArray] = useState([
		{
			label: 'Info',
			linkTo: 'info',
			component: <Info />,
		},
		{
			label: 'Usage',
			linkTo: 'usage',
			component: <Usage />,
		},
		{
			label: 'Users',
			linkTo: 'users',
			component: <Users />,
		},
		{
			label: 'Collaborators',
			linkTo: 'collaborators',
			component: <Collaborators />,
		},
		{
			label: 'Roles',
			linkTo: 'roles',
			component: <Roles />,
		},
		{
			label: 'Apps',
			linkTo: 'apps',
			component: <Apps />,
		},
	]);
	const [newTabsArray, setNewTabsArray] = useState([]);

	useEffect(() => {
		if (customTabs?.length > 0) {
			const updatedTabsArray = organizationTabsArray;
			customTabs.forEach((tab) => {
				const existingTabIndex = updatedTabsArray.findIndex(
					(element) => element.linkTo === tab.linkTo
				);

				if (existingTabIndex !== -1) {
					// Update existing tab
					if (tab.index !== undefined) {
						const [removedElement] = updatedTabsArray.splice(
							existingTabIndex,
							1
						);
						const overwriteTab = {
							label: tab.label || removedElement.label,
							linkTo: tab.linkTo || removedElement.linkTo,
							component: tab.component || removedElement.component,
						};
						updatedTabsArray.splice(tab.index, 0, overwriteTab);
					} else {
						if (tab.linkTo)
							updatedTabsArray[existingTabIndex].linkTo = tab.linkTo;
						if (tab.label) updatedTabsArray[existingTabIndex].label = tab.label;
						if (tab.component)
							updatedTabsArray[existingTabIndex].component = tab.component;
					}
				} else {
					// Add new tab
					const newTab = {
						label: tab.label,
						linkTo: tab.linkTo,
						component: tab.component,
					};
					if (tab.index !== undefined) {
						updatedTabsArray.splice(tab.index, 0, newTab);
					} else {
						updatedTabsArray.push(newTab);
					}
				}
			});

			// Update the state only once after all modifications
			setNewTabsArray(updatedTabsArray);
		} else {
			setNewTabsArray(organizationTabsArray);
		}
	}, [customTabs]);

	return (
		organizationInfo !== null &&
		newTabsArray.length > 0 && (
			<>
				<PageTitle
					title="Organization settings"
					organizationId={organizationInfo.uuid}
					tabs={{
						currentTab,
						setCurrentTab,
						tabsArray: newTabsArray,
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
					{newTabsArray?.find((tab) => tab.linkTo === currentTab).component}
				</Grid>
			</>
		)
	);
}

OrganizationSettings.propTypes = {
	customTabs: PropTypes.array,
};

export default OrganizationSettings;
