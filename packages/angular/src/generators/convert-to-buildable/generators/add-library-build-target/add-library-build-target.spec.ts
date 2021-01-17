// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { addAngularLibrary, createProjectName, LibraryType } from '@internal/test-util';
import { readProjectConfiguration, TargetConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as path from 'path';

import { NormalizedSchema, normalizeOptions } from '../../util';
import { addLibraryBuildTarget } from './add-library-build-target';

describe(addLibraryBuildTarget.name, () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    const name = 'feature-seat-listing';
    const directory = 'seatmap';
    projectName = createProjectName({
      directory,
      name,
    });
    addAngularLibrary(host, {
      directory,
      name,
      npmScope: 'nrwl-airlines',
      type: LibraryType.WorkspaceLibrary,
    });
    options = normalizeOptions(host, {
      project: projectName,
    });
  });

  let host: Tree;
  let options: NormalizedSchema;
  let projectName: string;

  it('adds a build target', () => {
    const expectedBuildTarget: TargetConfiguration = {
      executor: '@nrwl/angular:ng-packagr-lite',
      options: {
        tsConfig: path.join(options.projectRoot, 'tsconfig.lib.json'),
        project: path.join(options.projectRoot, 'ng-package.json'),
      },
      configurations: {
        production: {
          tsConfig: path.join(options.projectRoot, 'tsconfig.lib.prod.json'),
        },
      },
    };

    addLibraryBuildTarget(host, options);

    const {
      targets: { build: actualBuildTarget },
    } = readProjectConfiguration(host, projectName);
    expect(actualBuildTarget).toEqual(expectedBuildTarget);
  });
});
