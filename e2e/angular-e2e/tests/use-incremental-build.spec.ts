import { addPackages, useDefaultBaseBranch } from '@internal/e2e-util';
import { copyNodeModules, ensureNxProject, runCommandAsync, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';

describe('@nxworker/angular:use-incremental-build generator e2e', () => {
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
    projectName = uniq('use-incremental-build');
    await runNxCommandAsync(
      `generate @nrwl/angular:application ${projectName}`
    );
  });

  let projectName: string;

  it('updates the "build" execution target', async () => {
    await runNxCommandAsync(
      `generate @nxworker/angular:use-incremental-build ${projectName}`
    );

    const result = await runNxCommandAsync(
      `build ${projectName} --parallel --with-deps`
    );
    expect(result.stdout).toContain('Running target "build" succeeded');
  });

  it('updates the "build" script', async () => {
    await runNxCommandAsync(
      `generate @nxworker/angular:use-incremental-build ${projectName}`
    );

    const result = await runCommandAsync(`npm run build -- ${projectName}`);
    expect(result.stdout).toContain('Running target "build" succeeded');
  });

  it('updates the "affected:build" script', async () => {
    await runNxCommandAsync(
      `generate @nxworker/angular:use-incremental-build ${projectName}`
    );

    const result = await runCommandAsync(
      `npm run affected:build -- --base=remotes/origin/main`
    );
    expect(result.stdout).toContain('Running target "build" succeeded');
  });
});
