import { addProjectConfiguration, ProjectConfiguration, readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { TsconfigBaseJson, WorkspaceRootPackageJson } from '../../file-types';
import { addNgPackagr } from './add-ng-packagr';

describe(addNgPackagr.name, () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    project = 'shared-ui-buttons';
    importPath = `@nrwl-airlines/shared/ui-buttons`;
    projectConfiguration = {
      projectType: 'library',
      root: 'libs/shared/ui-buttons',
      sourceRoot: 'libs/shared/ui-buttons/src',
      targets: {
        lint: {
          executor: '@nrwl/linter:eslint',
          options: {
            lintFilePatterns: [
              'libs/shared/ui-buttons/src/**/*.ts',
              'libs/shared/ui-buttons/src/**/*.html',
            ],
          },
        },
        test: {
          executor: '@nrwl/jest:jest',
          outputs: ['coverage/libs/shared/ui-buttons'],
          options: {
            jestConfig: 'libs/shared/ui-buttons/jest.config.js',
            passWithNoTests: true,
          },
        },
      },
    };
    const tsconfigBase: TsconfigBaseJson = {
      compilerOptions: {
        paths: {
          [importPath]: [`${projectConfiguration.sourceRoot}/index.ts`],
        },
      },
    };

    host.write('tsconfig.base.json', JSON.stringify(tsconfigBase));
    addProjectConfiguration(host, project, projectConfiguration);
  });

  let host: Tree;
  let importPath: string;
  let projectConfiguration: ProjectConfiguration;
  let project: string;

  it('installs ng-packagr when not installed', async () => {
    await addNgPackagr(host);

    const { devDependencies = {} } = readJson<WorkspaceRootPackageJson>(
      host,
      'package.json'
    );
    expect(devDependencies['ng-packagr']).toBe('*');
  });

  it('leaves ng-packagr version intact when already installed', async () => {
    const packageJson: WorkspaceRootPackageJson = {
      devDependencies: {
        ['ng-packagr']: '13.37.0',
      },
    };
    host.write('package.json', JSON.stringify(packageJson));

    await addNgPackagr(host);

    const { devDependencies = {} } = readJson<WorkspaceRootPackageJson>(
      host,
      'package.json'
    );
    expect(devDependencies['ng-packagr']).toBe('13.37.0');
  });
});
