import { readProjectConfiguration, TargetConfiguration, Tree, updateProjectConfiguration } from '@nrwl/devkit';
import * as path from 'path';

import { NormalizedSchema } from '../../util';

const incrementalBuildExecutor = '@nrwl/angular:ng-packagr-lite';

export function addLibraryBuildTarget(
  host: Tree,
  { projectName, projectRoot }: NormalizedSchema
): void {
  const project = readProjectConfiguration(host, projectName);
  const {
    projectType,
    targets: { build: buildTarget },
  } = project;

  if (projectType !== 'library') {
    console.error(
      `Project with name "${projectName}" is not a library. Skipping..."`
    );

    return;
  }

  let executor: string;

  if (buildTarget) {
    executor = buildTarget.executor;

    if (executor === incrementalBuildExecutor) {
      console.info(
        `Application with name "${projectName}" is already set up for incremental build. Skipping...`
      );

      return;
    }

    console.warn(
      `Library with project name "${projectName}" already has a "build" target. Overwriting..."`
    );
  }

  const incrementalBuildTarget: TargetConfiguration = {
    executor: incrementalBuildExecutor,
    options: {
      tsConfig: path.join(projectRoot, 'tsconfig.lib.json'),
      project: path.join(projectRoot, 'ng-package.json'),
    },
    configurations: {
      production: {
        tsConfig: path.join(projectRoot, 'tsconfig.lib.prod.json'),
      },
    },
  };

  updateProjectConfiguration(host, projectName, {
    ...project,
    targets: {
      ...project.targets,
      build: incrementalBuildTarget,
    },
  });
}
