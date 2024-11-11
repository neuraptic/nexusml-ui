import PropTypes from 'prop-types';

// Components
import { Grid, CssBaseline } from '@mui/material';

// Styles
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './styles';

// Consts
import { statuses } from '../../../consts/status';
import { CustomTooltip } from '../CustomTooltip';

const theme = createTheme();

function StatusBar(props) {
	const { code = '', name = '', description = '', type = null } = props;

	if (type === 'service') {
		if (code === 'service_disabled')
			return (
				<ThemeProvider theme={theme}>
					<CustomTooltip title={description}>
						<Grid
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: '100%',
							}}
						>
							<CssBaseline />
							<div
								style={{
									...styles().statusContainer,
									backgroundColor: statuses[code]?.color,
								}}
							>
								{name || 'Service disabled'}
							</div>
						</Grid>
					</CustomTooltip>
				</ThemeProvider>
			);
		return (
			<ThemeProvider theme={theme}>
				<CustomTooltip title={description}>
					<Grid
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
						}}
					>
						<CssBaseline />
						<div
							style={{
								...styles().statusContainer,
								backgroundColor: statuses[code]?.color,
							}}
						>
							{name}
						</div>
					</Grid>
				</CustomTooltip>
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider theme={theme}>
			<CustomTooltip title={description}>
				<Grid
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
					}}
				>
					<CssBaseline />
					<div
						style={{
							...styles().statusContainer,
							backgroundColor: statuses[code]?.color,
						}}
					>
						{name}
					</div>
				</Grid>
			</CustomTooltip>
		</ThemeProvider>
	);
}

StatusBar.propTypes = {
	type: PropTypes.string,
	code: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
};

export default StatusBar;
