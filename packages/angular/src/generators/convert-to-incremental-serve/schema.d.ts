export interface ConvertToIncrementalServeGeneratorSchema {
  /**
   * Enable incremental Angular Ivy compilation?
   */
  readonly enableIvy?: boolean;
  /**
   * The name of the project.
   */
  readonly project: string;
  /**
   * Skip formatting files?
   */
  readonly skipFormat?: boolean;
}
