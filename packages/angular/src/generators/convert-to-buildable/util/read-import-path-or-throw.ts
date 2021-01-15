import { readJson, Tree } from '@nrwl/devkit';
import * as path from 'path';

import { TsconfigBaseJson, TsconfigPathMap } from '../file-types';

export interface ReadImportPathProjectOptions {
  readonly projectName: string;
  readonly sourceRoot: string;
}

/**
 * Find the import path having an entry under the specified source root
 * directory.
 * @throws {Error} Throws an error if `tsconfig.base.json` is missing from the
 *   workspace root or if import path for the specified project is missing from
 *   tsconfig.base.json.
 */
function findPathEntryOrThrow(
  { projectName, sourceRoot }: ReadImportPathProjectOptions,
  pathMap: TsconfigPathMap
): string {
  const maybePathEntry = Object.entries(pathMap).find(([, publicApis]) =>
    publicApis.some(publicApi => publicApi.startsWith(sourceRoot))
  );

  if (!maybePathEntry) {
    throw new Error(
      `Import path is missing for project with name "${projectName}".`
    );
  }

  const [importPath] = maybePathEntry;

  return importPath;
}

/**
 * Normalize the source paths of the specified path map according to operating
 * system.
 */
function normalizePathMap(pathMap: TsconfigPathMap): TsconfigPathMap {
  return Object.entries(pathMap)
    .map(([importPath, sourcePaths]): [string, readonly string[]] => [
      importPath,
      sourcePaths.map(sourcePath => path.normalize(sourcePath)),
    ])
    .reduce(
      (normalizePathMap, [importPath, sourcePaths]) => ({
        ...normalizePathMap,
        [importPath]: sourcePaths,
      }),
      {}
    );
}

/**
 * Get the import path of the specified project.
 *
 * @param host Virtual workspace tree. Must have tsconfig.base.json in the
 *   workspace root directory.
 * @param options Project options.
 * @param options.projectName The name of the project.
 * @param options.projectRoot The root directory of the project.
 * @throws {Error} Throws an error if `tsconfig.base.json` is missing from the
 *   workspace root or if import path for the specified project is missing from
 *   tsconfig.base.json.
 */
export function readImportPathOrThrow(
  host: Tree,
  { projectName, sourceRoot }: ReadImportPathProjectOptions
): string {
  sourceRoot = path.normalize(sourceRoot);
  const tsconfigBaseJson = readJson<TsconfigBaseJson>(
    host,
    'tsconfig.base.json'
  );
  const pathMap = normalizePathMap(
    tsconfigBaseJson.compilerOptions.paths ?? {}
  );

  return findPathEntryOrThrow(
    {
      projectName,
      sourceRoot,
    },
    pathMap
  );
}
