import { type UseMutationOptions } from '@tanstack/react-query';

// oxlint-disable-next-line typescript/no-explicit-any
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<FnType>
>;

export type MutationConfig<
  // oxlint-disable-next-line typescript/no-explicit-any
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<ApiFnReturnType<MutationFnType>, Error, Parameters<MutationFnType>[0]>;
