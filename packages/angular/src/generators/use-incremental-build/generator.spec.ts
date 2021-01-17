// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addAngularApplication, createProjectName } from '@internal/test-util';
import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';

describe('convert-to-buildable generator', () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    const name = 'desktop-app';
    const directory = 'booking';
    projectName = createProjectName({
      directory,
      name,
    });
    addAngularApplication(host, {
      directory,
      name,
    });
  });

  let projectName: string;
  let host: Tree;

  it('uses the incremental build executor', async () => {
    const expectedBuildExecutor = '@nrwl/angular:webpack-browser';

    await generator(host, {
      project: projectName,
    });

    const {
      targets: {
        build: { executor: actualBuildExecutor },
      },
    } = readProjectConfiguration(host, projectName);
    expect(actualBuildExecutor).toEqual(expectedBuildExecutor);
  });
});
