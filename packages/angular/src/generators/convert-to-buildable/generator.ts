import { Tree } from '@nrwl/devkit';

import {
  generatePackageConfigurations,
} from './generate-buildable-library-configurations/generate-buildable-library-configurations';
import { normalizeOptions } from './normalize-options';
import { ConvertToBuildableGeneratorSchema } from './schema';

export default async function (
  host: Tree,
  options: ConvertToBuildableGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options);

  await generatePackageConfigurations(host, normalizedOptions);
}
