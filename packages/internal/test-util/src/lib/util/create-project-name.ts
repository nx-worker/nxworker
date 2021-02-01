export interface CreateProjectNameOptions {
  readonly directory?: string;
  readonly name: string;
}

export function createProjectName({
  directory = '',
  name,
}: CreateProjectNameOptions): string {
  const separator = '-';
  const directoryParts = directory.split(/\/\\/g);

  return [...directoryParts, name].join(separator);
}
