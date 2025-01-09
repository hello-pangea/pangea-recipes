import { type BrowserClerk } from '@clerk/tanstack-start';
import { type User } from '@open-zero/features/users';

declare global {
  interface UserPublicMetadata {
    helloRecipesUserId?: string;
    accessRole?: User['accessRole'];
  }
}

declare global {
  interface Window {
    Clerk?: BrowserClerk;
  }
}
