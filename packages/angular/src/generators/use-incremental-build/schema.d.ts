export interface UseIncrementalBuildGeneratorSchema {
  /**
   * The name of the project.
   */
  readonly project: string;
  /**
   * Skip formatting files?
   */
  readonly skipFormat?: boolean;
}
