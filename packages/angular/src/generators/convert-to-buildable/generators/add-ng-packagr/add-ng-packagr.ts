import { readJson, Tree } from '@nrwl/devkit';

import { WorkspaceRootPackageJson } from '../../../../file-types';

export function addNgPackagr(host: Tree) {
  const packageJsonPath = 'package.json';
  const currentPackageJson: WorkspaceRootPackageJson = readJson(
    host,
    packageJsonPath
  );
  const { devDependencies = {} } = currentPackageJson;
  const isNgPackagrInstalled = devDependencies['ng-packagr'] !== undefined;

  if (isNgPackagrInstalled) {
    return;
  }

  const modifiedPackageJson: WorkspaceRootPackageJson = {
    ...currentPackageJson,
    devDependencies: {
      ...devDependencies,
      'ng-packagr': '^11.0.3',
    },
  };

  host.write(packageJsonPath, JSON.stringify(modifiedPackageJson, null, 2));
}
