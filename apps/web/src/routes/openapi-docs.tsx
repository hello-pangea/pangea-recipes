import '@scalar/api-reference-react/style.css';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/openapi-docs')({
  ssr: false,
});
