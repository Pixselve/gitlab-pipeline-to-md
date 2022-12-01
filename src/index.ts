import * as yaml from "js-yaml";
import * as fs from "fs";

import { parse, stringify, parseDocument } from "yaml";

/**
 * default  Custom default values for job keywords.
 * include  Import configuration from other YAML files.
 * stages  The names and order of the pipeline stages.
 * variables  Define CI/CD variables for all job in the pipeline.
 * workflow  Control what types of pipeline run.
 */
enum TopLevelKeywords {
  DEFAULT = "default",
  INCLUDE = "include",
  STAGES = "stages",
  VARIABLES = "variables",
  WORKFLOW = "workflow",
}

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
enum JobKeywords {
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

class Job {
  name: string;
  stage: string = "test";
  scripts: string[] = [];
  image: string | null = null;
  beforeScripts: null | string[] = null;
  afterScripts: null | string[] = null;

  constructor(name: string) {
    this.name = name;
  }

  static fromYaml(name, data: any): Job {
    let job = new Job(name);

    for (const jobKeyword in data) {
      switch (jobKeyword) {
        case JobKeywords.AFTER_SCRIPT:
          job.afterScripts = data[jobKeyword];
          break;
        case JobKeywords.ALLOW_FAILURE:
          break;
        case JobKeywords.ARTIFACTS:
          break;
        case JobKeywords.BEFORE_SCRIPT:
          job.beforeScripts = data[jobKeyword];
          break;
        case JobKeywords.CACHE:
          break;
        case JobKeywords.COVERAGE:
          break;
        case JobKeywords.DAST_CONFIGURATION:
          break;
        case JobKeywords.DEPENDENCIES:
          break;
        case JobKeywords.ENVIRONMENT:
          break;
        case JobKeywords.EXCEPT:
          break;
        case JobKeywords.EXTENDS:
          break;
        case JobKeywords.IMAGE:
          job.image = data[jobKeyword];
          break;
        case JobKeywords.INHERIT:
          break;
        case JobKeywords.INTERRUPTIBLE:
          break;
        case JobKeywords.NEEDS:
          break;
        case JobKeywords.ONLY:
          break;
        case JobKeywords.PAGES:
          break;
        case JobKeywords.PARALLEL:
          break;
        case JobKeywords.RELEASE:
          break;
        case JobKeywords.RESOURCE_GROUP:
          break;
        case JobKeywords.RETRY:
          break;
        case JobKeywords.RULES:
          break;
        case JobKeywords.SCRIPT:
          job.scripts = data[jobKeyword];
          break;
        case JobKeywords.SECRETS:
          break;
        case JobKeywords.SERVICES:
          break;
        case JobKeywords.STAGE:
          job.stage = data[jobKeyword];
          break;
        case JobKeywords.TAGS:
          break;
        case JobKeywords.TIMEOUT:
          break;
        case JobKeywords.TRIGGER:
          break;
        case JobKeywords.VARIABLES:
          break;
        case JobKeywords.WHEN:
          break;
        default:
          break;
      }
    }
    console.log(job);
    return job;
  }

  toMarkdown(): string {
    return `
<details>
<summary><h3>${ this.name }</h3></summary>

${ this.imageToMarkdown() }
${ this.beforeScriptsToMarkdown() }
${ this.scriptsToMarkdown() }
${ this.afterScriptsToMarkdown() }
</details>
`;
  }

  scriptsToMarkdown(): string {
    console.log(this.scripts);
    if (this.scripts.length > 0) {
      return "#### Scripts\n```bash\n" + this.scripts.join("\n") + "\n```";
    }
    return "";
  }

  afterScriptsToMarkdown(): string {
    if (this.afterScripts) {
      return "#### After Scripts\n```bash\n" + this.afterScripts.join("\n") + "\n```";
    }
    return "";
  }

  beforeScriptsToMarkdown(): string {
    if (this.beforeScripts) {
      return "#### Before Scripts\n```bash\n" + this.beforeScripts.join("\n") + "\n```";
    }
    return "";
  }

  imageToMarkdown(): string {
    if (this.image) {
      return `![${ this.image }](https://img.shields.io/badge/image-${ this.image }-brightgreen)`;
    }
    return "";
  }
}

class Stage {
  name: string;
  jobs: Job[];

  constructor(name: string) {
    this.name = name;
    this.jobs = [];
  }

  toMermaid() {
    return `subgraph ${ this.name }_STAGE[${ this.name }]
${ this.jobs.map((job) => job.name).join("\n") }
end`;
  }

  toMarkdown() {
    return `## ⚙️ ${ this.name }
${ this.jobs.map((job) => job.toMarkdown()).join("\n") }`;
  }
}

// Get document, or throw exception on error
try {
  const doc = yaml.load(fs.readFileSync("./exemples/6.yml", "utf8"));
  const result = parseTopDownInstructions(doc);
  // write file to disk
  fs.writeFileSync("./exemples/6.md", result);
} catch (e) {
  console.log(e);
}

function parseTopDownInstructions(data: any): string {
  const keys = Object.keys(data);
  let stageOf = new Map<string, Stage>();
  for (const topLevelKeyword in data) {
    switch (topLevelKeyword) {
      case TopLevelKeywords.DEFAULT:
        break;
      case TopLevelKeywords.INCLUDE:
        break;
      case TopLevelKeywords.STAGES:
        break;
      case TopLevelKeywords.VARIABLES:
        break;
      case TopLevelKeywords.WORKFLOW:
        break;
      default:
        // Job
        const job = Job.fromYaml(topLevelKeyword, data[topLevelKeyword]);
        const stage = stageOf.get(job.stage);
        if (!stage) {
          stageOf.set(job.stage, new Stage(job.stage));
        }
        stageOf.get(job.stage).jobs.push(job);
        break;
    }
  }
  const stages = Array.from(stageOf.values());
  return (
    "# Global Diagram\n" +
    getMermaid(stages) +
    "\n# Stages\n" +
    Array.from(stageOf.values())
      .map((stage) => stage.toMarkdown())
      .join("\n")
  );
}

function getMermaid(stages: Stage[]): string {
  return `\`\`\`mermaid
flowchart LR
${ stages.map((stage) => stage.toMermaid()).join("\n") }
${ getMermaidArrows(stages) }
\`\`\``;
}

function getMermaidArrows(stages: Stage[]): string {
  let arrows = "";
  for (let i = 0; i < stages.length - 1; i++) {
    const stage = stages[i];
    const nextStage = stages[i + 1];
    arrows += `${ stage.name }_STAGE --> ${ nextStage.name }_STAGE
`;
  }
  return arrows;
}
