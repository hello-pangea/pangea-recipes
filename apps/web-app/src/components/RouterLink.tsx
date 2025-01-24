import { Link as MuiLink, type LinkProps } from '@mui/material';
import { createLink, type LinkComponent } from '@tanstack/react-router';
import * as React from 'react';

const MUILinkComponent = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, 'href'>
>((props, ref) => {
  return <MuiLink component={'a'} ref={ref} {...props} />;
});
MUILinkComponent.displayName = 'MUILinkComponent';

const CreatedLinkComponent = createLink(MUILinkComponent);

export const RouterLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />;
};
