import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import {
  generateBuildableLibraryConfigurations,
} from './generate-buildable-library-configurations/generate-buildable-library-configurations';
import { normalizeOptions } from './normalize-options';
import { ConvertToBuildableGeneratorSchema } from './schema';

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
