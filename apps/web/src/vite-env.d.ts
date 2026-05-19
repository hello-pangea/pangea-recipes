/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_TAG_ID?: string;
  readonly VITE_GOOGLE_TAG_CONVERSION_DESTINATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
