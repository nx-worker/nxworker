import {
  addProjectConfiguration,
  getWorkspaceLayout,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { joinPath, TsconfigBaseJson } from '@nxworker/shared';

import { createProjectName } from '../util/create-project-name';

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
  const root = joinPath(libsDir, directory, name);
  const sourceRoot = joinPath(libsDir, directory, name, 'src');
  const project: ProjectConfiguration = {
    projectType: 'library',
    root,
    sourceRoot,
    targets: {
      lint: {
        executor: '@nrwl/linter:eslint',
        options: {
          lintFilePatterns: [
            joinPath(sourceRoot, '**', '*.ts'),
            joinPath(sourceRoot, '**', '*.html'),
          ],
        },
      },
      test: {
        executor: '@nrwl/jest:jest',
        outputs: [joinPath('coverage', root)],
        options: {
          jestConfig: joinPath(root, 'jest.config.js'),
          passWithNoTests: true,
        },
      },
    },
  };
  const tsconfigBase: TsconfigBaseJson = {
    compilerOptions: {
      paths: {
        [importPath]: [joinPath(sourceRoot, 'index.ts')],
      },
    },
  };
  const projectName = createProjectName({ directory, name });

  host.write('tsconfig.base.json', JSON.stringify(tsconfigBase));
  addProjectConfiguration(host, projectName, project);
}
