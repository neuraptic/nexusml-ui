/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

// Components
import {
	Divider,
	Grid,
	IconButton,
	InputBase,
	Paper,
	Skeleton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Loader } from '../../../../../../Components/Shared/Loader';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';
import StandardModal from '../../../../../../Components/Shared/StandardModal';

// Styles
import styles from './styles';

// Services
import requestFactory from '../../../../../../services/request.factory';

export const CommentsModal = (props) => {
	const { open, setOpen, currentRowId, currentTaskId } = props;

	const dispatch = useDispatch();

	const scrollableRef = useRef(null);

	// Global states
	const { accessToken } = useSelector((state) => state.user);
	const { info: organizationInfoState } = useSelector(
		(state) => state.organization
	);
	const userState = useSelector((state) => state.user);

	// Local states
	const [newComment, setNewComment] = useState('');
	const [comments, setComments] = useState([]);
	const [users, setUsers] = useState([]);
	const [isLoadingComments, setIsLoadingComments] = useState(false);

	const getUsers = async (comments) => {
		const uniqueUserUUIDs = comments.reduce((accumulator, currentValue) => {
			if (!accumulator.includes(currentValue.created_by.uuid)) {
				accumulator.push(currentValue.created_by.uuid);
			}
			return accumulator;
		}, []);

		if (uniqueUserUUIDs && uniqueUserUUIDs.length > 0) {
			return Promise.all(
				uniqueUserUUIDs.map((userUUID) =>
					requestFactory({
						type: 'GET',
						url: `/organizations/${organizationInfoState.uuid}/users/${userUUID}`,
						userState,
						dispatch,
					})
				)
			).then((result) => {
				setUsers(result.filter((res) => res !== undefined));
			});
		}
	};

	const getComments = async () => {
		setIsLoadingComments(true);
		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${currentTaskId}/examples/${currentRowId}/comments`,
			userState,
			dispatch,
		});
		setComments(res);
		getUsers(res);
		setIsLoadingComments(false);
	};

	useEffect(() => {
		getComments();
	}, []);

	const handleChange = (e) => {
		setNewComment(e.target.value);
	};

	const handleSubmitComment = async (e) => {
		e.preventDefault();
		setIsLoadingComments(true);
		setNewComment('');

		await requestFactory({
			type: 'POST',
			url: `/tasks/${currentTaskId}/examples/${currentRowId}/comments`,
			userState,
			dispatch,
			data: { message: newComment },
		});
		await getComments();
		setIsLoadingComments(false);
	};

	const scrollToBottom = () => {
		scrollableRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [comments]);

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Example comments"
			closeIcon
			content={
				<Grid container>
					<Grid xs={12} sx={{ height: '600px', maxHeight: '600px' }}>
						{!isLoadingComments ? (
							comments.map((comment, index) => (
								<Grid key={index} container sx={{ flexDirection: 'column' }}>
									{comment?.created_by?.uuid ? (
										users &&
										users.length > 0 &&
										users.find(
											(user) => user.uuid === comment.created_by.uuid
										) ? (
											`By ${
												users.find(
													(user) => user.uuid === comment.created_by.uuid
												).first_name
											} ${
												users.find(
													(user) => user.uuid === comment.created_by.uuid
												).last_name
											} ${formatInTimeZone(
												new Date(comment.created_at),
												'UTC',
												"yyyy-MM-dd' 'HH:mm:ss"
											)}`
										) : (
											`${formatInTimeZone(
												new Date(comment.created_at),
												'UTC',
												"yyyy-MM-dd' 'HH:mm:ss"
											)}`
										)
									) : (
										<Skeleton
											animation="wave"
											variant="text"
											style={{ height: '24px', width: '75px' }}
										/>
									)}
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										sx={styles().commentContainer}
									>
										<p>{comment.message}</p>
									</Grid>
								</Grid>
							))
						) : (
							<Grid container sx={{ justifyContent: 'center' }}>
								<Loader size="L" local />
							</Grid>
						)}
						<div ref={scrollableRef} />
					</Grid>
				</Grid>
			}
			actions={
				<Grid container>
					<Grid item xs={12} sx={{ marginBottom: '24px' }}>
						<Paper
							component="form"
							sx={{
								p: '2px 4px',
								display: 'flex',
								alignItems: 'center',
							}}
							onSubmit={handleSubmitComment}
						>
							<InputBase
								sx={{ ml: 1, flex: 1 }}
								value={newComment}
								placeholder="Add new comment"
								onChange={handleChange}
							/>
							<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
							<IconButton
								color="primary"
								sx={{ p: '10px' }}
								aria-label="directions"
								onClick={handleSubmitComment}
							>
								<SendIcon />
							</IconButton>
						</Paper>
					</Grid>
					<Grid
						item
						xs={12}
						sx={{
							display: 'flex ',
							justifyContent: 'flex-end',
						}}
					>
						<StandardButton
							type="danger"
							handleClick={() => setOpen(false)}
							value="Close"
						/>
					</Grid>
				</Grid>
			}
		/>
	);
};

CommentsModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	currentRowId: PropTypes.string,
	currentTaskId: PropTypes.string,
};
