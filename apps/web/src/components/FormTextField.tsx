import { TextField, type TextFieldProps } from '@mui/material';
import { useSelector } from '@tanstack/react-store';
import { useFieldContext } from '#src/hooks/formContext';

type Props = Omit<
  TextFieldProps,
  'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'error' | 'helperText'
>;

export function FormTextField(props: Props) {
  const field = useFieldContext<string>();

  // oxlint-disable-next-line typescript/no-unsafe-return
  const errors = useSelector(field.store, (state) => state.meta.errors);
  const isValid = useSelector(field.store, (state) => state.meta.isValid);

  return (
    <TextField
      // Force controlled component behavior
      // oxlint-disable-next-line typescript/no-unnecessary-condition
      value={field.state.value ?? ''}
      onChange={(e) => {
        field.handleChange(e.target.value);
      }}
      onBlur={field.handleBlur}
      error={!isValid}
      helperText={
        // oxlint-disable-next-line typescript/no-unsafe-return, typescript/no-unsafe-member-access
        !isValid ? errors.map((e) => e.message).join(', ') : undefined
      }
      {...props}
    />
  );
}
