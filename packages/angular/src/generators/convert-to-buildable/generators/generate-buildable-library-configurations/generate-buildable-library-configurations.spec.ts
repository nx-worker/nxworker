import {
  addProjectConfiguration,
  ProjectConfiguration,
  readJson,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as path from 'path';

import { TsconfigBaseJson } from '../../../../file-types';
import { NormalizedSchema, normalizeOptions } from '../../util';
import {
  AngularCompilerOptions,
  BuildableLibraryPackageJson,
  NgPackageJson,
  TsconfigLibProdJson,
} from './file-types';
import { generateBuildableLibraryConfigurations } from './generate-buildable-library-configurations';

describe(generateBuildableLibraryConfigurations.name, () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    projectName = 'shared-ui-buttons';
    importPath = `@nrwl-airlines/shared/ui-buttons`;
    project = {
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

  describe('Package configurations', () => {
    it('generates ng-package.json', async () => {
      const filePath = path.join(project.root, 'ng-package.json');
      const expectedNgPackageJson: NgPackageJson = {
        $schema: '../../../node_modules/ng-packagr/ng-package.schema.json',
        dest: `../../../dist/${project.root}`,
        lib: {
          entryFile: 'src/index.ts',
        },
      };

      await generateBuildableLibraryConfigurations(host, options);

      expect(host.exists(filePath)).toBe(true);
      const actualNgPackageJson: NgPackageJson = readJson(host, filePath);
      expect(actualNgPackageJson).toEqual(expectedNgPackageJson);
    });

    it('generates package.json', async () => {
      const filePath = path.join(project.root, 'package.json');
      const expectedPackageJson: BuildableLibraryPackageJson = {
        name: importPath,
        private: true,
      };

      await generateBuildableLibraryConfigurations(host, options);

      expect(host.exists(filePath)).toBe(true);
      const actualPackageJson: BuildableLibraryPackageJson = readJson(
        host,
        filePath
      );
      expect(actualPackageJson).toEqual(expectedPackageJson);
    });

    it('generates tsconfig.lib.prod.json', async () => {
      const filePath = path.join(project.root, 'tsconfig.lib.prod.json');
      const expectedTsconfig: TsconfigLibProdJson = {
        extends: './tsconfig.lib.json',
        compilerOptions: {
          declarationMap: false,
        },
        angularCompilerOptions: {
          enableIvy: true,
        },
      };

      await generateBuildableLibraryConfigurations(host, options);

      expect(host.exists(filePath)).toBe(true);
      const actualTsconfig: TsconfigLibProdJson = readJson(host, filePath);
      expect(actualTsconfig).toEqual(expectedTsconfig);
    });

    it('keeps package configurations when they all exist', async () => {
      const testConfiguration = { test: true };
      const ngPackageJsonPath = path.join(project.root, 'ng-package.json');
      const packageJsonPath = path.join(project.root, 'package.json');
      const productionTsconfigPath = path.join(
        project.root,
        'tsconfig.lib.prod.json'
      );
      host.write(ngPackageJsonPath, JSON.stringify(testConfiguration));
      host.write(packageJsonPath, JSON.stringify(testConfiguration));
      host.write(productionTsconfigPath, JSON.stringify(testConfiguration));

      await generateBuildableLibraryConfigurations(host, options);

      const ngPackageJson = readJson(host, ngPackageJsonPath);
      const packageJson = readJson(host, packageJsonPath);
      const productionTsconfig = readJson(host, productionTsconfigPath);
      expect(ngPackageJson).toEqual(testConfiguration);
      expect(packageJson).toEqual(testConfiguration);
      expect(productionTsconfig).toEqual(testConfiguration);
    });

    it('overwrites package configurations when only some of them exist', async () => {
      const testConfiguration = { test: true };
      const ngPackageJsonPath = path.join(project.root, 'ng-package.json');
      const packageJsonPath = path.join(project.root, 'package.json');
      host.write(ngPackageJsonPath, JSON.stringify(testConfiguration));
      host.write(packageJsonPath, JSON.stringify(testConfiguration));

      await generateBuildableLibraryConfigurations(host, options);

      const ngPackageJson = readJson(host, ngPackageJsonPath);
      const packageJson = readJson(host, packageJsonPath);
      expect(ngPackageJson).not.toEqual(testConfiguration);
      expect(packageJson).not.toEqual(testConfiguration);
    });
  });

  describe('enableIvy option', () => {
    beforeEach(() => {
      filePath = path.join(project.root, 'tsconfig.lib.prod.json');
    });

    let filePath: string;

    it('sets the enableIvy option to true when true is passed', async () => {
      options = {
        ...options,
        enableIvy: true,
      };
      const expectedAngularCompilerOptions: AngularCompilerOptions = {
        enableIvy: true,
      };

      await generateBuildableLibraryConfigurations(host, options);

      const actualTsconfig: TsconfigLibProdJson = readJson(host, filePath);
      expect(actualTsconfig.angularCompilerOptions).toEqual(
        expectedAngularCompilerOptions
      );
    });

    it('omits the enableIvy option when false is passed', async () => {
      options = {
        ...options,
        enableIvy: false,
      };
      const expectedAngularCompilerOptions: AngularCompilerOptions = {};

      await generateBuildableLibraryConfigurations(host, options);

      const actualTsconfig: TsconfigLibProdJson = readJson(host, filePath);
      expect(actualTsconfig.angularCompilerOptions).toEqual(
        expectedAngularCompilerOptions
      );
    });
  });

  describe('Errors', () => {
    const tsconfigBaseFilePath = 'tsconfig.base.json';

    it('throws an error if tsconfig.base.json is missing', async () => {
      host.delete(tsconfigBaseFilePath);

      const act = () => generateBuildableLibraryConfigurations(host, options);

      await expect(act).rejects.toThrowError(
        `Cannot find ${tsconfigBaseFilePath}`
      );
    });

    it('throws an error if import path is missing', async () => {
      const noPathMap: TsconfigBaseJson = {
        compilerOptions: {},
      };
      host.write(tsconfigBaseFilePath, JSON.stringify(noPathMap));

      const act = () => generateBuildableLibraryConfigurations(host, options);

      await expect(act).rejects.toThrowError(
        `Import path is missing for project with name "${projectName}"`
      );
    });
  });
});
