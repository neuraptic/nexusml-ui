import PropTypes from 'prop-types';

// Components
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';
import StandardButton from '../Buttons/StandardButton';

// Styles
import cssStyles from './styles.module.css';

export const ConfirmationDialog = (props) => {
	const {
		title,
		children,
		open,
		setOpen,
		onConfirm,
		isLoading,
		openShowSchema,
	} = props;

	if (!openShowSchema)
		return (
			<Dialog
				className={cssStyles.equal_padding}
				PaperProps={{
					sx: {
						padding: '15px 28px 30px 28px !important',
						borderRadius: '9px !important',
						boxShadow: '0px 3px 15px #0000004f !important',
					},
				}}
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="confirm-dialog"
			>
				<DialogTitle id="confirm-dialog" style={{ padding: '10px 0px' }}>
					{title}
				</DialogTitle>
				<DialogContent style={{ padding: '10px 0px' }}>
					{children}
				</DialogContent>
				<DialogActions
					style={{
						padding: '10px 0px',
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'flex-end',
					}}
				>
					{onConfirm && (
						<StandardButton
							type="filled"
							handleClick={() => {
								onConfirm();
								setOpen(false);
							}}
							loading={isLoading}
							value="Yes"
						/>
					)}
					{onConfirm ? (
						<StandardButton
							handleClick={() => setOpen(false)}
							close
							value="No"
						/>
					) : (
						<StandardButton
							handleClick={() => setOpen(false)}
							close
							value="Close"
						/>
					)}
				</DialogActions>
			</Dialog>
		);
};

ConfirmationDialog.propTypes = {
	title: PropTypes.string,
	children: PropTypes.element,
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	onConfirm: PropTypes.func,
	isLoading: PropTypes.bool,
	openShowSchema: PropTypes.bool,
};
