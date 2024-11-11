// Components
import { Badge, Box, Grid, Typography } from '@mui/material';
import { pdfjs, Document, Page } from 'react-pdf';
import { Line, LineChart } from 'recharts';
import { Loader } from '../../../../Components/Shared/Loader';

// Styles
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'https://github.com/mozilla/pdfjs-dist/blob/master/build/pdf.worker.min.js',
	import.meta.url
).toString();

export const createCell = {
	integer: ({ cellValue, multiValue }) => {
		if (multiValue === 'time_based' && cellValue.length > 0)
			return (
				<Badge
					badgeContent={cellValue.length}
					color="primary"
					max={999}
					badgeInset="0 -50px 0 0"
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<LineChart width={100} height={40} data={cellValue}>
							<Line
								dataKey={(v) => v}
								stroke="#8884d8"
								strokeWidth={1}
								dot={false}
							/>
						</LineChart>
					</div>
				</Badge>
			);
		if (multiValue && multiValue !== 'time_based' && cellValue.length > 0)
			return (
				<Badge
					badgeContent={cellValue.length}
					color="primary"
					max={999}
					badgeInset="0 -50px 0 0"
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100px',
							height: '40px',
						}}
					>
						{cellValue.join(', ')}
					</div>
				</Badge>
			);
		if (!multiValue && cellValue) return parseFloat(cellValue) || 0.0;
	},
	boolean: ({ classes, cellValue }) => {
		const { rowCell } = classes;
		return (
			<Typography noWrap className={rowCell}>
				{cellValue === '' || cellValue === 'false' ? 'False' : 'True'}
			</Typography>
		);
	},
	datetime: ({ classes, cellValue, multiValue }) => {
		const { rowCell } = classes;

		if (multiValue && cellValue.length > 0) {
			return (
				<Badge
					badgeContent={cellValue.length}
					color="primary"
					max={999}
					badgeInset="0 -50px 0 0"
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
				>
					<Typography noWrap className={rowCell}>
						{cellValue}
					</Typography>
				</Badge>
			);
		}

		return (
			<Typography noWrap className={rowCell}>
				{cellValue}
			</Typography>
		);
	},
	float: ({ cellValue, multiValue }) => {
		if (multiValue === 'time_based' && cellValue.length > 0) {
			return (
				<Badge
					badgeContent={cellValue.length}
					color="primary"
					max={999}
					badgeInset="0 -50px 0 0"
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<LineChart width={100} height={40} data={cellValue}>
							<Line
								dataKey={(v) => v}
								stroke="#8884d8"
								strokeWidth={1}
								dot={false}
							/>
						</LineChart>
					</div>
					;
				</Badge>
			);
		}
		if (multiValue && multiValue !== 'time_based' && cellValue.length > 0) {
			return cellValue.join(', ');
		}
		if (!multiValue && cellValue) return parseFloat(cellValue) || 0.0;
	},

	text: ({ classes, cellValue }) => {
		const { rowCell } = classes;

		return (
			<Typography noWrap className={rowCell}>
				{cellValue}
			</Typography>
		);
	},
	category: ({ classes, cellValue, categoriesState, valueType, params }) => {
		const { rowCell } = classes;

		if (!cellValue) return <Typography noWrap />;

		if (
			categoriesState &&
			categoriesState[valueType] &&
			categoriesState[valueType].length > 0
		) {
			const tmpCats = categoriesState[valueType].find(
				(cat) => cat.name === params.field
			)?.categories;
			const tmpValue = tmpCats.find(
				(cat) => cat.display_name === cellValue || cat.name === cellValue
			);

			if (tmpValue && tmpValue.display_name)
				return (
					<Typography noWrap className={rowCell}>
						{tmpValue.display_name}
					</Typography>
				);
			if (tmpValue && tmpValue.name)
				return (
					<Typography noWrap className={rowCell}>
						{tmpValue.display_name || tmpValue.name}
					</Typography>
				);
		}
		return (
			<Typography noWrap className={rowCell}>
				{cellValue}
			</Typography>
		);
	},
	generic_file: ({ classes }) => {
		const { rowCell } = classes;

		return (
			<Typography noWrap className={rowCell}>
				GenericFile
			</Typography>
		);
	},
	document_file: ({ cellValue, documentsBufferState }) => {
		if (
			documentsBufferState &&
			documentsBufferState.length > 0 &&
			documentsBufferState.find((element) => element.elementId === cellValue)
		) {
			return (
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
					<Document
						file={
							documentsBufferState.find(
								(element) => element.elementId === cellValue
							).url
						}
					>
						<Page
							renderMode="svg"
							renderTextLayer={false}
							renderAnnotationLayer={false}
							pageNumber={1}
						/>
					</Document>
				</Box>
			);
		}
		if (cellValue === undefined) {
			return '';
		}
		return <Loader size="S" />;
	},
	image_file: ({ cellValue, cellName, imagesBufferState, multiValue }) => {
		if (cellValue) {
			return (
				<Grid
					container
					spacing={1}
					sx={{
						padding: '5px',
						display: 'flex',
						flexDirection: 'column',
						height: '70%',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{!multiValue &&
						!Array.isArray(cellValue) &&
						imagesBufferState &&
						imagesBufferState.length > 0 &&
						imagesBufferState.find(
							(element) => element.elementId === cellValue
						) && (
							<img
								src={
									imagesBufferState.find(
										(element) => element.elementId === cellValue
									).thumbnail
								}
								alt={cellName}
								style={{ maxWidth: '100%', maxHeight: '100%' }}
							/>
						)}

					{multiValue &&
						Array.isArray(cellValue) &&
						imagesBufferState &&
						imagesBufferState.length > 0 &&
						imagesBufferState.find((element) =>
							cellValue
								.map((value) => value.thumbnail)
								.includes(element.elementId)
						) && (
							<Badge
								badgeContent={cellValue.length}
								color="primary"
								max={999}
								badgeInset="0 -50px 0 0"
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
							>
								<img
									src={
										imagesBufferState.find((element) =>
											cellValue
												.map((value) => value.thumbnail)
												.includes(element.elementId)
										)[0]?.thumbnail
									}
									alt={cellName}
									style={{ height: '40px' }}
								/>
							</Badge>
						)}
				</Grid>
			);
		}
		if (cellValue === undefined) {
			return '';
		}
		return <Loader size="S" />;
	},
	video_file: ({ classes }) => {
		const { rowCell } = classes;

		return (
			<Typography noWrap className={rowCell}>
				VideoFile
			</Typography>
		);
	},
	audio_file: ({ classes }) => {
		const { rowCell } = classes;

		return (
			<Typography noWrap className={rowCell}>
				AudioFile
			</Typography>
		);
	},
	shape: ({ classes }) => {
		const { rowCell } = classes;

		return (
			<Typography noWrap className={rowCell}>
				Shape
			</Typography>
		);
	},
	slice: ({ classes }) => {
		const { rowCell } = classes;

		return (
			<Typography noWrap className={rowCell}>
				Slice
			</Typography>
		);
	},
};
