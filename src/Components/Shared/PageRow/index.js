import PropTypes from 'prop-types';

// Components
import { Grid } from '@mui/material';

// Styles
import styles from './styles';

// Consts
import { colors } from '../../../consts/colors';

function PageRow(props) {
	const { type, column1, column2 } = props;

	if (type === 'danger') {
		return (
			<div style={styles().dangerContainer}>
				<div style={styles().dangerTitle}>Danger zone</div>
				<Grid
					item
					sx={{
						width: '95%',
						marginTop: '24px',
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' },
						alignItems: 'center',
						padding: '20px 14px',
						outline: `3px solid red`,
						borderRadius: '5px',
						gap: { xs: 1, sm: 4, md: 8, lg: 12 },
						'& > *:first-of-type': {
							width: {
								xs: '100%',
								sm: '100%',
								md: '40%',
								lg: '40%',
							},
						},
						'& > *:last-child': {
							width: {
								xs: '100%',
								sm: '100%',
								md: '60%',
								lg: '60%',
							},
						},
					}}
				>
					<div style={styles().column}>{column1}</div>
					<div style={styles().column}>{column2}</div>
				</Grid>
			</div>
		);
	}

	return (
		<Grid
			item
			xs={12}
			sm={12}
			md={12}
			sx={{
				width: '100%',
				marginTop: '24px',
				display: 'flex',
				flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' },
				paddingBottom: '24px',
				borderBottom: `1px solid ${colors.gray}`,
				gap: { xs: 1, sm: 4, md: 8, lg: 12 },
				'& > *:first-of-type': {
					width: {
						xs: '100%',
						sm: '100%',
						md: '40%',
						lg: '40%',
					},
				},
				'& > *:last-child': {
					width: {
						xs: '100%',
						sm: '100%',
						md: '60%',
						lg: '60%',
					},
				},
			}}
		>
			<div>{column1}</div>
			<div>{column2}</div>
		</Grid>
	);
}

PageRow.propTypes = {
	type: PropTypes.string,
	column1: PropTypes.object,
	column2: PropTypes.object,
};

export default PageRow;
