import { Button, type ButtonProps } from '@mui/material';
import { createLink, type LinkComponent } from '@tanstack/react-router';
import * as React from 'react';

const MUILinkComponent = React.forwardRef<
  HTMLAnchorElement,
  Omit<ButtonProps, 'href'>
>((props, ref) => {
  return <Button component={'a'} ref={ref} {...props} />;
});
MUILinkComponent.displayName = 'MUILinkComponent';

const CreatedLinkComponent = createLink(MUILinkComponent);

export const RouterButton: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />;
};
