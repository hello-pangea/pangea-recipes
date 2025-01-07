import { useUser } from '@clerk/clerk-react';

export function useSignedInUserId() {
  const { user } = useUser();

  if (!user?.publicMetadata.helloRecipesUserId) {
    throw new Error('User does not exist');
  }

  return user.publicMetadata.helloRecipesUserId;
}
