import { generateFiles, offsetFromRoot, readJson, Tree } from '@nrwl/devkit';
import * as path from 'path';

import { NormalizedSchema } from '../normalized-schema';
import { FileTemplateReplacements, TsconfigBaseJson } from './file-types';

function getImportPathOrThrow(
  host: Tree,
  {
    project,
    projectRoot,
  }: { readonly project: string; readonly projectRoot: string }
): string {
  const tsconfigBaseJson = readJson<TsconfigBaseJson>(
    host,
    'tsconfig.base.json'
  );
  const pathMap = tsconfigBaseJson.compilerOptions.paths ?? {};
  const maybePathEntry = Object.entries(pathMap).find(([, publicApis]) =>
    publicApis.some(publicApi => publicApi.startsWith(projectRoot))
  );

  if (!maybePathEntry) {
    throw new Error(`Import path is missing for project "${project}"`);
  }

  const [importPath] = maybePathEntry;

  return importPath;
}

function hasPackageConfigurations(host: Tree, projectRoot: string): boolean {
  if (!host.exists(path.join(projectRoot, 'ng-package.json'))) {
    return false;
  }

  if (!host.exists(path.join(projectRoot, 'package.json'))) {
    return false;
  }

  if (!host.exists(path.join(projectRoot, 'tsconfig.lib.prod.json'))) {
    return false;
  }

  return true;
}

export async function generatePackageConfigurations(
  host: Tree,
  options: NormalizedSchema
) {
  const replacements: FileTemplateReplacements = {
    enableIvy: options.enableIvy,
    importPath: getImportPathOrThrow(host, {
      project: options.projectName,
      projectRoot: options.projectRoot,
    }),
    offsetFromRoot: options.offsetFromRoot,
    projectRoot: options.projectRoot,
    template: '',
  };

  if (!hasPackageConfigurations(host, options.projectRoot)) {
    generateFiles(
      host,
      path.join(__dirname, '../files'),
      options.projectRoot,
      replacements
    );
  }
}
