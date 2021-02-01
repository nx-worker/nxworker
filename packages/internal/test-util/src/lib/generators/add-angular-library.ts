import {
  addProjectConfiguration,
  getWorkspaceLayout,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';

import { TsconfigBaseJson } from '../file-types';
import { createProjectName, normalizePath } from '../util';

export enum LibraryType {
  BuildableLibrary,
  PublishableLibrary,
  WorkspaceLibrary,
}

export interface AddAngularLibraryOptions {
  readonly directory?: string;
  readonly name: string;
  readonly npmScope?: string;
  readonly type: LibraryType;
}

export function addAngularLibrary(
  host: Tree,
  { directory = '', name, npmScope }: AddAngularLibraryOptions
): void {
  const { libsDir, npmScope: defaultNpmScope } = getWorkspaceLayout(host);
  npmScope ??= defaultNpmScope;
  const importPath = `@${npmScope}/${directory}/${name}`;
  const root = normalizePath(path.join(libsDir, directory, name));
  const sourceRoot = normalizePath(path.join(libsDir, directory, name, 'src'));
  const project: ProjectConfiguration = {
    projectType: 'library',
    root,
    sourceRoot,
    targets: {
      lint: {
        executor: '@nrwl/linter:eslint',
        options: {
          lintFilePatterns: [
            normalizePath(path.join(sourceRoot, '**', '*.ts')),
            normalizePath(path.join(sourceRoot, '**', '*.html')),
          ],
        },
      },
      test: {
        executor: '@nrwl/jest:jest',
        outputs: [normalizePath(path.join('coverage', root))],
        options: {
          jestConfig: normalizePath(path.join(root, 'jest.config.js')),
          passWithNoTests: true,
        },
      },
    },
  };
  const tsconfigBase: TsconfigBaseJson = {
    compilerOptions: {
      paths: {
        [importPath]: [normalizePath(path.join(sourceRoot, 'index.ts'))],
      },
    },
  };
  const projectName = createProjectName({ directory, name });

  host.write('tsconfig.base.json', JSON.stringify(tsconfigBase));
  addProjectConfiguration(host, projectName, project);
}
