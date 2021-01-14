import { getWorkspaceLayout, ProjectConfiguration, Tree } from '@nrwl/devkit';
import * as path from 'path';

export enum LibraryType {
  BuildableLibrary,
  PublishableLibrary,
  WorkspaceLibrary,
}

export interface AddAngularLibraryOptions {
  readonly directory?: string;
  readonly name: string;
  readonly type: LibraryType;
}

export function addAngularLibrary(
  host: Tree,
  { directory = '', name }: AddAngularLibraryOptions
): void {
  const { libsDir } = getWorkspaceLayout(host);
  const root = path.join(libsDir, directory, name);
  const sourceRoot = path.join(libsDir, directory, name, 'src');
  const project: ProjectConfiguration = {
    projectType: 'library',
    root,
    sourceRoot,
    targets: {
      lint: {
        executor: '@nrwl/linter:eslint',
        options: {
          lintFilePatterns: [
            path.join(sourceRoot, '**/*.ts'),
            path.join(sourceRoot, '**/*.html'),
          ],
        },
      },
      test: {
        executor: '@nrwl/jest:jest',
        outputs: [path.join('coverage', root)],
        options: {
          jestConfig: path.join(root, 'jest.config.js'),
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
}
