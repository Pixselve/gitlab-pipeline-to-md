/**
 * default  Custom default values for job keywords.
 * include  Import configuration from other YAML files.
 * stages  The names and order of the pipeline stages.
 * variables  Define CI/CD variables for all job in the pipeline.
 * workflow  Control what types of pipeline run.
 */
export enum TopLevelKeywords {
  DEFAULT = "default",
  INCLUDE = "include",
  STAGES = "stages",
  VARIABLES = "variables",
  WORKFLOW = "workflow",
}
