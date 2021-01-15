import { offsetFromRoot, readProjectConfiguration, Tree } from '@nrwl/devkit';

import { ConvertToIncrementalServeGeneratorSchema } from '../schema';
import { NormalizedSchema } from './normalized-schema';

export function normalizeOptions(
  host: Tree,
  {
    enableIvy = true,
    project: projectName,
    skipFormat = false,
  }: ConvertToIncrementalServeGeneratorSchema
): NormalizedSchema {
  const projectConfiguration = readProjectConfiguration(host, projectName);
  const {
    projectType,
    root: projectRoot,
    sourceRoot = `${projectRoot}/src`,
  } = projectConfiguration;

  if (projectType !== 'application') {
    throw new Error(
      `Project with name "${projectName}" is not an application.`
    );
  }

  return {
    enableIvy,
    offsetFromRoot: offsetFromRoot(projectRoot),
    projectConfiguration,
    projectName,
    projectRoot,
    skipFormat,
    sourceRoot,
  };
}
