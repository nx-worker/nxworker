import { offsetFromRoot, readProjectConfiguration, Tree } from '@nrwl/devkit';

import { ConvertToBuildableGeneratorSchema } from '../schema';
import { NormalizedSchema } from './normalized-schema';
import { readImportPathOrThrow } from './read-import-path-or-throw';

export function normalizeOptions(
  host: Tree,
  {
    enableIvy = true,
    project: projectName,
    skipFormat = false,
  }: ConvertToBuildableGeneratorSchema
): NormalizedSchema {
  const {
    root: projectRoot,
    sourceRoot: maybeSourceRoot,
  } = readProjectConfiguration(host, projectName);

  if (!maybeSourceRoot) {
    throw new Error(
      `No "sourceRoot" option for project with name "${projectName}"`
    );
  }

  const sourceRoot = maybeSourceRoot;

  return {
    enableIvy,
    importPath: readImportPathOrThrow(host, {
      projectName,
      sourceRoot,
    }),
    offsetFromRoot: offsetFromRoot(projectRoot),
    projectName,
    projectRoot,
    skipFormat,
    sourceRoot,
  };
}
