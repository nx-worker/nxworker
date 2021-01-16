import { formatFiles, Tree } from '@nrwl/devkit';

import { updateApplicationServeTarget } from './generators/update-application-serve-target';
import { updateServeScripts } from '../use-incremental-serve/generators/update-serve-scripts';
import { UseIncrementalServeGeneratorSchema } from './schema';
import { normalizeOptions } from './utils';

export default async function (
  host: Tree,
  schema: UseIncrementalServeGeneratorSchema
): Promise<void> {
  const options = normalizeOptions(host, schema);

  updateApplicationServeTarget(host, options);
  updateServeScripts(host);

  if (!options.skipFormat) {
    await formatFiles(host);
  }
}
