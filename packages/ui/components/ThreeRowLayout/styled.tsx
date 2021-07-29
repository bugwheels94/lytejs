import { styled } from '@linaria/react';

export const LayoutMixin = {
	Main: `
		overflow: auto;
		display: flex;
		flex-grow: 1;
		flex-direction: column;
	`,
	Header: `
		z-index: 1;
	`,
	Footer: `
		z-index: 1;
	`,
	Body: `
		overflow: auto;
		display: flex;
		flex-grow: 1;
		flex-direction: column;
	`,
};
export const StyledHeader = styled.header`
	${LayoutMixin.Header}
`;
export const StyledFooter = styled.footer`
	${LayoutMixin.Footer}
`;
export const StyledMain = styled.article`
	${LayoutMixin.Main}
`;
export const StyledBody = styled.section`
	${LayoutMixin.Body}
`;
