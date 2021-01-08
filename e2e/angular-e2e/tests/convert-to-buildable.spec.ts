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
    copyNodeModules(['@nrwl/angular']);
  });

  beforeEach(async () => {
    ensureNxProject('@nxworker/angular', 'dist/packages/angular');
    projectName = uniq('test-library');
    await runNxCommandAsync(`generate @nrwl/angular:library ${projectName}`);
  }, 30000);

  let projectName: string;

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
  }, 30000);

  it('adds ng-packagr', async done => {
    await runNxCommandAsync(
      `generate @nxworker/angular:convert-to-buildable ${projectName}`
    );

    const { devDependencies = {} } = readJson('package.json');
    expect(devDependencies['ng-packagr']).toBeDefined();
    done();
  }, 30000);
});
