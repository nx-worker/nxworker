import { configurePackageManager } from '@internal/e2e-util';
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
    copyNodeModules(['ng-packagr']);
  });

  beforeEach(() => {
    ensureNxProject('@nxworker/angular', 'dist/packages/angular');
    configurePackageManager('yarn');
    projectName = uniq('convert-to-buildable');
  });

  let projectName: string;

  describe('Libraries', () => {
    beforeEach(async () => {
      await runNxCommandAsync(`generate @nrwl/angular:library ${projectName}`);
    });

    it('generates buildable library configurations', async done => {
      const configurationFileNames = [
        'ng-package.json',
        'package.json',
        'tsconfig.lib.prod.json',
      ].map(fileName => path.join('libs', projectName, fileName));

      await runNxCommandAsync(
        `generate @nxworker/angular:convert-to-buildable ${projectName}`
      );

      expect(() => checkFilesExist(...configurationFileNames)).not.toThrow();
      done();
    });

    it('adds ng-packagr', async done => {
      await runNxCommandAsync(
        `generate @nxworker/angular:convert-to-buildable ${projectName}`
      );

      const { devDependencies = {} } = readJson('package.json');
      expect(devDependencies['ng-packagr']).toBeDefined();
      done();
    });

    it('adds a "build" execution target', async done => {
      await runNxCommandAsync(
        `generate @nxworker/angular:convert-to-buildable ${projectName}`
      );

      const result = await runNxCommandAsync(`build ${projectName}`);
      expect(result.stdout).toContain('Built Angular Package');
      done();
    });
  });
});
