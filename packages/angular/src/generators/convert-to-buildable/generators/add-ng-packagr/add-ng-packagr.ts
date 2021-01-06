import { readJson, Tree } from '@nrwl/devkit';

import { WorkspaceRootPackageJson } from '../../file-types';

export function addNgPackagr(host: Tree) {
  const packageJsonPath = 'package.json';
  const currentPackageJson: WorkspaceRootPackageJson = readJson(
    host,
    packageJsonPath
  );
  const isNgPackagrInstalled =
    currentPackageJson.devDependencies?.['ng-packagr'] !== undefined;

  if (isNgPackagrInstalled) {
    return;
  }

  const modifiedPackageJson: WorkspaceRootPackageJson = {
    ...currentPackageJson,
    devDependencies: {
      ...currentPackageJson.devDependencies,
      'ng-packagr': '*',
    },
  };

  host.write(packageJsonPath, JSON.stringify(modifiedPackageJson, null, 2));
}
