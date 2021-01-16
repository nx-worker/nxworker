import { Tree } from '@nrwl/devkit';

import { WorkspaceRootPackageJson } from '../../../../file-types';
import { writeJson } from './util/write-json';

export function updateServeScripts(host: Tree): void {
  const incrementalServeCommand = 'nx serve --with-deps --parallel';
  const affectedIncrementalServeCommand =
    'nx affected:serve --with-deps --parallel';
  writeJson<WorkspaceRootPackageJson>(host, 'package.json', packageJson => ({
    ...packageJson,
    scripts: {
      ...packageJson.scripts,
      'affected:serve':
        packageJson.scripts?.['affected:serve']?.replace(
          'nx affected:serve',
          affectedIncrementalServeCommand
        ) ?? affectedIncrementalServeCommand,
      serve:
        packageJson.scripts?.serve?.replace(
          'nx serve',
          incrementalServeCommand
        ) ?? incrementalServeCommand,
    },
  }));
}
