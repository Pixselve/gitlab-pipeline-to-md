/**
 * after_script  Override a set of commands that are executed after job.
 * allow_failure  Allow job to fail. A failed job does not cause the pipeline to fail.
 * artifacts  List of files and directories to attach to a job on success.
 * before_script  Override a set of commands that are executed before job.
 * cache  List of files that should be cached between subsequent runs.
 * coverage  Code coverage settings for a given job.
 * dast_configuration  Use configuration from DAST profiles on a job level.
 * dependencies  Restrict which artifacts are passed to a specific job by providing a list of jobs to fetch artifacts from.
 * environment  Name of an environment to which the job deploys.
 * except  Control when jobs are not created.
 * extends  Configuration entries that this job inherits from.
 * image  Use Docker images.
 * inherit  Select which global defaults all jobs inherit.
 * interruptible  Defines if a job can be canceled when made redundant by a newer run.
 * needs  Execute jobs earlier than the stage ordering.
 * only  Control when jobs are created.
 * pages  Upload the result of a job to use with GitLab Pages.
 * parallel  How many instances of a job should be run in parallel.
 * release  Instructs the runner to generate a release object.
 * resource_group  Limit job concurrency.
 * retry  When and how many times a job can be auto-retried in case of a failure.
 * rules  List of conditions to evaluate and determine selected attributes of a job, and whether or not it’s created.
 * script  Shell script that is executed by a runner.
 * secrets  The CI/CD secrets the job needs.
 * services  Use Docker services images.
 * stage  Defines a job stage.
 * tags  List of tags that are used to select a runner.
 * timeout  Define a custom job-level timeout that takes precedence over the project-wide setting.
 * trigger  Defines a downstream pipeline trigger.
 * variables  Define job variables on a job level.
 * when  When to run job.
 */
export enum JobKeywords {
  AFTER_SCRIPT = "after_script",
  ALLOW_FAILURE = "allow_failure",
  ARTIFACTS = "artifacts",
  BEFORE_SCRIPT = "before_script",
  CACHE = "cache",
  COVERAGE = "coverage",
  DAST_CONFIGURATION = "dast_configuration",
  DEPENDENCIES = "dependencies",
  ENVIRONMENT = "environment",
  EXCEPT = "except",
  EXTENDS = "extends",
  IMAGE = "image",
  INHERIT = "inherit",
  INTERRUPTIBLE = "interruptible",
  NEEDS = "needs",
  ONLY = "only",
  PAGES = "pages",
  PARALLEL = "parallel",
  RELEASE = "release",
  RESOURCE_GROUP = "resource_group",
  RETRY = "retry",
  RULES = "rules",
  SCRIPT = "script",
  SECRETS = "secrets",
  SERVICES = "services",
  STAGE = "stage",
  TAGS = "tags",
  TIMEOUT = "timeout",
  TRIGGER = "trigger",
  VARIABLES = "variables",
  WHEN = "when",
}
