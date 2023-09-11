import { Router, error } from 'itty-router';
import {
  NpmDownloadsResponse,
  NpmRegistryResponse,
  PepyResponse,
} from './types';

const router = Router();
const routerV1 = Router({ base: '/v1' });
const website = 'https://zielinus.xyz';
const jsonHeader = {
  headers: {
    'Content-Type': 'application/json',
  },
};

router.get('/', () => {
  return new Response('Nothing interesting here...');
});

router.all('/v1/*', routerV1.handle).all('*', () => {
  return Response.redirect(website, 301);
});

routerV1.get('/npm/:name', async ({ params }) => {
  const packageName = decodeURIComponent(params.name);
  const packageData = await fetch(`https://registry.npmjs.org/${packageName}`);

  if (!packageData.ok) {
    return error(404, 'Package not found');
  }

  const packageDataJson = (await packageData.json()) as NpmRegistryResponse;

  const packageDownloads = (await fetch(
    `https://api.npmjs.org/downloads/point/last-month/${packageName}`,
  ).then((data) => data.json())) as NpmDownloadsResponse;

  const data = {
    name: packageDataJson.name,
    version: packageDataJson['dist-tags'].latest,
    downloads: packageDownloads.downloads,
  };

  return new Response(JSON.stringify(data, null, 2), jsonHeader);
});

routerV1.get('/pypi/:name', async ({ params }) => {
  const packageName = decodeURIComponent(params.name);
  const packageData = await fetch(
    `https://api.pepy.tech/api/v2/projects/${packageName}`,
  );

  if (!packageData.ok) {
    return error(404, 'Package not found');
  }

  const packageDataJson = (await packageData.json()) as PepyResponse;

  const data = {
    name: packageDataJson.id,
    version: packageDataJson.versions[packageDataJson.versions.length - 1],
    downloads: packageDataJson.total_downloads,
  };

  return new Response(JSON.stringify(data, null, 2), jsonHeader);
});

addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request));
});
