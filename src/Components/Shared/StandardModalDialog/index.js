import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
} from '@mui/material';
import PropTypes from 'prop-types';
import StandardButton from '../Buttons/StandardButton';

// Styles
import styles from './styles';

export const StandardModalDialog = (props) => {
	const { open, setOpen, title, titleDescription, content, confirmActions } =
		props;

	const handleClose = () => {
		setOpen(!open);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			sx={{
				...styles().dialogContainer,
				'& .MuiDialog-paper': {
					borderRadius: '24px',
				},
			}}
		>
			<div style={styles().dialogTitle}>{title}</div>
			<DialogContent>
				{titleDescription && (
					<DialogContentText>{titleDescription}</DialogContentText>
				)}
				{content}
			</DialogContent>
			<DialogActions>
				<div style={styles().dialogActions}>
					{confirmActions}
					<StandardButton
						type="danger"
						handleClick={handleClose}
						value="Close"
					/>
				</div>
			</DialogActions>
		</Dialog>
	);
};

StandardModalDialog.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	title: PropTypes.string,
	titleDescription: PropTypes.string,
	content: PropTypes.any,
	confirmActions: PropTypes.any,
};
