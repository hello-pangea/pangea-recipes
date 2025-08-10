import { config } from '#src/config/config';
import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/openapi-docs')({
  component: () => (
    <ApiReferenceReact
      configuration={{
        url: `${config.VITE_API_URL}/openapi-spec`,
      }}
    />
  ),
});
