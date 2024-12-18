import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';

// Components
import Box from '@mui/material/Box';
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Services
import { elementTypeToIconMap } from '../../../../../../services/tasks';

export const EditViewModal = (props) => {
	const { open, setOpen, allColumns, currentColumns, setCurrentColumns } =
		props;

	// Global states
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);

	// Local states
	const [tmpColumns, setTmpColumns] = useState([]);

	useEffect(() => {
		if (currentColumns && currentColumns.length !== 0) {
			setTmpColumns(currentColumns);
		}
	}, [currentColumns]);

	const handleChange = (column) => {
		let tmp = [];

		tmp.push(allColumns[0], allColumns[1]);
		if (tmpColumns.includes(column)) {
			tmp = tmpColumns.filter((currentColumn) => currentColumn !== column);
		} else {
			allColumns.forEach((currentColumn) => {
				if (
					currentColumn.field === 'edit' ||
					currentColumn.field === 'status' ||
					currentColumn.field === 'comments'
				)
					return;
				if (currentColumn === column) tmp = [...tmp, column];
				if (tmpColumns.includes(currentColumn)) tmp = [...tmp, currentColumn];
			});
		}

		setTmpColumns(tmp);
		window.localStorage.setItem(
			`${currentTaskState.uuid}-exampleColumns`,
			tmp.map((col) => col.field)
		);
	};

	const handleChangeAllFields = (type) => {
		let tmp;
		if (tmpColumns.find((col) => col.fieldType === type)) {
			setTmpColumns(tmpColumns.filter((col) => col.fieldType !== type));
			window.localStorage.setItem(
				`${currentTaskState.uuid}-exampleColumns`,
				tmpColumns
					.filter((col) => col.fieldType !== type)
					.map((col) => col.field)
			);
		} else {
			tmp = tmpColumns.filter((col) => col.fieldType !== type);
			setTmpColumns([
				...tmp,
				...allColumns.filter((col) => col.fieldType === type),
			]);
			window.localStorage.setItem(
				`${currentTaskState.uuid}-exampleColumns`,
				[...tmp, ...allColumns.filter((col) => col.fieldType === type)].map(
					(col) => col.field
				)
			);
		}
	};

	const handleSaveChanges = () => {
		setCurrentColumns(tmpColumns);
		setOpen(false);
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Edit view:"
			content={
				<Box
					sx={{
						...styles().dialogContentContainer,
						margin: '20px -15px 0 -15px',
					}}
				>
					<Box sx={styles().fieldTypeColumn}>
						<div className={cssStyles.edit_table_title}>
							<input
								type="checkbox"
								checked={tmpColumns.find((col) => col.fieldType === 'input')}
								onChange={() => handleChangeAllFields('input')}
								style={{ marginRight: '6px', marginLeft: 0 }}
							/>
							Inputs:
						</div>
						<div style={styles().fieldTypeElement}>
							{allColumns.map(
								(column) =>
									column.fieldType &&
									column.fieldType === 'input' && (
										<div key={uuidv4()} className={cssStyles.fieldTypeRow}>
											<input
												type="checkbox"
												checked={tmpColumns.find(
													(currentColumn) => currentColumn === column
												)}
												onChange={() => handleChange(column)}
											/>
											{elementTypeToIconMap[column.valueType](column.fieldType)}
											<div className={cssStyles.edit_table_cell_value}>
												{column.name}
											</div>
										</div>
									)
							)}
						</div>
					</Box>
					<Box sx={styles().fieldTypeColumn}>
						<div className={cssStyles.edit_table_title}>
							<input
								type="checkbox"
								checked={tmpColumns.find((col) => col.fieldType === 'metadata')}
								onChange={() => handleChangeAllFields('metadata')}
								style={{ marginRight: '6px', marginLeft: 0 }}
							/>
							Metadata:
						</div>
						<div style={styles().fieldTypeElement}>
							{allColumns.map(
								(column) =>
									column.fieldType &&
									column.fieldType === 'metadata' && (
										<div key={uuidv4()} className={cssStyles.fieldTypeRow}>
											<input
												type="checkbox"
												checked={tmpColumns.find(
													(currentColumn) => currentColumn === column
												)}
												onChange={() =>
													handleChange(
														column,
														tmpColumns.find(
															(currentColumn) => currentColumn === column
														)
													)
												}
											/>
											{elementTypeToIconMap[column.valueType](column.fieldType)}
											<div className={cssStyles.edit_table_cell_value}>
												{column.name}
											</div>
										</div>
									)
							)}
						</div>
					</Box>
					<Box sx={styles().fieldTypeColumn}>
						<div className={cssStyles.edit_table_title}>
							<input
								type="checkbox"
								checked={tmpColumns.find((col) => col.fieldType === 'output')}
								onChange={() => handleChangeAllFields('output')}
								style={{ marginRight: '6px', marginLeft: 0 }}
							/>
							Outputs:
						</div>
						<div style={styles().fieldTypeElement}>
							{allColumns.map(
								(column) =>
									column.fieldType &&
									column.fieldType === 'output' && (
										<div key={uuidv4()} className={cssStyles.fieldTypeRow}>
											<input
												type="checkbox"
												checked={tmpColumns.find(
													(currentColumn) => currentColumn === column
												)}
												onChange={() =>
													handleChange(
														column,
														tmpColumns.find(
															(currentColumn) => currentColumn === column
														)
													)
												}
											/>
											{elementTypeToIconMap[column.valueType](column.fieldType)}
											<div className={cssStyles.edit_table_cell_value}>
												{column.name}
											</div>
										</div>
									)
							)}
						</div>
					</Box>
				</Box>
			}
			actions={
				<>
					<StandardButton value="Save view" handleClick={handleSaveChanges} />
					<StandardButton
						value="Close"
						handleClick={() => setOpen(!open)}
						close
					/>
				</>
			}
		/>
	);
};

EditViewModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	allColumns: PropTypes.array,
	currentColumns: PropTypes.array,
	setCurrentColumns: PropTypes.func,
};
