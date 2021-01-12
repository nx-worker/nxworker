import { configurePackageManager, updateJsonFile } from '@internal/e2e-util';
import {
  checkFilesExist,
  copyNodeModules,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  runPackageManagerInstall,
  uniq,
} from '@nrwl/nx-plugin/testing';
import * as path from 'path';

describe('@nxworker/angular:convert-to-buildable generator e2e', () => {
  beforeAll(async () => {
    copyNodeModules(['@nrwl/angular', 'ng-packagr']);
  }, 120_000);

  beforeEach(async () => {
    ensureNxProject('@nxworker/angular', 'dist/packages/angular');
    configurePackageManager('yarn');
    updateJsonFile<any>('package.json', packageJson => ({
      ...packageJson,
      devDependencies: {
        ...packageJson.devDependencies,
        ['@nrwl/angular']: '11.1.1',
      },
    }));
    runPackageManagerInstall();
    await runNxCommandAsync('generate @nrwl/angular:init');
    projectName = uniq('convert-to-buildable');
  });

  let projectName: string;

  describe('Libraries', () => {
    beforeEach(async () => {
      await runNxCommandAsync(`generate @nrwl/angular:library ${projectName}`);
    });

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

  describe('Applications', () => {
    beforeEach(async () => {
      await runNxCommandAsync(
        `generate @nrwl/angular:application ${projectName}`
      );
    });

    it('updates the "build" execution target', async () => {
      await runNxCommandAsync(
        `generate @nxworker/angular:convert-to-buildable ${projectName}`
      );

      const result = await runNxCommandAsync(
        `build ${projectName} --with-deps`
      );
      expect(result.stdout).toContain('Running target "build" succeeded');
    });
  });
});
