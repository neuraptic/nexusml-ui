import { Input, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const getElementType = {
	GenericFile: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>GenericFile</Typography>;
	},
	ImageFile: (classes, cellValue, cellName) => {
		const { ImageFile } = classes;

		return (
			<div className={ImageFile}>
				<div>{cellName}</div>
				<div
					style={{
						backgroundImage: `url(${cellValue})`,
					}}
				>
					&nbsp;
				</div>
			</div>
		);
	},
	Char: (classes, cellValue) => {
		const { Char } = classes;

		return <Input className={Char} value={cellValue} />;
	},
	JSON: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>JSON</Typography>;
	},
	GenericIPAddress: (classes, cellValue) => {
		const { GenericIPAddress } = classes;

		return <Input className={GenericIPAddress} value={cellValue} />;
	},
	URL: (classes, cellValue) => {
		const { URL } = classes;

		return <Input className={URL} value={cellValue} />;
	},
	AudioFile: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>AudioFile</Typography>;
	},
	VideoFile: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>VideoFile</Typography>;
	},
	Text: (classes, cellValue) => {
		const { Text } = classes;

		return <Input className={Text} value={cellValue} />;
	},
	Email: (classes, cellValue) => {
		const { Email } = classes;

		return <Input className={Email} value={cellValue} />;
	},
	Integer: (classes, cellValue) => {
		const { Integer } = classes;

		return <Input className={Integer} value={cellValue} />;
	},
	Float: (classes, cellValue) => {
		const { Float } = classes;

		return <Input className={Float} value={cellValue} />;
	},
	SmallInteger: (classes, cellValue) => {
		const { SmallInteger } = classes;

		return <Input className={SmallInteger} value={cellValue} />;
	},
	BigInteger: (classes, cellValue) => {
		const { BigInteger } = classes;

		return <Input className={BigInteger} value={cellValue} />;
	},
	Binary: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>Binary</Typography>;
	},
	Slug: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>Slug</Typography>;
	},
	Decimal: (classes, cellValue) => {
		const { Decimal } = classes;

		return <Input className={Decimal} value={cellValue} />;
	},
	PositiveBigInteger: (classes, cellValue) => {
		const { PositiveBigInteger } = classes;

		return <Input className={PositiveBigInteger} value={cellValue} />;
	},
	PositiveInteger: (classes, cellValue) => {
		const { PositiveInteger } = classes;

		return <Input className={PositiveInteger} value={cellValue} />;
	},
	PositiveSmallInteger: (classes, cellValue) => {
		const { PositiveSmallInteger } = classes;

		return <Input className={PositiveSmallInteger} value={cellValue} />;
	},
	Boolean: (classes, cellValue) => {
		const { Boolean } = classes;

		return <Input className={Boolean} value={cellValue} />;
	},
	Category: (classes, cellValue) => {
		const { Category } = classes;

		return (
			<Select id="Category" className={Category}>
				<MenuItem value="">
					<em>{cellValue}</em>
				</MenuItem>
				<MenuItem value="">
					<em>{cellValue}</em>
				</MenuItem>
				<MenuItem value="">
					<em>{cellValue}</em>
				</MenuItem>
			</Select>
		);
	},
	Date: () => (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				className={Date}
				views={['day']}
				value="2022-04-07"
				renderInput={(params) => <TextField {...params} helperText={null} />}
			/>
		</LocalizationProvider>
	),
	DateTime: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>DateTime</Typography>;
	},
	Time: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>Time</Typography>;
	},
	Duration: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>Duration</Typography>;
	},
	Shape: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>Shape</Typography>;
	},
	null: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>null</Typography>;
	},
	undefined: (classes) => {
		const { rowCell } = classes;

		return <Typography className={rowCell}>undefined</Typography>;
	},
};
