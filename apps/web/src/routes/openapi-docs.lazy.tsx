import { ApiReferenceReact } from '@scalar/api-reference-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import '@scalar/api-reference-react/style.css';
import { config } from '#src/config/config';

export const Route = createLazyFileRoute('/openapi-docs')({
  component: () => (
    <ApiReferenceReact
      configuration={{
        url: `${config.VITE_API_URL}/openapi-spec`,
      }}
    />
  ),
});
