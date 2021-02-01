import { TargetConfiguration, Tree, updateProjectConfiguration } from '@nrwl/devkit';

import { NormalizedSchema } from '../../util';
import { defaultAngularBuildExecutor, incrementalBuildExecutor } from './executors';

export function updateApplicationBuildTarget(
  host: Tree,
  { projectConfiguration, projectName }: NormalizedSchema
): void {
  const { targets } = projectConfiguration;
  const { build: buildTarget } = targets;

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
      // guarded by schema, see https://github.com/nrwl/nx/pull/4548
      // parallel: true,
      // withDeps: true,
    },
  };

  updateProjectConfiguration(host, projectName, {
    ...projectConfiguration,
    targets: {
      ...targets,
      build: incrementalBuildTarget,
    },
  });
}
