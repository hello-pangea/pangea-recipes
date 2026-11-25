import { createFormHook } from '@tanstack/react-form';
import { FormTextField } from '#/components/FormTextField';
import { fieldContext, formContext } from './formContext';

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField: FormTextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
