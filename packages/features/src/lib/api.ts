import ky, { type Options } from 'ky';

export let api = ky.create({
  prefix: 'http://localhost:3001',
  credentials: 'include',
  hooks: {
    afterResponse: [
      ({ response }) => {
        if (response.status === 204) {
          return new Response(JSON.stringify(null), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return response;
      },
    ],
  },
});

export function updateApiOptions(options: Options) {
  api = api.extend(options);
}
