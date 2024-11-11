import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { pdfjs, Document, Page } from 'react-pdf';
import PropTypes from 'prop-types';

// Components
import { Box, Grid, Pagination } from '@mui/material';

// Styles
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'https://github.com/mozilla/pdfjs-dist/blob/master/build/pdf.worker.min.js',
	import.meta.url
).toString();

export const DocumentFileEditor = (props) => {
	const { cellValue } = props;

	// Global states
	const { documentsBuffer: documentsBufferState } = useSelector(
		(state) => state.examples
	);

	// Local states
	const [documentSelectedNumPages, setDocumentSelectedNumPages] =
		useState(null);
	const [pageSelected, setPageSelected] = useState(1);

	const onDocumentLoadSuccess = ({ numPages }) => {
		setDocumentSelectedNumPages(numPages);
	};

	const changePage = (event, page) => {
		setPageSelected(page);
	};

	return (
		documentsBufferState &&
		documentsBufferState.length > 0 &&
		documentsBufferState.find((element) => element.elementId === cellValue) && (
			<Box>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Box
							sx={{
								mt: '48px',
								display: 'flex',
								backgroundColor: 'white',
								justifyContent: 'center',
								alignItems: 'center',
								height: '60vh',
							}}
						>
							<Document
								file={
									documentsBufferState.find(
										(element) => element.elementId === cellValue
									).url
								}
								onLoadSuccess={onDocumentLoadSuccess}
							>
								<Page
									renderMode="svg"
									renderTextLayer={false}
									renderAnnotationLayer={false}
									pageNumber={pageSelected}
								/>
							</Document>
						</Box>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							mt: '48px',
						}}
					>
						<Pagination
							onChange={changePage}
							count={documentSelectedNumPages}
							size="medium"
						/>
					</Box>
				</Grid>
			</Box>
		)
	);
};

DocumentFileEditor.propTypes = {
	cellValue: PropTypes.any,
};
