import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { WorkspaceRootPackageJson } from 'packages/angular/src/file-types';

import { updateBuildScripts } from './update-build-scripts';

function readScript(scriptName: string, host: Tree): string {
  const { scripts = {} } = readJson<WorkspaceRootPackageJson>(
    host,
    'package.json'
  );

  return scripts[scriptName];
}

describe(updateBuildScripts.name, () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
  });

  let host: Tree;

  it('adds incremental build parameters to the affected:build script', () => {
    updateBuildScripts(host);

    const affectedBuildScript = readScript('affected:build', host);
    expect(affectedBuildScript).toBe(
      'nx affected:build --with-deps --parallel'
    );
  });

  it('adds incremental build parameters to the build script', () => {
    updateBuildScripts(host);

    const affectedBuildScript = readScript('build', host);
    expect(affectedBuildScript).toBe('nx build --with-deps --parallel');
  });
});
