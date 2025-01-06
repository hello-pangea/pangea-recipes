import ky, { type Options } from 'ky';

export let api = ky.create({
  prefixUrl: 'http://localhost:3001',
  credentials: 'include',
});

export function updateApiOptions(options: Options) {
  api = api.extend(options);
}
