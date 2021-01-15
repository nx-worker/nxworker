import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import { normalizeOptions } from '../convert-to-buildable/util';
import { updateApplicationServeTarget } from './generators/update-application-serve-target';
import { ConvertToIncrementalServeGeneratorSchema } from './schema';

export default async function (
  host: Tree,
  schema: ConvertToIncrementalServeGeneratorSchema
): Promise<() => void> {
  const options = normalizeOptions(host, schema);

  updateApplicationServeTarget(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return () => {
    installPackagesTask(host);
  };
}
