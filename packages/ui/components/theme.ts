export const themeColors = {
	primaryDark: '#152370',
	primaryLight: '#EFF1FC',
	primaryHighlight: '#8090E7',
	secondaryHighlight: '#CFD5F6',
	primaryButton: '#7335CB',
	textLight: '#4253A9',
	surface: '#FCFCFF',
	surfaceLight: '#fff',
	surfaceDark: '#F7F8FE',
	danger: '#E95432',
	selection: '#12C8B2',
	lightPurple: '#DAC9F1',
	success: '#39C521',
	borderBottomHighligh: '#12c8b2',
	infoYellow: '#fff3d2',
};

export const themeFonts = {
	family: {
		primary: 'Inter',
		styledHeading: 'Lato',
		heading: 'Lato',
	},
	size: {
		extraSmall: '0.8rem',
		evenSmaller: '1rem',
		small: '1.2rem',
		base: '1.4rem',
		big: '1.6rem',
		bigger: '1.8rem',
		giant: '2rem',
		evenBigger: '2.1rem',
		lead: '2.4rem',
		morelead: '2.8rem',
		massive: '3.5rem',
		gigantic: '4.0rem',
		huge: '4.8rem',
	},
	lineHeight: {
		heading: '6.4rem',
		subHeading: '2.4rem',
		pageTitle: '3.2rem',
		small: '1.6rem',
		huge: '6.4rem',
		bigger: '2.4rem',
		lead: '3.2rem',
	},
	weight: {
		base: '400',
		bold: '600',
		heading: '700',
		bolder: '700',
	},
};

export const themeLayouts = {
	margin: {
		small: '1.5rem 0',
		regular: '2.4rem',
		heading: '2.4rem',
		lead: '1.5rem',
		menu: '2.2rem 0',
		formTitle: '0',
	},
	padding: {
		majorButton: '1.6rem 2.4rem',
		input: '1.6rem',
		inputNumber: '1.3rem',
	},
	border: {
		input: `solid 0.1rem`,
	},
	borderRadius: {
		small: '0.4rem',
	},
	zIndex: {
		// antd dropdown is 1050
		header: 1000,
		headerDropdown: 2001,
		modal: 3000,
		drawer: 3000,
		drawerDropdown: 3001,
		dateDropdown: 3002,
	},
};

export const theme = {
	colors: themeColors,
	fonts: themeFonts,
	layouts: themeLayouts,
	borderRadius: '0.4rem',
	borderWidth: '0.2rem',
};
