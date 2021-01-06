import { generateFiles, Tree } from '@nrwl/devkit';
import * as path from 'path';

import { NormalizedSchema } from '../normalized-schema';
import { FileTemplateReplacements } from './file-types';
import { hasPackageConfigurations } from './util/has-package-configurations';
import { readImportPathOrThrow } from './util/read-import-path-or-throw';

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
      path.join(__dirname, 'files'),
      projectRoot,
      replacements
    );
  }
}
