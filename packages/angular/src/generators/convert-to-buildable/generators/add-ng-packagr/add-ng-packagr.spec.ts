// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addAngularLibrary, LibraryType } from '@internal/test-util';
import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { WorkspaceRootPackageJson } from '../../../../file-types';
import { addNgPackagr } from './add-ng-packagr';

describe(addNgPackagr.name, () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    const name = 'ui-buttons';
    const directory = 'shared';
    addAngularLibrary(host, {
      directory,
      name,
      npmScope: 'nrwl-airlines',
      type: LibraryType.WorkspaceLibrary,
    });
  });

  let host: Tree;

  it('installs ng-packagr when not installed', async () => {
    await addNgPackagr(host);

    const { devDependencies = {} } = readJson<WorkspaceRootPackageJson>(
      host,
      'package.json'
    );
    expect(devDependencies['ng-packagr']).toMatch(/\^\d+\.\d+\.\d+/);
  });

  it('leaves ng-packagr version intact when already installed', async () => {
    const packageJson: WorkspaceRootPackageJson = {
      devDependencies: {
        ['ng-packagr']: '13.37.0',
      },
    };
    host.write('package.json', JSON.stringify(packageJson));

    await addNgPackagr(host);

    const { devDependencies = {} } = readJson<WorkspaceRootPackageJson>(
      host,
      'package.json'
    );
    expect(devDependencies['ng-packagr']).toBe('13.37.0');
  });
});
