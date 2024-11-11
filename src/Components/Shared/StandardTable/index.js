import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Components
import {
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// Syles
import { colors } from '../../../consts/colors';
import styles from './styles';

function StandardTable({ tableContent }) {
	// Local states
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
					<TableHead>
						<TableRow
							sx={{ borderBottom: `2px solid ${colors.lightBorderColor}` }}
						>
							{tableContent.titles.map((title) => (
								<TableCell sc={styles().tableTitle}>{title}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{tableContent.rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => (
								<TableRow
									key={uuidv4()}
									sx={{
										'&:last-child td, &:last-child th': {
											border: `0 !important`,
										},
									}}
								>
									<TableCell
										sx={styles().tableContentContainer}
										component="th"
										scope="row"
									>
										<div style={{ display: 'flex', padding: '6px' }}>
											<img
												src={row.logo}
												style={styles().tableContentCompanyLogo}
												alt="companyLogo"
											/>
											<div>
												<div style={styles().tableContentDeploymentName}>
													{row.deploymentName}
												</div>
												<div style={styles().tableContentNameDescription}>
													{row.deploymentDescription}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell sx={styles().tableContent} align="center">
										{row.version}
									</TableCell>
									<TableCell sx={styles().tableContent} align="center">
										{format(row.lastModification, 'Pp', { locale: es })}
									</TableCell>
									<TableCell sx={styles().tableContent} align="center">
										{
											// TODO: review onClick function
										}
										<IconButton>
											<SettingsOutlinedIcon
												sx={{ color: `${colors.blue} !important` }}
											/>
										</IconButton>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={tableContent.rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</>
	);
}

StandardTable.propTypes = {
	tableContent: PropTypes.object,
};

export default StandardTable;
