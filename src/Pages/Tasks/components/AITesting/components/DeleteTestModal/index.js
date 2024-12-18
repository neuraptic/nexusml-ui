import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';

// Styles
import cssStyles from './styles.module.css';

// Redux
import { GET_TESTS } from '../../../../../../redux/testing.slice';

export const DeleteTestModal = ({
	open,
	setOpen,
	setOpenEditExampleModal,
	setSelectedRows,
	setCurrentRowId,
}) => {
	const dispatch = useDispatch();

	const userState = useSelector((state) => state.user);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);

	const [isLoading, setIsLoading] = useState(false);

	const confirmDeleteTest = async () => {
		setIsLoading(true);
		await dispatch(
			GET_TESTS({
				taskId: currentTaskState.uuid,
				userState,
				dispatch,
			})
		);
		setCurrentRowId('');
		setSelectedRows([]);
		setIsLoading(false);
		setOpen(false);
		setOpenEditExampleModal(false);
	};

	const handleClose = () => {
		setOpen(!open);
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Delete this test"
			content={
				<div
					className={cssStyles.delete_confirmation_modal}
					style={{ display: 'flex', flexDirection: 'column' }}
				>
					<p>Once deleted, it will be gone forever. Please be certain.</p>
					<p>
						Before proceeding, please be sure to review the Terms of Service
						regarding account deletion.
					</p>
				</div>
			}
			actions={
				<>
					<StandardButton
						loading={isLoading}
						handleClick={confirmDeleteTest}
						type="danger"
						value="Delete this test"
					/>

					<StandardButton value="Close" handleClick={handleClose} close />
				</>
			}
		/>
	);
};

DeleteTestModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	setOpenEditExampleModal: PropTypes.func,
	setSelectedRows: PropTypes.func,
	setCurrentRowId: PropTypes.func,
};
