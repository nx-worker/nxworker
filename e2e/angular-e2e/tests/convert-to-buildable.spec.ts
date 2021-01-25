import { addPackages } from '@internal/e2e-util';
import {
  checkFilesExist,
  copyNodeModules,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import * as path from 'path';

describe('@nxworker/angular:convert-to-buildable generator e2e', () => {
  beforeAll(() => {
    copyNodeModules(['@nrwl/angular', 'ng-packagr']);
    ensureNxProject('@nxworker/angular', 'dist/packages/angular');
    // fixPnpmInstallInCiPipeline();
    addPackages({
      devDependencies: {
        ['@nrwl/angular']: '11.2.0-beta.1',
      },
    });
  });

  beforeEach(async () => {
    projectName = uniq('convert-to-buildable');
    await runNxCommandAsync(`generate @nrwl/angular:library ${projectName}`);
  });

  let projectName: string;

  it('generates buildable library configurations', async () => {
    const configurationFileNames = [
      'ng-package.json',
      'package.json',
      'tsconfig.lib.prod.json',
    ].map(fileName => path.join('libs', projectName, fileName));

    await runNxCommandAsync(
      `generate @nxworker/angular:convert-to-buildable ${projectName}`
    );

    expect(() => checkFilesExist(...configurationFileNames)).not.toThrow();
  });

  it('adds ng-packagr', async () => {
    await runNxCommandAsync(
      `generate @nxworker/angular:convert-to-buildable ${projectName}`
    );

    const { devDependencies = {} } = readJson('package.json');
    expect(devDependencies['ng-packagr']).toBeDefined();
  });

  it('adds a "build" execution target', async () => {
    await runNxCommandAsync(
      `generate @nxworker/angular:convert-to-buildable ${projectName}`
    );

    const result = await runNxCommandAsync(`build ${projectName}`);
    expect(result.stdout).toContain('Built Angular Package');
  });
});
