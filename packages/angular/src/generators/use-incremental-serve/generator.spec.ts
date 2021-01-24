// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addAngularApplication, createProjectName } from '@internal/test-util';
import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';

describe('use-incremental-serve generator', () => {
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

  it('uses the incremental serve executor', async () => {
    const expectedServeExecutor = '@nrwl/web:file-server';

    await generator(host, {
      project: projectName,
    });

    const {
      targets: {
        serve: { executor: actualServeExecutor },
      },
    } = readProjectConfiguration(host, projectName);
    expect(actualServeExecutor).toEqual(expectedServeExecutor);
  });
});
