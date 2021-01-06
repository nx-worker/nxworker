import { offsetFromRoot, readProjectConfiguration, Tree } from '@nrwl/devkit';

import { ConvertToBuildableGeneratorSchema } from '../schema';
import { NormalizedSchema } from './normalized-schema';
import { readImportPathOrThrow } from './read-import-path-or-throw';

export function normalizeOptions(
  host: Tree,
  options: ConvertToBuildableGeneratorSchema
): NormalizedSchema {
  const {
    enableIvy = true,
    project: projectName,
    skipFormat = false,
  } = options;
  const { root: projectRoot } = readProjectConfiguration(host, projectName);

  return {
    enableIvy,
    importPath: readImportPathOrThrow(host, {
      projectName,
      projectRoot,
    }),
    offsetFromRoot: offsetFromRoot(projectRoot),
    projectName,
    projectRoot,
    skipFormat,
  };
}
