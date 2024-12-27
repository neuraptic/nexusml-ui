import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';

// Components
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid } from '@mui/material';

// Styles
import styles from './styles';

// Consts
import { colors } from '../../../consts/colors';
import { measures } from '../../../consts/sizes';

const theme = createTheme();

function Navigation() {
	const location = useLocation();

	const navigationArray = location.pathname.split('/').slice(1);

	// Local states
	const { tasks: tasksState } = useSelector((state) => state.tasks);

	const tasksIds = tasksState?.map((task) => task.uuid);

	const getLinkUrl = (element) => {
		const index = navigationArray.indexOf(element);
		let result = '';
		for (let i = 0; i <= index; i += 1) {
			result += `/${navigationArray[i]}`;
		}
		return result;
	};

	return (
		<ThemeProvider theme={theme}>
			<Grid
				container
				component="main"
				id="top-menu"
				style={styles().mainContainer}
				px={{
					xs: 2,
					sm: 4,
					md: measures.mdGeneralMargin,
					lg: measures.lgGeneralMargin,
				}}
				sx={{
					height: { xs: '100px', sm: '48px' },
					mb: '12px',
					alignItems: 'center',
				}}
			>
				<Grid
					item
					xs={12}
					sm={9}
					md={10}
					sx={{
						height: '24px',
						display: 'flex',
						alignItems: 'flex-center',
						flexWrap: 'wrap',
					}}
				>
					{navigationArray.includes('dashboard') ? (
						navigationArray.map((element, index) => {
							if (element !== '') {
								return (
									<div
										style={{
											...styles().navContainer,
											zIndex: `${navigationArray.length - 1} !important`,
										}}
										key={uuidv4()}
									>
										<Link
											style={
												Number(index) === Number(navigationArray.length - 1)
													? {
															...styles().links,
															color: colors.blue,
															fontWeigth: 'bold',
															backgroundColor: colors.ligthBlue,
															zIndex: navigationArray.length - `${index}1`,
													  }
													: {
															...styles().links,
															zIndex: navigationArray.length - `${index}1`,
													  }
											}
											to={getLinkUrl(element)}
										>
											{element.charAt(0).toUpperCase() + element.slice(1)}
										</Link>
										<div
											style={
												Number(index) === Number(navigationArray.length - 1)
													? {
															...styles().arrowRight,
															borderLeftColor: colors.ligthBlue,
															zIndex: navigationArray.length - `${index}2`,
													  }
													: {
															...styles().arrowRight,
															zIndex: navigationArray.length - `${index}2`,
													  }
											}
										/>
										<div
											style={{
												...styles().arrowRightSecondary,
												zIndex: navigationArray.length - `${index}3`,
											}}
										/>
									</div>
								);
							}
							return null;
						})
					) : (
						<>
							<div style={styles().navContainerFirstElement} key={uuidv4()}>
								<Link
									key={uuidv4()}
									to="/dashboard"
									style={{
										...styles().linksFirstElement,
										zIndex: navigationArray.length + 2,
									}}
								>
									Dashboard
								</Link>
								<div
									style={{
										...styles().arrowRightFirstElement,
										zIndex: navigationArray.length + 1,
									}}
								/>
								<div
									style={{
										...styles().arrowRightSecondaryFirstElement,
										zIndex: navigationArray.length,
									}}
								/>
							</div>
							{navigationArray.map((element, index) => {
								if (element !== '') {
									return (
										<div
											style={{
												...styles().navContainer,
												zIndex: `${navigationArray.length - 1} !important`,
											}}
											key={uuidv4()}
										>
											<Link
												style={
													Number(index) === Number(navigationArray.length - 1)
														? {
																...styles().links,
																color: colors.blue,
																fontWeigth: 'bold',
																backgroundColor: colors.ligthBlue,
																zIndex: navigationArray.length - `${index}1`,
														  }
														: {
																...styles().links,
																zIndex: navigationArray.length - `${index}1`,
														  }
												}
												to={getLinkUrl(element)}
											>
												{tasksIds.includes(element)
													? tasksState.find((task) => task.uuid === element)
															.name
													: element.charAt(0).toUpperCase() +
													  element.slice(1).replace(/-/g, ' ')}
											</Link>
											<div
												style={
													Number(index) === Number(navigationArray.length - 1)
														? {
																...styles().arrowRight,
																borderLeftColor: colors.ligthBlue,
																zIndex: navigationArray.length - `${index}2`,
														  }
														: {
																...styles().arrowRight,
																zIndex: navigationArray.length - `${index}2`,
														  }
												}
											/>
											<div
												style={{
													...styles().arrowRightSecondary,
													zIndex: navigationArray.length - `${index}3`,
												}}
											/>
										</div>
									);
								}
								return null;
							})}
						</>
					)}
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}

export default Navigation;
