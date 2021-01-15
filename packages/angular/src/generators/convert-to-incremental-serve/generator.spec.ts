import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  Tree,
  readProjectConfiguration,
  addProjectConfiguration,
  ProjectConfiguration,
  TargetConfiguration,
} from '@nrwl/devkit';

import generator from './generator';

describe('convert-to-incremental-serve generator', () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    projectName = 'booking-desktop-app';
    project = {
      projectType: 'application',
      root: 'apps/booking/desktop-app',
      sourceRoot: 'apps/booking/desktop-app/src',
      targets: {
        serve: {
          executor: '@angular-devkit/build-angular:dev-server',
          options: {
            browserTarget: 'booking-desktop-app:build',
          },
          configurations: {
            production: {
              browserTarget: 'booking-desktop-app:build:production',
            },
          },
        },
        lint: {
          executor: '@nrwl/linter:eslint',
          options: {
            lintFilePatterns: [
              'apps/booking/desktop-app/src/**/*.ts',
              'apps/booking/desktop-app/**/*.html',
            ],
          },
        },
        test: {
          executor: '@nrwl/jest:jest',
          outputs: ['coverage/apps/booking/desktop-app'],
          options: {
            jestConfig: 'apps/booking/desktop-app/jest.config.js',
            passWithNoTests: true,
          },
        },
      },
    };

    addProjectConfiguration(host, projectName, project);
  });

  let project: ProjectConfiguration;
  let projectName: string;
  let host: Tree;

  it('updates the serve target', async () => {
    const expectedServeTarget: TargetConfiguration = {
      executor: '@nrwl/web:file-server',
      options: {
        browserTarget: 'booking-desktop-app:build',
        parallel: true,
        withDeps: true,
      },
      configurations: {
        production: {
          browserTarget: 'booking-desktop-app:build:production',
        },
      },
    };

    await generator(host, {
      project: projectName,
    });

    const {
      targets: { serve: actualServeTarget },
    } = readProjectConfiguration(host, projectName);
    expect(actualServeTarget).toEqual(expectedServeTarget);
  });
});
