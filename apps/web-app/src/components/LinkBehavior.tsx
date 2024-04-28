import React from 'react';
import type { LinkProps } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

export const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, 'to'> & { href: LinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

LinkBehavior.displayName = 'LinkBehavior';
