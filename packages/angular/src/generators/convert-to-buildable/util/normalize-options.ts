import { offsetFromRoot, readProjectConfiguration, Tree } from '@nrwl/devkit';

import { ConvertToBuildableGeneratorSchema } from '../schema';
import { NormalizedSchema } from './normalized-schema';
import { readImportPathOrThrow } from './read-import-path-or-throw';

export function normalizeOptions(
  host: Tree,
  {
    enableIvy = true,
    project: projectName,
    skipFormat = false,
  }: ConvertToBuildableGeneratorSchema
): NormalizedSchema {
  const projectConfiguration = readProjectConfiguration(host, projectName);
  const {
    projectType,
    root: projectRoot,
    sourceRoot = `${projectRoot}/src`,
  } = projectConfiguration;

  if (projectType !== 'application' && projectType !== 'library') {
    throw new Error(
      `No project type configured for project with name "${projectName}".`
    );
  }

  return {
    enableIvy,
    importPath: readImportPathOrThrow(host, {
      projectName,
      sourceRoot,
    }),
    offsetFromRoot: offsetFromRoot(projectRoot),
    projectConfiguration,
    projectName,
    projectRoot,
    projectType,
    skipFormat,
    sourceRoot,
  };
}
