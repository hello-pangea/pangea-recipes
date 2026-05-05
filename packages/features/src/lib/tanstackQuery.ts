import { type UseMutationOptions } from '@tanstack/react-query';

// oxlint-disable-next-line typescript/no-explicit-any
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<FnType>
>;

export type MutationConfig<
  // oxlint-disable-next-line typescript/no-explicit-any
  MutationFnType extends (...args: any) => Promise<any>,
  // oxlint-disable-next-line typescript/no-unnecessary-type-arguments
> = UseMutationOptions<ApiFnReturnType<MutationFnType>, Error, Parameters<MutationFnType>[0]>;
