// Components
import { Tooltip, Zoom, styled, tooltipClasses } from '@mui/material';

export const CustomTooltip = styled(({ className, ...props }) => (
	<Tooltip
		{...props}
		arrow
		TransitionComponent={Zoom}
		TransitionProps={{ timeout: 300 }}
		sx={{
			position: 'absolute',
			top: -10,
		}}
		classes={{ popper: className }}
	/>
))({
	[`& .${tooltipClasses.tooltip}`]: {
		marginTop: '5px !important',
	},
});
