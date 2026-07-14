import { index, type RouteConfig, route } from '@react-router/dev/routes';
import { staticDocumentRoutes } from './content/shared/static-document-routes.js';

const homeRoute = staticDocumentRoutes.find((entry) => entry.path === '/');

if (homeRoute === undefined) throw new Error('Missing homepage document route');

export default [
  index(homeRoute.routeModule),
  ...staticDocumentRoutes
    .filter((entry) => entry.path !== '/')
    .map((entry) =>
      route(entry.path.replace(/^\//, ''), entry.routeModule, { id: entry.id }),
    ),
] satisfies RouteConfig;
