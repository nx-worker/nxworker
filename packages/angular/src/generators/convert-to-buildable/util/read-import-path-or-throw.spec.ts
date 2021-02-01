import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { TsconfigBaseJson } from '../../../file-types';
import { readImportPathOrThrow } from './read-import-path-or-throw';

describe(readImportPathOrThrow.name, () => {
  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
  });

  let host: Tree;
  const projectName = 'shared-ui-buttons';
  const sourceRoot = 'libs/shared/ui-buttons';

  it('reads import path when defined in path map', () => {
    const expectedImportPath = '@nrwl-airlines/shared/ui-buttons';
    const tsconfigBase: TsconfigBaseJson = {
      compilerOptions: {
        paths: {
          [expectedImportPath]: [`${sourceRoot}/index.ts`],
        },
      },
    };
    host.write('tsconfig.base.json', JSON.stringify(tsconfigBase));

    const actualImportPath = readImportPathOrThrow(host, {
      projectName,
      sourceRoot,
    });

    expect(actualImportPath).toBe(expectedImportPath);
  });

  it('throws an error when import path is undefined in path map', () => {
    const noPathMap: TsconfigBaseJson = {
      compilerOptions: {
        paths: {},
      },
    };
    host.write('tsconfig.base.json', JSON.stringify(noPathMap));

    const act = () =>
      readImportPathOrThrow(host, {
        projectName,
        sourceRoot,
      });

    expect(act).toThrowError(
      `Import path is missing for project with name "${projectName}"`
    );
  });
});
