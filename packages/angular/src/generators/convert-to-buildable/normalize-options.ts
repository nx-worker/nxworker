import { offsetFromRoot, readProjectConfiguration, Tree } from '@nrwl/devkit';

import { readImportPathOrThrow } from './generate-buildable-library-configurations/util/read-import-path-or-throw';
import { NormalizedSchema } from './normalized-schema';
import { ConvertToBuildableGeneratorSchema } from './schema';

export function normalizeOptions(
  host: Tree,
  options: ConvertToBuildableGeneratorSchema
): NormalizedSchema {
  const {
    enableIvy = true,
    project: projectName,
    skipFormat = false,
  } = options;
  const { sourceRoot: maybeProjectRoot } = readProjectConfiguration(
    host,
    projectName
  );

  if (!maybeProjectRoot) {
    throw new Error(
      `No "sourceRoot" setting for project with name "${projectName}"`
    );
  }

  const projectRoot = maybeProjectRoot;

  return {
    enableIvy,
    importPath: readImportPathOrThrow(host, {
      projectName,
      projectRoot,
    }),
    offsetFromRoot: offsetFromRoot(projectRoot),
    projectName,
    projectRoot,
    skipFormat,
  };
}
