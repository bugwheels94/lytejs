import { styled } from '@linaria/react';

import { theme } from '../theme';
export const MixinText12 = `
	font-size: ${theme.fonts.size.small};
	color: ${theme.colors.primaryDark};
`;
export const MixinText14 = `
	font-size: ${theme.fonts.size.base};
	color: ${theme.colors.primaryDark};
`;
export const MixinText16 = `
	font-size: ${theme.fonts.size.big};
	color: ${theme.colors.primaryDark};
`;
export const MixinText18 = `
	font-size: ${theme.fonts.size.bigger};
	color: ${theme.colors.primaryDark};
`;
export const MixinText20 = `
	font-size: 2rem;
	color: ${theme.colors.primaryDark};
`;
export const MixinText22 = `
	font-size: 2.2rem;
	color: ${theme.colors.primaryDark};
`;
export const MixinText24 = `
	font-size: 2.4rem;
	color: ${theme.colors.primaryDark};
`;
export const MixinText28 = `
	font-size: 2.8rem;
	color: ${theme.colors.primaryDark};
`;
export const MixinBoldText12 = `
	${MixinText12}
	font-weight: 500;
`;
export const MixinBoldText14 = `
	${MixinText14}
	font-weight: 600;
`;
export const MixinBoldText16 = `
	${MixinText16}
	font-weight: 600;
`;
export const MixinBoldText18 = `
	${MixinText18}
	font-weight: 600;
`;
export const MixinBoldText20 = `
	${MixinText20}
	font-weight: 600;
`;
export const MixinBoldText22 = `
	${MixinText22}
	font-weight: 600;
`;
export const MixinBoldText24 = `
	${MixinText24}
	font-weight: 600;
`;
export const MixinBoldText28 = `
	${MixinText28}
	font-weight: 600;
`;
export const MixinHeading20 = `
	${MixinText20}
	font-family: ${theme.fonts.family.heading};
	font-weight: 500;
`;
export const MixinHeading22 = `
	${MixinText22}
	font-family: ${theme.fonts.family.heading};
	font-weight: 500;
`;
export const MixinHeading24 = `
	${MixinText24}
	font-family: ${theme.fonts.family.heading};
	font-weight: 500;
`;
export const MixinHeading28 = `
	${MixinText28}
	font-family: ${theme.fonts.family.heading};
	font-weight: 500;
`;

export const StyledText12 = styled.span`
	${MixinText12};
	display: inline-block;
`;
export const StyledText14 = styled.span`
	${MixinText14};
	display: inline-block;
`;
export const StyledText16 = styled.span`
	${MixinText16};
	display: inline-block;
`;
export const StyledText18 = styled.span`
	display: inline-block;
	${MixinText18};
`;
export const StyledText20 = styled.span`
	${MixinText20};
	display: inline-block;
`;
export const StyledText22 = styled.span`
	${MixinText22};
	display: inline-block;
`;
export const StyledText24 = styled.span`
	${MixinText24};
	display: inline-block;
`;
export const StyledText28 = styled.span`
	${MixinText28};
	display: inline-block;
`;

export const StyledBoldText12 = styled.strong`
	display: inline-block;
	${MixinBoldText12};
`;
export const StyledBoldText14 = styled.strong`
	${MixinBoldText14};
	display: inline-block;
`;
export const StyledBoldText16 = styled.strong`
	${MixinBoldText16};
	display: inline-block;
`;
export const StyledBoldText18 = styled.strong`
	${MixinBoldText18};
	display: inline-block;
`;
export const StyledBoldText20 = styled.strong`
	${MixinBoldText20};
	display: inline-block;
`;
export const StyledBoldText22 = styled.strong`
	${MixinBoldText22};
	display: inline-block;
`;
export const StyledBoldText24 = styled.strong`
	display: inline-block;
	${MixinBoldText24};
`;
export const StyledBoldText28 = styled.strong`
	display: inline-block;
	${MixinBoldText28};
`;

export const StyledHeading20 = styled.h6`
	${MixinHeading20};
`;
export const StyledHeading22 = styled.h5`
	${MixinHeading22};
`;
export const StyledHeading24 = styled.h5`
	${MixinHeading24};
`;
export const StyledHeading28 = styled.h3`
	${MixinHeading28};
`;

export const StyledParagraph12 = styled.p`
	${MixinText12};
	margin: 0;
`;
export const StyledParagraph14 = styled.p`
	${MixinText14};
	margin: 0;
`;
export const StyledParagraph16 = styled.p`
	${MixinText16};
	margin: 0;
`;
