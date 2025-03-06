import PropTypes from 'prop-types';

// Components
import { Backdrop, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { SimplePagination } from '../CustomPagination/CustomPagination.stories';

// Styles
import styles from './styles';

const MultiValueModal = (props) => {
	const { children } = props;

	return (
		<>
			<Backdrop
				sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
				open
			/>
			<Grid
				container
				sx={(theme) => ({
					// display: 'none',
					height: '100vh',
					position: 'absolute',
					top: 0,
					left: 0,
					zIndex: theme.zIndex.drawer + 1,
				})}
			>
				<Grid item xs={1} style={styles().arrowContainer}>
					<Grid item style={styles().arrowModal}>
						<FontAwesomeIcon
							icon={faAngleLeft}
							style={{ fontSize: '48px' }}
							onClick={() => {
								// handleClick(e);
							}}
						/>
					</Grid>
				</Grid>
				<Grid item xs={10} style={styles().modalContainer}>
					<Grid item style={styles().mainModal}>
						{children}
					</Grid>
					<Grid container style={styles().bottomModal}>
						<SimplePagination />
					</Grid>
				</Grid>
				<Grid item xs={1} style={styles().arrowContainer}>
					<Grid item style={styles().arrowModal}>
						<FontAwesomeIcon
							icon={faAngleRight}
							style={{ fontSize: '48px' }}
							onClick={() => {
								// handleClick(e);
							}}
						/>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

MultiValueModal.propTypes = {
	children: PropTypes.object,
};

export default MultiValueModal;
