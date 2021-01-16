import { addPackages, fixPnpmInstallInCiPipeline } from '@internal/e2e-util';
import { copyNodeModules, ensureNxProject, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';

describe.skip('@nxworker/angular:use-incremental-build generator e2e', () => {
  beforeAll(() => {
    copyNodeModules(['@nrwl/angular']);
    ensureNxProject('@nxworker/angular', 'dist/packages/angular');
    fixPnpmInstallInCiPipeline();
    addPackages({
      devDependencies: {
        ['@nrwl/angular']: '*',
      },
    });
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

    const result = await runNxCommandAsync(`build ${projectName} --with-deps`);
    expect(result.stdout).toContain('Running target "build" succeeded');
  });
});
