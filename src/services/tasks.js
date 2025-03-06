// Components
import PhotoIcon from '@mui/icons-material/Photo';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideocamIcon from '@mui/icons-material/Videocam';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HexagonIcon from '@mui/icons-material/Hexagon';

// Consts
import { dataTypeToColorMap } from '../consts/dataTypeToColorMap';

export const elementTypeToIconMap = {
	integer: (type) => (
		<LooksOneIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	boolean: (type) => (
		<LooksOneIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	datetime: (type) => (
		<CalendarMonthIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	float: (type) => (
		<LooksOneIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	text: (type) => (
		<FontDownloadIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	category: (type) => (
		<CategoryIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	generic_file: (type) => (
		<InsertDriveFileIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	document_file: (type) => (
		<InsertDriveFileIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	image_file: (type) => (
		<PhotoIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	video_file: (type) => (
		<VideocamIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	audio_file: (type) => (
		<AudioFileIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	shape: (type) => (
		<HexagonIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
	slice: (type) => (
		<HexagonIcon
			sx={{ fill: dataTypeToColorMap[type], color: dataTypeToColorMap[type] }}
		/>
	),
};

export const dataSelectorToNodeType = {
	input: 'inputs',
	target: 'targets',
	'meta-dat': 'metadata',
	group: 'groups',
};
