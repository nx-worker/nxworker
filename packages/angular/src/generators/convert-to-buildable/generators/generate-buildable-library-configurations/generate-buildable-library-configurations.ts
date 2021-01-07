import { generateFiles, Tree } from '@nrwl/devkit';
import * as path from 'path';

import { NormalizedSchema, readImportPathOrThrow } from '../../util';
import { FileTemplateReplacements } from './file-types';
import { hasPackageConfigurations } from './util/has-package-configurations';

export async function generateBuildableLibraryConfigurations(
  host: Tree,
  {
    enableIvy,
    offsetFromRoot,
    projectName,
    projectRoot,
    sourceRoot,
  }: NormalizedSchema
) {
  const replacements: FileTemplateReplacements = {
    enableIvy,
    importPath: readImportPathOrThrow(host, {
      projectName,
      sourceRoot,
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
