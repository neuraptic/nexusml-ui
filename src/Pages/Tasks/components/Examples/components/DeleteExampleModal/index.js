import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';

// Styles
import cssStyles from './styles.module.css';

// Redux
import {
	DELETE_EXAMPLE,
	GET_EXAMPLES,
} from '../../../../../../redux/examples.slice';

export const DeleteExampleModal = (props) => {
	const {
		open,
		setOpen,
		setOpenEditExampleModal,
		selectedRows,
		setSelectedRows,
		setCurrentRowId,
	} = props;

	const dispatch = useDispatch();

	// Global states
	const userState = useSelector((state) => state.user);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);

	// Local states
	const [isLoading, setIsLoading] = useState(false);

	const confirmDeleteExample = async () => {
		setIsLoading(true);
		await Promise.all(
			selectedRows.map(async (row) => {
				await dispatch(
					DELETE_EXAMPLE({
						currentRowId: row,
						taskId: currentTaskState.id,
						dispatch,
						userState,
					})
				);
			})
		);
		await dispatch(
			GET_EXAMPLES({
				taskId: currentTaskState.uuid,
				dispatch,
				userState,
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
			title="Delete this example"
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
						handleClick={confirmDeleteExample}
						type="danger"
						value="Delete this example"
					/>

					<StandardButton value="Close" handleClick={handleClose} close />
				</>
			}
		/>
	);
};

DeleteExampleModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	setOpenEditExampleModal: PropTypes.func,
	selectedRows: PropTypes.array,
	setSelectedRows: PropTypes.func,
	setCurrentRowId: PropTypes.func,
};
