import { generateFiles, Tree } from '@nrwl/devkit';
import * as path from 'path';

import { NormalizedSchema } from '../normalized-schema';
import { FileTemplateReplacements } from './file-types';
import { readImportPathOrThrow } from './util/read-import-path-or-throw';

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

export async function generateBuildableLibraryConfigurations(
  host: Tree,
  { enableIvy, offsetFromRoot, projectName, projectRoot }: NormalizedSchema
) {
  const replacements: FileTemplateReplacements = {
    enableIvy,
    importPath: readImportPathOrThrow(host, {
      projectName,
      projectRoot,
    }),
    offsetFromRoot,
    projectRoot,
    template: '',
  };

  if (!hasPackageConfigurations(host, projectRoot)) {
    generateFiles(
      host,
      path.join(__dirname, '../files'),
      projectRoot,
      replacements
    );
  }
}
