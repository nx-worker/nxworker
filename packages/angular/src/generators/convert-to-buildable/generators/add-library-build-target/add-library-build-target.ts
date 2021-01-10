import { readProjectConfiguration, Tree, updateProjectConfiguration } from '@nrwl/devkit';
import * as path from 'path';

import { NormalizedSchema } from '../../util';

export function addLibraryBuildTarget(
  host: Tree,
  { projectName, projectRoot }: NormalizedSchema
): void {
  const project = readProjectConfiguration(host, projectName);

  if (project.targets.build) {
    console.warn(
      `Project with name "${projectName}" already has a "build" target. Overwriting..."`
    );
  }

  updateProjectConfiguration(host, projectName, {
    ...project,
    targets: {
      ...project.targets,
      build: {
        executor: '@nrwl/angular:ng-packagr-lite',
        options: {
          tsConfig: path.join(projectRoot, 'tsconfig.lib.json'),
          project: path.join(projectRoot, 'ng-package.json'),
        },
        configurations: {
          production: {
            tsConfig: path.join(projectRoot, 'tsconfig.lib.prod.json'),
          },
        },
      },
    },
  });
}
