import { addPackages, useDefaultBaseBranch } from '@internal/e2e-util';
import {
  copyNodeModules,
  ensureNxProject,
  runCommandAsync,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('@nxworker/angular:use-incremental-serve generator e2e', () => {
  beforeAll(() => {
    copyNodeModules(['@nrwl/angular']);
    ensureNxProject('@nxworker/angular', 'dist/packages/angular');
    addPackages({
      devDependencies: {
        ['@nrwl/angular']: '11.2.0-beta.1',
      },
    });
    useDefaultBaseBranch('main');
  });

  beforeEach(async () => {
    projectName = uniq('use-incremental-serve');
    await runNxCommandAsync(
      `generate @nrwl/angular:application ${projectName}`
    );
  });

  let projectName: string;

  it('updates the "serve" execution target', async () => {
    await runNxCommandAsync(
      `generate @nxworker/angular:use-incremental-serve ${projectName}`
    );

    const result = await runNxCommandAsync(
      `serve ${projectName} --parallel --with-deps`
    );
    expect(result.stdout).toContain('Running target "serve" succeeded');
  });

  it('updates the "serve" script', async () => {
    await runNxCommandAsync(
      `generate @nxworker/angular:use-incremental-serve ${projectName}`
    );

    const result = await runCommandAsync(`npm run serve -- ${projectName}`);
    expect(result.stdout).toContain('Running target "serve" succeeded');
  });

  it('updates the "affected:serve" script', async () => {
    await runNxCommandAsync(
      `generate @nxworker/angular:use-incremental-serve ${projectName}`
    );

    const result = await runCommandAsync(
      `npm run affected:serve -- --base=remotes/origin/main`
    );
    expect(result.stdout).toContain('Running target "serve" succeeded');
  });
});
