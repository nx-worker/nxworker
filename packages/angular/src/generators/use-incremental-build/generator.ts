import { formatFiles, Tree } from '@nrwl/devkit';

import { updateApplicationBuildTarget } from './generators/update-application-build-target';
import { updateBuildScripts } from './generators/update-build-scripts';
import { UseIncrementalBuildGeneratorSchema } from './schema';
import { normalizeOptions } from './util';

export default async function (
  host: Tree,
  schema: UseIncrementalBuildGeneratorSchema
): Promise<void> {
  const options = normalizeOptions(host, schema);

  updateApplicationBuildTarget(host, options);
  updateBuildScripts(host);

  if (!options.skipFormat) {
    await formatFiles(host);
  }
}
