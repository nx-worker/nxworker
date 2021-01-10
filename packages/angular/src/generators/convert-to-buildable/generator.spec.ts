import {
  addProjectConfiguration,
  ProjectConfiguration,
  readJson,
  readProjectConfiguration,
  TargetConfiguration,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as path from 'path';

import { TsconfigBaseJson, WorkspaceRootPackageJson } from './file-types';
import generator from './generator';

describe('convert-to-buildable generator', () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    projectName = 'booking-feature-flight-search';
    project = {
      projectType: 'library',
      root: 'libs/booking/feature-flight-search',
      sourceRoot: 'libs/booking/feature-flight-search/src',
      targets: {
        lint: {
          executor: '@nrwl/linter:eslint',
          options: {
            lintFilePatterns: [
              'libs/booking/feature-flight-search/src/**/*.ts',
              'libs/booking/feature-flight-search/**/*.html',
            ],
          },
        },
        test: {
          executor: '@nrwl/jest:jest',
          outputs: ['coverage/libs/booking/feature-flight-search'],
          options: {
            jestConfig: 'libs/booking/feature-flight-search/jest.config.js',
            passWithNoTests: true,
          },
        },
      },
    };
    const tsconfigBase: TsconfigBaseJson = {
      compilerOptions: {
        paths: {
          '@nrwl-airlines/booking/feature-flight-search': [
            path.join(project.sourceRoot ?? '', 'index.ts'),
          ],
        },
      },
    };

    host.write('tsconfig.base.json', JSON.stringify(tsconfigBase));
    addProjectConfiguration(host, projectName, project);
  });

  let project: ProjectConfiguration;
  let projectName: string;
  let host: Tree;

  it('generates buildable library configurations when none of them exist', async () => {
    const configurationFileNames = [
      'ng-package.json',
      'package.json',
      'tsconfig.lib.prod.json',
    ];

    await generator(host, {
      project: projectName,
    });

    configurationFileNames.forEach(configurationFileName =>
      expect(host.exists(path.join(project.root, configurationFileName))).toBe(
        true
      )
    );
  });

  it('adds ng-packagr as a development dependency when not installed', async () => {
    await generator(host, {
      project: projectName,
    });

    const { devDependencies = {} } = readJson<WorkspaceRootPackageJson>(
      host,
      'package.json'
    );
    expect(devDependencies['ng-packagr']).toBeDefined();
  });

  it('adds a build target', async () => {
    const expectedBuildTarget: TargetConfiguration = {
      executor: '@nrwl/angular:ng-packagr-lite',
      options: {
        tsConfig: path.join(project.root, 'tsconfig.lib.json'),
        project: path.join(project.root, 'ng-package.json'),
      },
      configurations: {
        production: {
          tsConfig: path.join(project.root, 'tsconfig.lib.prod.json'),
        },
      },
    };

    await generator(host, {
      project: projectName,
    });

    const {
      targets: { build: actualBuildTarget },
    } = readProjectConfiguration(host, projectName);
    expect(actualBuildTarget).toEqual(expectedBuildTarget);
  });
});
