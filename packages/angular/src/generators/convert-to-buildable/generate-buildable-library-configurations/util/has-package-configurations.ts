import { Tree } from '@nrwl/devkit';
import * as path from 'path';

export function hasPackageConfigurations(
  host: Tree,
  projectRoot: string
): boolean {
  if (!host.exists(path.join(projectRoot, 'ng-package.json'))) {
    return false;
  }

  if (!host.exists(path.join(projectRoot, 'package.json'))) {
    return false;
  }

  if (!host.exists(path.join(projectRoot, 'tsconfig.lib.prod.json'))) {
    return false;
  }

  return true;
}
