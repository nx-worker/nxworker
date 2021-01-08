import { checkFilesExist, copyNodeModules, ensureNxProject, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import * as path from 'path';

describe('@nxworker/angular:convert-to-buildable generator e2e', () => {
  beforeAll(() => {
    copyNodeModules(['@nrwl/angular']);
  });

  it('generates buildable library configurations', async done => {
    const projectName = uniq('test-library');
    const configurationFileNames = [
      'ng-package.json',
      'package.json',
      'tsconfig.lib.prod.json',
    ].map(fileName => path.join('libs', projectName, fileName));
    ensureNxProject('@nxworker/angular', 'dist/packages/angular');
    await runNxCommandAsync(`generate @nrwl/angular:library ${projectName}`);

    await runNxCommandAsync(
      `generate @nxworker/angular:convert-to-buildable ${projectName}`
    );

    expect(() => checkFilesExist(...configurationFileNames)).not.toThrow();
    done();
  }, 30000);
});
