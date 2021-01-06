import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import { generateBuildableLibraryConfigurations } from './generators/generate-buildable-library-configurations';
import { ConvertToBuildableGeneratorSchema } from './schema';
import { normalizeOptions } from './util';

export default async function (
  host: Tree,
  options: ConvertToBuildableGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options);

  await generateBuildableLibraryConfigurations(host, normalizedOptions);
  // installNgPackagr(host);

  if (!normalizedOptions.skipFormat) {
    await formatFiles(host);
  }

  return () => {
    installPackagesTask(host);
  };
}
