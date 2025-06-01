import { useFieldContext } from '#src/hooks/formContext';
import { TextField, type TextFieldProps } from '@mui/material';
import { useStore } from '@tanstack/react-form';

type Props = Omit<
  TextFieldProps,
  'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'error' | 'helperText'
>;

export function FormTextField(props: Props) {
  const field = useFieldContext<string>();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const errors = useStore(field.store, (state) => state.meta.errors);
  const isValid = useStore(field.store, (state) => state.meta.isValid);

  return (
    <TextField
      // Force controlled component behavior
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      value={field.state.value ?? ''}
      onChange={(e) => {
        field.handleChange(e.target.value);
      }}
      onBlur={field.handleBlur}
      error={!isValid}
      helperText={
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        !isValid ? errors.map((e) => e.message).join(', ') : undefined
      }
      {...props}
    />
  );
}
