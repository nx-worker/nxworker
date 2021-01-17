// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  addAngularLibrary,
  createProjectName,
  LibraryType,
} from '@internal/test-util';
import {
  ProjectConfiguration,
  readJson,
  readProjectConfiguration,
  TargetConfiguration,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as path from 'path';

import { WorkspaceRootPackageJson } from '../../file-types';
import generator from './generator';

describe('convert-to-buildable generator', () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
    const name = 'feature-flight-search';
    const directory = 'booking';
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
    project = readProjectConfiguration(host, projectName);
  });

  let project: ProjectConfiguration;
  let projectName: string;
  let host: Tree;

  describe('Libraries', () => {
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
        expect(
          host.exists(path.join(project.root, configurationFileName))
        ).toBe(true)
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
});
