import React, { ReactElement } from 'react';
import { StyledFooter, StyledHeader, StyledMain, StyledBody } from './styled';
interface ThreeRowLayout extends React.FC {
	Header: typeof StyledHeader;
	Footer: typeof StyledFooter;
	Body: typeof StyledBody;
}

export const ThreeRowLayout = ({
	children,
	className,
}: {
	children: ReactElement | ReactElement[];
	className?: string;
}): ReactElement => {
	return <StyledMain className={className}>{children}</StyledMain>;
};
ThreeRowLayout.Header = StyledHeader;
ThreeRowLayout.Footer = StyledFooter;
ThreeRowLayout.Body = StyledBody;
// import React, { ReactElement, ReactNode } from 'react';
// import { StyledFooter, StyledHeader, StyledMain, StyledBody } from './styled';

// ThreeRowLayout.Header = ({ children, className }: { children: ReactNode; className?: string }): ReactElement => {
// 	return <StyledHeader className={className}>{children}</StyledHeader>;
// };
// ThreeRowLayout.Footer = ({ children, className }: { children: ReactNode; className?: string }): ReactElement => {
// 	return <StyledFooter className={className}>{children}</StyledFooter>;
// };
// ThreeRowLayout.Body = ({ children, className }: { children: ReactNode | ReactElement[]; className?: string }): ReactElement => {
// 	return <StyledBody className={className}>{children}</StyledBody>;
// };
