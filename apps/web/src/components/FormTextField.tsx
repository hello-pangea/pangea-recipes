import { useFieldContext } from '#src/hooks/formContext';
import { TextField, type TextFieldProps } from '@mui/material';
import { useStore } from '@tanstack/react-form';

type Props = Omit<
  TextFieldProps,
  'defaultValue' | 'onChange' | 'onBlur' | 'error' | 'helperText'
>;

export function FormTextField(props: Props) {
  const field = useFieldContext<string>();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const errors = useStore(field.store, (state) => state.meta.errors);

  const isError = errors.length > 0;

  return (
    <TextField
      defaultValue={props.value !== undefined ? undefined : field.state.value}
      onChange={(e) => {
        field.handleChange(e.target.value);
      }}
      onBlur={field.handleBlur}
      error={isError}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      helperText={isError ? errors.map((e) => e.message).join(', ') : undefined}
      {...props}
    />
  );
}
