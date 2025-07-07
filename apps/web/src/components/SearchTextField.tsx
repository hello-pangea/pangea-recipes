import { isSxArray } from '#src/utils/isSxArray';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { InputAdornment, InputBase, type InputProps } from '@mui/material';
import { useState } from 'react';

type Props = Omit<InputProps, 'value' | 'onChange'> & {
  value: string;
  onChange: (search: string) => void;
};

export function SearchTextField({
  value,
  onChange,
  sx = [],
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <InputBase
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
      startAdornment={
        <InputAdornment position="start">
          <SearchRoundedIcon />
        </InputAdornment>
      }
      sx={[
        {
          maxWidth: 800,
          borderRadius: 99,
          backgroundColor: (theme) =>
            focused
              ? theme.vars.palette.background.paper
              : theme.vars.palette.grey[200],
          width: '100%',
          px: 2,
          py: 1,
          boxShadow: focused
            ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            : undefined,
        },
        ...(isSxArray(sx) ? sx : [sx]),
      ]}
      {...inputProps}
    />
  );
}
