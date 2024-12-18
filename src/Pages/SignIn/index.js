import { useContext } from 'react';
import { useDispatch } from 'react-redux';

// Auth
import { useAuth0 } from '@auth0/auth0-react';

// Components
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../../Components/Shared/Copyright';

// Consts
import { measures } from '../../consts/sizes';

// Contexts
import ConfigContext from '../../Providers/ConfigContext';

// Redux
import { AUTH_IS_LOADING } from '../../redux/loaders.slice';

const theme = createTheme();

const SignIn = () => {
	const { appLogoWithName } = useContext(ConfigContext);

	const dispatch = useDispatch();

	const { loginWithRedirect } = useAuth0();

	const handleLogin = async () => {
		dispatch(AUTH_IS_LOADING(true));
		loginWithRedirect();
	};

	return (
		<ThemeProvider theme={theme}>
			<Grid
				container
				component="main"
				sx={{
					px: { xs: 1, sm: 4, md: 8, lg: 12 },
					py: { xs: 1, sm: 4, md: 8, lg: 24 },
					minHeight: '90vh',
					display: 'flex',
					alignItems: 'center',
					backgroundColor: (t) =>
						t.palette.mode === 'light'
							? t.palette.grey[50]
							: t.palette.grey[900],
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<CssBaseline />
				<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
					<Box
						sx={{
							width: {
								xs: '100%',
								sm: '60%',
								md: '50%',
								lg: '30%',
							},
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<img
							src={appLogoWithName}
							alt=""
							style={{ width: '100%', height: '15vh' }}
						/>
					</Box>
				</Grid>
				<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
					<Box
						sx={{
							borderRadius: '1rem',
							py: 3,
							px: 3,
							width: {
								xs: '100%',
								sm: '60%',
								md: '50%',
								lg: '30%',
							},
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
						component={Paper}
						elevation={measures.cardItemElevation}
						square
					>
						<Typography component="h1" variant="h5">
							Sign in
						</Typography>
						<Box
							component="form"
							noValidate
							onSubmit={handleLogin}
							sx={{ mt: 1 }}
						>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Sign In
							</Button>
							<Copyright sx={{ mt: 5 }} />
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
};

export default SignIn;
