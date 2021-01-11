import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
  updateFile,
} from '@nrwl/nx-plugin/testing';

describe('angular e2e', () => {
  beforeEach(() => {
    ensureNxProject('@nxworker/angular', 'dist/packages/angular');
    updateFile('workspace.json', raw => {
      const workspaceJson = JSON.parse(raw);
      const workspaceJsonUsingYarn = {
        ...workspaceJson,
        cli: {
          ...workspaceJson.cli,
          packageManager: 'yarn',
        },
      };

      return JSON.stringify(workspaceJsonUsingYarn, null, 2);
    });
  });

  it('should create angular', async done => {
    const plugin = uniq('angular');
    await runNxCommandAsync(`generate @nxworker/angular:angular ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async done => {
      const plugin = uniq('angular');
      await runNxCommandAsync(
        `generate @nxworker/angular:angular ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async done => {
      const plugin = uniq('angular');
      await runNxCommandAsync(
        `generate @nxworker/angular:angular ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
