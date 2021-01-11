import { WorkspaceConfiguration as NxWorkspaceConfiguration } from '@nrwl/devkit';
import {
  checkFilesExist,
  copyNodeModules,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
  updateFile,
} from '@nrwl/nx-plugin/testing';
import * as path from 'path';

interface WorkspaceConfiguration extends NxWorkspaceConfiguration {
  cli?: {
    defaultCollection: string;
    packageManager: 'npm' | 'pnpm' | 'yarn';
  };
}

describe('@nxworker/angular:convert-to-buildable generator e2e', () => {
  beforeAll(() => {
    copyNodeModules(['ng-packagr']);
  });

  beforeEach(async () => {
    ensureNxProject('@nxworker/angular', 'dist/packages/angular');
    updateFile('workspace.json', raw => {
      const workspaceJson: WorkspaceConfiguration = JSON.parse(raw);
      const defaultCollection =
        workspaceJson.cli?.defaultCollection ?? '@nrwl/angular';
      const workspaceJsonUsingYarn: WorkspaceConfiguration = {
        ...workspaceJson,
        cli: {
          defaultCollection,
          packageManager: 'yarn',
        },
      };

      return JSON.stringify(workspaceJsonUsingYarn, null, 2);
    });
    projectName = uniq('test-library');
    await runNxCommandAsync(`generate @nrwl/angular:library ${projectName}`);
  });

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
  });

  it('adds ng-packagr', async done => {
    await runNxCommandAsync(
      `generate @nxworker/angular:convert-to-buildable ${projectName}`
    );

    const { devDependencies = {} } = readJson('package.json');
    expect(devDependencies['ng-packagr']).toBeDefined();
    done();
  });
});
