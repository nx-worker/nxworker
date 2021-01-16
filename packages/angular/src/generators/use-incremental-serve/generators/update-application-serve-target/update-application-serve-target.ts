import {
  TargetConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

import { NormalizedSchema } from '../../utils';

const defaultAngularServeExecutor = '@angular-devkit/build-angular:dev-server';
const incrementalServeExecutor = '@nrwl/web:file-server';

export function updateApplicationServeTarget(
  host: Tree,
  { projectConfiguration, projectName }: NormalizedSchema
): void {
  const { targets: executionTargets } = projectConfiguration;
  const { serve: serveTarget } = executionTargets;

  if (!serveTarget) {
    console.warn(
      `Application with project name "${projectName}" does not has an existing "serve" target. Skipping..."`
    );

    return;
  }

  const { executor } = serveTarget;

  if (executor === incrementalServeExecutor) {
    console.info(
      `Application with name "${projectName}" is already set up for incremental serve. Skipping...`
    );

    return;
  }

  if (executor !== defaultAngularServeExecutor) {
    console.error(
      `Unexpected builder/executor "${executor}" for "serve" target of project with name "${projectName}". Skipping..."`
    );

    return;
  }

  const incrementalBuildTarget: TargetConfiguration = {
    ...serveTarget,
    executor: incrementalServeExecutor,
    options: {
      ...(serveTarget.options ?? {}),
    },
  };

  updateProjectConfiguration(host, projectName, {
    ...projectConfiguration,
    targets: {
      ...executionTargets,
      serve: incrementalBuildTarget,
    },
  });
}
