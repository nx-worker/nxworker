import { addProjectConfiguration, ProjectConfiguration, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';

describe('convert-to-buildable generator', () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    projectName = 'booking-desktop-app';
    project = {
      projectType: 'application',
      root: 'apps/booking/desktop-app',
      sourceRoot: 'apps/booking/desktop-app/src',
      // prefix: 'booking',
      targets: {
        build: {
          executor: '@angular-devkit/build-angular:browser',
          options: {
            outputPath: 'dist/apps/booking/desktop-app',
            index: 'apps/booking/desktop-app/src/index.html',
            main: 'apps/booking/desktop-app/src/main.ts',
            polyfills: 'apps/booking/desktop-app/src/polyfills.ts',
            tsConfig: 'apps/booking/desktop-app/tsconfig.app.json',
            aot: true,
            assets: [
              'apps/booking/desktop-app/src/favicon.ico',
              'apps/booking/desktop-app/src/assets',
            ],
            styles: ['apps/booking/desktop-app/src/styles.scss'],
            scripts: [],
          },
          configurations: {
            production: {
              fileReplacements: [
                {
                  replace:
                    'apps/booking/desktop-app/src/environments/environment.ts',
                  with:
                    'apps/booking/desktop-app/src/environments/environment.prod.ts',
                },
              ],
              optimization: true,
              outputHashing: 'all',
              sourceMap: false,
              namedChunks: false,
              extractLicenses: true,
              vendorChunk: false,
              buildOptimizer: true,
              budgets: [
                {
                  type: 'initial',
                  maximumWarning: '2mb',
                  maximumError: '5mb',
                },
                {
                  type: 'anyComponentStyle',
                  maximumWarning: '6kb',
                  maximumError: '10kb',
                },
              ],
            },
          },
        },
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
        'extract-i18n': {
          executor: '@angular-devkit/build-angular:extract-i18n',
          options: {
            browserTarget: 'booking-desktop-app:build',
          },
        },
        lint: {
          executor: '@nrwl/linter:eslint',
          options: {
            lintFilePatterns: [
              'apps/booking/desktop-app/src/**/*.ts',
              'apps/booking/desktop-app/src/**/*.html',
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
