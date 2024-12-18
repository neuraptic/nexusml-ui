/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { Box } from '@mui/material';
import { Document, Page } from 'react-pdf';
import StandardButton from '../StandardButton';
import { Loader } from '../../Loader';

// Styles
import styles from './styles';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Redux
import { CREATE_TASK_FILE } from '../../../../redux/tasks.slice';
import { GET_EXAMPLE_FILE } from '../../../../redux/examples.slice';

// Alerts
import { ADD_ALERT, REMOVE_ALERT } from '../../../../redux/alerts.slice';
import {
	IMAGE_FILE_UPLOAD_ERROR,
	IMAGE_FILE_UPLOAD_SUCCESS,
} from '../../../../AlertsList/examplesAlerts';

export const UploadButton = (props) => {
	const { currentCellId, allColumns, setCurrentValue, type } = props;

	const dispatch = useDispatch();

	// Global states
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const userState = useSelector((state) => state.user);

	// Local states
	const [currentElement, setCurrentElement] = useState({
		element: currentCellId,
		value: '',
		thumbnailUrl: '',
		tmpInfo: '',
		isLoading: false,
	});
	const [currentColumn, setCurrentColumn] = useState({});

	useEffect(() => {
		setCurrentColumn(
			allColumns.find((column) => column.field === currentCellId)
		);
	}, [allColumns]);

	const handleChangeUploadFile = async ({ e, usedFor, fileType, field }) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.target.files && e.target.files[0]) {
			setCurrentElement({
				...currentElement,
				isLoading: true,
			});

			const file = e.target.files[0];

			const res = await dispatch(
				CREATE_TASK_FILE({
					taskId: currentTaskState.id,
					file,
					userState,
					dispatch,
					usedFor,
					fileType,
				})
			);

			if (res.payload) {
				const resFile = await dispatch(
					GET_EXAMPLE_FILE({
						taskId: currentTaskState.id,
						fileId: res.payload.id,
						userState,
						dispatch,
						thumbnail: fileType === 'image',
					})
				);

				setCurrentValue(res.payload.id);

				setCurrentElement({
					...currentElement,
					element: field,
					value: res.payload.id,
					thumbnailUrl: resFile.payload.download_url,
					tmpInfo: res.payload,
					isLoading: false,
				});
				dispatch(
					ADD_ALERT({ type: 'success', message: IMAGE_FILE_UPLOAD_SUCCESS })
				);
				setTimeout(() => {
					dispatch(REMOVE_ALERT(IMAGE_FILE_UPLOAD_SUCCESS));
				}, 2000);
			} else {
				setCurrentElement({
					...currentElement,
					isLoading: false,
				});
				dispatch(
					ADD_ALERT({ type: 'error', message: IMAGE_FILE_UPLOAD_ERROR })
				);
			}
		}
	};

	const handleResetInputFile = () => {
		setCurrentElement({
			element: currentCellId,
			value: '',
			thumbnailUrl: '',
			tmpInfo: '',
			isLoading: false,
		});
	};

	return (
		<div style={styles().uploadContainer}>
			{currentElement.isLoading ? (
				<StandardButton value={<Loader size="S" local />} type="uploadFile" />
			) : (
				<StandardButton
					accept="image/.jpg, image/.png"
					value={
						currentElement.value ||
						(type === 'document' ? 'Upload document' : 'Upload image')
					}
					type="uploadFile"
					handleChange={(e) =>
						handleChangeUploadFile({
							e,
							usedFor: currentColumn.fieldType,
							fileType: 'image',
							field: currentColumn.field,
						})
					}
					id={currentColumn.field}
					name={currentColumn.field}
					handleClick={handleResetInputFile}
				/>
			)}
			<div>
				{currentElement.thumbnailUrl ? (
					type !== 'document' ? (
						<img
							alt={currentElement.value}
							src={
								currentElement.thumbnailUrl !== '' &&
								currentElement.thumbnailUrl
							}
							style={styles().imagePreview}
						/>
					) : (
						<Box
							sx={{
								mt: '20px',
								mb: '20px',
								display: 'flex',
								backgroundColor: 'white',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Document file={currentElement.thumbnailUrl}>
								<Page
									renderMode="svg"
									renderTextLayer={false}
									renderAnnotationLayer={false}
									pageNumber={1}
								/>
							</Document>
						</Box>
					)
				) : (
					`Can't load ${type} preview`
				)}
			</div>
		</div>
	);
};

UploadButton.propTypes = {
	currentCellId: PropTypes.string,
	allColumns: PropTypes.any,
	setCurrentValue: PropTypes.func,
	type: PropTypes.string,
};
