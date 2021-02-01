import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import { addLibraryBuildTarget } from './generators/add-library-build-target';
import { addNgPackagr } from './generators/add-ng-packagr';
import { generateBuildableLibraryConfigurations } from './generators/generate-buildable-library-configurations';
import { ConvertToBuildableGeneratorSchema } from './schema';
import { normalizeOptions } from './util';

export default async function (
  host: Tree,
  schema: ConvertToBuildableGeneratorSchema
): Promise<() => void> {
  const options = normalizeOptions(host, schema);

  await generateBuildableLibraryConfigurations(host, options);
  addNgPackagr(host);
  addLibraryBuildTarget(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return () => {
    installPackagesTask(host);
  };
}
