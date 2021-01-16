import { Tree } from '@nrwl/devkit';

import { WorkspaceRootPackageJson } from '../../../../file-types';
import { writeJson } from './util/write-json';

export function updateBuildScripts(host: Tree): void {
  const incrementalBuildCommand = 'nx build --with-deps --parallel';
  const affectedIncrementalBuildCommand =
    'nx affected:build --with-deps --parallel';
  writeJson<WorkspaceRootPackageJson>(host, 'package.json', packageJson => ({
    ...packageJson,
    scripts: {
      ...packageJson.scripts,
      'affected:build':
        packageJson.scripts['affected:build']?.replace(
          'nx affected:build',
          affectedIncrementalBuildCommand
        ) ?? affectedIncrementalBuildCommand,
      build:
        packageJson.scripts.build?.replace(
          'nx build',
          incrementalBuildCommand
        ) ?? incrementalBuildCommand,
    },
  }));
}
