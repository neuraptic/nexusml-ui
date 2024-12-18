import React from 'react';

// Components
import { Grid } from '@mui/material';
import Copyright from '../../Shared/Copyright';

function Footer() {
	return (
		<Grid container>
			<Grid item xs={12} sm={12} md={12} sx={{ margin: '36px 0px' }}>
				<Copyright />
			</Grid>
		</Grid>
	);
}

export default Footer;
