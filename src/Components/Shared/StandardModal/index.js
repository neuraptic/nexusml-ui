import PropTypes from 'prop-types';

// Components
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';
import MultiValueModal from '../MultiValueModal';

// Styles
import styles from './styles';

function StandardModal(props) {
	const {
		open,
		setOpen,
		title,
		content,
		actions = null,
		maxWidth = 'md',
		multivalue = false,
	} = props;

	if (multivalue)
		return (
			<MultiValueModal title={title} actions={actions}>
				{content}
			</MultiValueModal>
		);

	return (
		<Dialog
			sx={{
				...styles().modalContainer,
				'& .MuiDialog-paper': {
					width: '100%',
					padding: '15px 28px 30px 28px !important',
					borderRadius: '24px !important',
					boxShadow: '0px 3px 15px #0000004f !important',
				},
			}}
			maxWidth={maxWidth}
			open={open}
			onClose={setOpen}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>{content}</DialogContent>
			{actions && <DialogActions>{actions}</DialogActions>}
		</Dialog>
	);
}

StandardModal.propTypes = {
	open: PropTypes.bool.isRequired,
	setOpen: PropTypes.func.isRequired,
	title: PropTypes.string,
	content: PropTypes.object.isRequired,
	actions: PropTypes.object,
	maxWidth: PropTypes.string,
	multivalue: PropTypes.bool,
};

export default StandardModal;
