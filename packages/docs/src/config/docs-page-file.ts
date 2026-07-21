export function isDocsPageFile(path: string) {
  return /\.(?:mdx|tsx)$/i.test(path);
}

export function isDocsTsxPageFile(path: string) {
  return /\.tsx$/i.test(path);
}

export function docsPageModuleStem(routeFile: string) {
  return routeFile
    .replaceAll('\\', '/')
    .replace(/^.*\//, '')
    .replace(/\.(?:mdx|tsx)$/i, '');
}

export function docsPagePathStem(routeFile: string) {
  return routeFile.replaceAll('\\', '/').replace(/\.(?:mdx|tsx)$/i, '');
}
