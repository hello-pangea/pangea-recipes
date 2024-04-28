import ky from 'ky';

export let api = ky.create({ prefixUrl: 'http://localhost:3001' });

export function setApi(data: { prefixUrl: string }) {
  api = ky.create(data);
}
