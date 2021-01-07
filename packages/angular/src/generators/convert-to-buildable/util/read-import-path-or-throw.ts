import { readJson, Tree } from '@nrwl/devkit';

import { TsconfigBaseJson } from '../file-types';

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
  {
    projectName,
    sourceRoot,
  }: {
    readonly projectName: string;
    readonly sourceRoot: string;
  }
): string {
  const tsconfigBaseJson = readJson<TsconfigBaseJson>(
    host,
    'tsconfig.base.json'
  );
  const pathMap = tsconfigBaseJson.compilerOptions.paths ?? {};

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
