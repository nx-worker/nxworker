import { readJson, Tree } from '@nrwl/devkit';

export function addNgPackagr(host: Tree) {
  const packageJsonPath = 'package.json';
  const currentPackageJson = readJson(host, packageJsonPath);
  const isNgPackagrInstalled =
    currentPackageJson.devDependencies?.['ng-packagr'] !== undefined;

  if (isNgPackagrInstalled) {
    // return;
  }

  const modifiedPackageJson = {
    ...currentPackageJson,
    devDependencies: {
      ...currentPackageJson.devDependencies,
      // 'ng-packagr': '^11.0.3',
      '@nrwl/angular': '^11.1.1',
    },
  };

  host.write(packageJsonPath, JSON.stringify(modifiedPackageJson, null, 2));
}
