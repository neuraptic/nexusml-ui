import { useContext } from 'react';

// Components
import { Container, Typography, Paper } from '@mui/material';
import MaintenanceIcon from '@mui/icons-material/Build';

// Contexts
import ConfigContext from '../../Providers/ConfigContext';

// Consts
import { colors } from '../../consts/colors';

// Styles
import styles from './styles';

const MaintenancePage = () => {
	const { appMaintenanceImage } = useContext(ConfigContext);

	return (
		<Container>
			<Paper elevation={3} sx={styles().maintenance}>
				<MaintenanceIcon sx={{ fontSize: 64, color: colors.blue }} />
				<Typography variant="h4" color={colors.blue} gutterBottom>
					Website Maintenance
				</Typography>
				<Typography variant="body1" paragraph>
					Scheduled maintenance is currently in progress Please check back
					later.
				</Typography>
				<Typography variant="body1" paragraph>
					We apologize for any inconvenience.
				</Typography>
				<Typography variant="body1" paragraph>
					If you need immediate assistance, contact us at{' '}
					<a href="mailto:support@neuraptic.ai">support@neuraptic.ai</a>.
				</Typography>
				<img
					src={appMaintenanceImage}
					alt="Maintenance"
					style={styles().maintenanceImage}
				/>
			</Paper>
		</Container>
	);
};

export default MaintenancePage;
