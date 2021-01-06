import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import { addNgPackagr } from './generators/add-ng-packagr';
import { generateBuildableLibraryConfigurations } from './generators/generate-buildable-library-configurations';
import { ConvertToBuildableGeneratorSchema } from './schema';
import { normalizeOptions } from './util';

export default async function (
  host: Tree,
  schema: ConvertToBuildableGeneratorSchema
) {
  const options = normalizeOptions(host, schema);

  await generateBuildableLibraryConfigurations(host, options);
  addNgPackagr(host);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return () => {
    installPackagesTask(host);
  };
}
