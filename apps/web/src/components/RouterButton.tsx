import { Button, type ButtonProps } from '@mui/material';
import { createLink, type LinkComponent } from '@tanstack/react-router';
import * as React from 'react';

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, Omit<ButtonProps<'a'>, 'href'>>(
  (props, ref) => {
    return <Button {...props} component={'a'} ref={ref} />;
  },
);
MUILinkComponent.displayName = 'MUILinkComponent';

const CreatedLinkComponent = createLink(MUILinkComponent);

export const RouterButton: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />;
};
