import PropTypes from 'prop-types';

// Components
import StandardModal from '../../Components/Shared/StandardModal';

// Styles
import cssStyles from './styles.module.css';

export const EmailVerification = (props) => {
	const { open, setOpen } = props;

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Email not verified"
			size="80%"
			content={
				<div
					className={cssStyles.delete_confirmation_modal}
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<p>
						Your email address has not been verified. Please verify your email
						address before continuing.
					</p>
				</div>
			}
		/>
	);
};

EmailVerification.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
