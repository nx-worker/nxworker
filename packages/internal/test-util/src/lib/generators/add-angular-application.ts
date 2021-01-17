import { addProjectConfiguration, getWorkspaceLayout, ProjectConfiguration, Tree } from '@nrwl/devkit';
import * as path from 'path';

import { createProjectName, normalizePath } from '../util';

export interface AddAngularApplicationOptions {
  readonly directory?: string;
  readonly name: string;
}

export function addAngularApplication(
  host: Tree,
  { directory = '', name }: AddAngularApplicationOptions
): void {
  const { appsDir } = getWorkspaceLayout(host);
  const root = normalizePath(path.join(appsDir, directory, name));
  const sourceRoot = normalizePath(path.join(appsDir, directory, name, 'src'));
  const projectName = createProjectName({ directory, name });
  const project: ProjectConfiguration = {
    projectType: 'application',
    root,
    sourceRoot,
    // prefix: 'booking',
    targets: {
      build: {
        executor: '@angular-devkit/build-angular:browser',
        options: {
          outputPath: normalizePath(
            path.join('dist', appsDir, directory, name)
          ),
          index: normalizePath(path.join(sourceRoot, 'index.html')),
          main: normalizePath(path.join(sourceRoot, 'main.ts')),
          polyfills: normalizePath(path.join(sourceRoot, 'polyfills.ts')),
          tsConfig: normalizePath(path.join(root, 'tsconfig.app.json')),
          aot: true,
          assets: [
            normalizePath(path.join(sourceRoot, 'favicon.ico')),
            normalizePath(path.join(sourceRoot, 'assets')),
          ],
          styles: [normalizePath(path.join(sourceRoot, 'styles.scss'))],
          scripts: [],
        },
        configurations: {
          production: {
            fileReplacements: [
              {
                replace: normalizePath(
                  path.join(sourceRoot, 'environments/environment.ts')
                ),
                with: normalizePath(
                  path.join(sourceRoot, 'environments/environment.prod.ts')
                ),
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
          browserTarget: `${projectName}:build`,
        },
        configurations: {
          production: {
            browserTarget: `${projectName}:build:production`,
          },
        },
      },
      'extract-i18n': {
        executor: '@angular-devkit/build-angular:extract-i18n',
        options: {
          browserTarget: `${projectName}:build`,
        },
      },
      lint: {
        executor: '@nrwl/linter:eslint',
        options: {
          lintFilePatterns: [
            normalizePath(path.join(sourceRoot, '**/*.ts')),
            normalizePath(path.join(sourceRoot, '**/*.html')),
          ],
        },
      },
      test: {
        executor: '@nrwl/jest:jest',
        outputs: [
          normalizePath(path.join('coverage', appsDir, directory, name)),
        ],
        options: {
          jestConfig: normalizePath(
            path.join(appsDir, directory, name, 'jest.config.js')
          ),
          passWithNoTests: true,
        },
      },
    },
  };

  addProjectConfiguration(host, projectName, project);
}
