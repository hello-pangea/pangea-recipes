import { FormTextField } from '#src/components/FormTextField';
import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './formContext';

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField: FormTextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
