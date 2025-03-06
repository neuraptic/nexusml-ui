import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Avatar, CssBaseline, Grid, IconButton, Skeleton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import { Box } from '@mui/system';
import { CustomTooltip } from '../../Shared/CustomTooltip';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Consts
import { measures } from '../../../consts/sizes';

// Contexts
import ConfigContext from '../../../Providers/ConfigContext';

const theme = createTheme();

function TopMenu(props) {
	const { handleSignOut, setIsTopMenu } = props;

	const { appLogoWithName } = useContext(ConfigContext);

	const navigate = useNavigate();

	// Global states
	const organizationInfoState = useSelector((state) => state.organization.info);

	useEffect(() => {
		setIsTopMenu(true);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Grid
				container
				component="main"
				id="top-menu"
				style={styles().mainContainer}
				px={{
					xs: 2,
					sm: 4,
					md: measures.mdGeneralMargin,
					lg: measures.lgGeneralMargin,
				}}
				sx={{
					paddingTop: { xs: '6px' },
					paddingBottom: { xs: '12px' },
				}}
			>
				<CssBaseline />
				{
					// COMPANY SELECTOR SM & MD
				}
				<Grid
					item
					xs={12}
					md={2}
					sx={{
						justifyContent: {
							xs: 'center',
							md: 'flex-start',
						},
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
					}}
					className={cssStyles.logo}
					onClick={() => navigate('/dashboard')}
				>
					<div
						style={{
							marginLeft: '6px',
							display: 'flex',
							alignItems: 'center',
							gap: 6,
							lineHeight: '1.2rem',
						}}
					>
						<img
							src={appLogoWithName}
							alt=""
							style={{ width: '130px', height: '35px' }}
						/>
					</div>
				</Grid>
				<Grid
					item
					xs={12}
					sm={8}
					md={8}
					sx={{
						display: 'flex',
						justifyContent: {
							xs: 'center',
							sm: 'left',
							md: 'center',
						},
					}}
				>
					<div style={styles().companyNameContainer}>
						<div style={styles().companyLogo}>
							{organizationInfoState !== null && (
								<Avatar
									alt="Organization logo"
									src={
										organizationInfoState.logo
											? organizationInfoState.logo['download_url']
											: null
									}
									variant="circle"
									sx={{ width: '30px', height: '30px' }}
								/>
							)}
						</div>
						<Box
							sx={{
								fontSize: { xs: '1.2rem', md: '2rem' },
								display: 'block',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							{(organizationInfoState !== null &&
								process.env.NEXUSML_UI_AUTH_ENABLED === 'true' &&
								organizationInfoState.name) ||
								'Testing Inc.' || (
									<Skeleton
										animation="wave"
										variant="text"
										style={{ height: '24px', width: '150px' }}
									/>
								)}
						</Box>
					</div>
				</Grid>
				<Grid
					item
					xs={12}
					sm={4}
					md={2}
					sx={{
						display: 'flex',
						height: '40px',
						justifyContent: { xs: 'center', sm: 'flex-end' },
						alignItems: 'center',
						gap: 3,
						paddingTop: '12px',
					}}
				>
					{process.env.NEXUSML_UI_AUTH_ENABLED === 'true' && (
						<>
							<IconButton onClick={() => navigate('/settings/user')}>
								<CustomTooltip title="My Account">
									<PersonIcon color="action" />
								</CustomTooltip>
							</IconButton>
							<IconButton onClick={() => navigate('/settings/organization')}>
								<CustomTooltip title="Organization">
									<ApartmentRoundedIcon color="action" />
								</CustomTooltip>
							</IconButton>
							<IconButton onClick={() => handleSignOut()}>
								<CustomTooltip title="Logout">
									<ExitToAppIcon color="action" />
								</CustomTooltip>
							</IconButton>
						</>
					)}
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}

TopMenu.propTypes = {
	handleSignOut: PropTypes.func,
	setIsTopMenu: PropTypes.func,
};

export default TopMenu;
