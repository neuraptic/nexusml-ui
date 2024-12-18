/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// Components
import { Avatar, Grid, Tooltip } from '@mui/material';

// Styles
import styles from './styles';

// Consts
import { colors } from '../../../consts/colors';
import { measures } from '../../../consts/sizes';

function PageTitle(props) {
	const { title, task, tabs } = props;

	return (
		<Grid
			item
			xs={12}
			sm={12}
			md={12}
			sx={{
				px: {
					xs: 1,
					sm: 4,
					md: measures.mdGeneralMargin,
					lg: measures.lgGeneralMargin,
				},
				width: '100vw',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: colors.ligtherGray,
				boxShadow: `0px 2px 10px 2px ${colors.gray}, 0px -2px 10px 2px ${colors.gray}`,
			}}
		>
			<div style={styles().pageTitleContainer}>
				<Avatar
					src={task?.icon ? task.icon['download_url'] : ''}
					variant="circle"
				/>
				{title}
			</div>

			{tabs && (
				<div style={styles().tabsContainer}>
					{tabs.tabsArray.map((element) =>
						element.comingSoon ? (
							<Tooltip key={uuidv4()} title="Coming soon">
								<button
									type="button"
									style={
										tabs.currentTab === element.linkTo
											? {
													...styles().tabElement,
													...styles().current,
													color: element.comingSoon && '#afafaf',
											  }
											: {
													...styles().tabElement,
													color: element.comingSoon && '#afafaf',
											  }
									}
								>
									{element.label}
								</button>
							</Tooltip>
						) : (
							<button
								key={uuidv4()}
								type="button"
								onClick={() => tabs.setCurrentTab(element.linkTo)}
								style={
									tabs.currentTab === element.linkTo
										? {
												...styles().tabElement,
												...styles().current,
										  }
										: {
												...styles().tabElement,
										  }
								}
							>
								{element.label}
							</button>
						)
					)}
				</div>
			)}
		</Grid>
	);
}

PageTitle.propTypes = {
	title: PropTypes.string,
	task: PropTypes.object,
	tabs: PropTypes.object,
};

export default PageTitle;
