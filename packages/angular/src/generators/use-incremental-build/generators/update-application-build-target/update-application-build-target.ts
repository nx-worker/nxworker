import { TargetConfiguration, Tree, updateProjectConfiguration } from '@nrwl/devkit';

import { NormalizedSchema } from '../../util';

const defaultAngularBuildExecutor = '@angular-devkit/build-angular:browser';
const incrementalBuildExecutor = '@nrwl/angular:webpack-browser';

export function updateApplicationBuildTarget(
  host: Tree,
  { projectConfiguration, projectName }: NormalizedSchema
): void {
  const { targets: executionTargets } = projectConfiguration;
  const { build: buildTarget } = executionTargets;

  if (!buildTarget) {
    console.warn(
      `Application with project name "${projectName}" does not has an existing "build" target. Skipping..."`
    );

    return;
  }

  const { executor } = buildTarget;

  if (executor === incrementalBuildExecutor) {
    console.info(
      `Application with name "${projectName}" is already set up for incremental build. Skipping...`
    );

    return;
  }

  if (executor !== defaultAngularBuildExecutor) {
    console.error(
      `Unexpected builder/executor "${executor}" for "build" target of project with name "${projectName}". Skipping..."`
    );

    return;
  }

  const incrementalBuildTarget: TargetConfiguration = {
    ...buildTarget,
    executor: incrementalBuildExecutor,
    options: {
      ...(buildTarget.options ?? {}),
      // parallel: true,
      // withDeps: true,
    },
  };

  updateProjectConfiguration(host, projectName, {
    ...projectConfiguration,
    targets: {
      ...executionTargets,
      build: incrementalBuildTarget,
    },
  });
}
