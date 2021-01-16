import { readProjectConfiguration, Tree } from '@nrwl/devkit';

import { UseIncrementalServeGeneratorSchema } from '../schema';
import { NormalizedSchema } from './normalized-schema';

export function normalizeOptions(
  host: Tree,
  {
    project: projectName,
    skipFormat = false,
  }: UseIncrementalServeGeneratorSchema
): NormalizedSchema {
  const projectConfiguration = readProjectConfiguration(host, projectName);

  if (projectConfiguration.projectType !== 'application') {
    throw new Error(
      `Project with name "${projectName}" is not an application.`
    );
  }

  return {
    projectConfiguration,
    projectName,
    skipFormat,
  };
}
