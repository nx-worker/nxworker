import { readJson, Tree } from '@nrwl/devkit';

export function writeJson<TJson>(
  host: Tree,
  file: string,
  mapper: (json: TJson) => TJson
): void {
  const json = readJson<TJson>(host, file);
  host.write('package.json', JSON.stringify(mapper(json), null, 2));
}
