export interface UseIncrementalServeGeneratorSchema {
  /**
   * The name of the project.
   */
  readonly project: string;
  /**
   * Skip formatting files?
   */
  readonly skipFormat?: boolean;
}
