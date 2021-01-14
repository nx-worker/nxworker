import { join } from 'path';

import { normalizePath } from './normalize-path';

export function joinPath(...paths: string[]): string {
  return normalizePath(join(...paths));
}
