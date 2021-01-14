import {
  addProjectConfiguration,
  ProjectConfiguration,
  readProjectConfiguration,
  TargetConfiguration,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { TsconfigBaseJson } from '@nxworker/shared';
import * as path from 'path';

import { NormalizedSchema, normalizeOptions } from '../../util';
import { addLibraryBuildTarget } from './add-library-build-target';

describe(addLibraryBuildTarget.name, () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    projectName = 'seatmap-feature-seat-listing';
    importPath = `@nrwl-airlines/seatmap/feature-seat-listing`;
    project = {
      projectType: 'library',
      root: 'libs/seatmap/feature-seat-listing',
      sourceRoot: 'libs/seatmap/feature-seat-listing/src',
      targets: {
        lint: {
          executor: '@nrwl/linter:eslint',
          options: {
            lintFilePatterns: [
              'libs/seatmap/feature-seat-listing/src/**/*.ts',
              'libs/seatmap/feature-seat-listing/src/**/*.html',
            ],
          },
        },
        test: {
          executor: '@nrwl/jest:jest',
          outputs: ['coverage/libs/seatmap/feature-seat-listing'],
          options: {
            jestConfig: 'libs/seatmap/feature-seat-listing/jest.config.js',
            passWithNoTests: true,
          },
        },
      },
    };
    const tsconfigBase: TsconfigBaseJson = {
      compilerOptions: {
        paths: {
          [importPath]: [`${project.sourceRoot}/index.ts`],
        },
      },
    };

    host.write('tsconfig.base.json', JSON.stringify(tsconfigBase));
    addProjectConfiguration(host, projectName, project);
    options = normalizeOptions(host, {
      project: projectName,
    });
  });

  let host: Tree;
  let importPath: string;
  let options: NormalizedSchema;
  let project: ProjectConfiguration;
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
