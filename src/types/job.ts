import { JobConfig } from "./jobConfig";
import { Retry, retrySchema } from "./retry";
import { JobKeywords } from "./jobKeywords";
import Artifacts from "./artifacts";
import { CacheClass } from "./cache";
import { Rules } from "./rules";
import { getScriptAsAnArray, scriptSchema } from "./scripts";
import { getImageBadge, Image, imageSchema } from "./image";
import { getVariablesTable, Variables, variablesSchema } from "./variables";

export class Job {
  name: string;
  stage: string = "test";
  image: Image | null = null;
  beforeScripts: null | string[] = null;

  scripts: null | string[] = null;

  afterScripts: null | string[] = null;
  settings: JobConfig[] = [];
  retry: Retry | null = null;
  variables: Variables | null = null;

  constructor(name: string) {
    this.name = name;
  }

  static fromYaml(name, data: any): Job {
    let job = new Job(name);

    for (const jobKeyword in data) {
      switch (jobKeyword) {
        case JobKeywords.AFTER_SCRIPT:
          job.afterScripts = getScriptAsAnArray(scriptSchema.parse(data[jobKeyword]));
          break;
        case JobKeywords.ALLOW_FAILURE:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.ARTIFACTS:
          job.settings.push(new Artifacts(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.BEFORE_SCRIPT:
          job.beforeScripts = getScriptAsAnArray(scriptSchema.parse(data[jobKeyword]));
          break;
        case JobKeywords.CACHE:
          job.settings.push(new CacheClass(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.COVERAGE:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.DAST_CONFIGURATION:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.DEPENDENCIES:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.ENVIRONMENT:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.EXCEPT:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.EXTENDS:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.IMAGE:
          job.image = imageSchema.parse(data[jobKeyword]);
          break;
        case JobKeywords.INHERIT:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.INTERRUPTIBLE:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.NEEDS:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.ONLY:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.PAGES:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.PARALLEL:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.RELEASE:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.RESOURCE_GROUP:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.RETRY:
          job.retry = retrySchema.parse(data[jobKeyword]);
          break;
        case JobKeywords.RULES:
          job.settings.push(new Rules(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.SCRIPT:
          job.scripts = getScriptAsAnArray(scriptSchema.parse(data[jobKeyword]));
          break;
        case JobKeywords.SECRETS:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.SERVICES:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.STAGE:
          job.stage = data[jobKeyword];
          break;
        case JobKeywords.TAGS:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.TIMEOUT:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.TRIGGER:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        case JobKeywords.VARIABLES:
          job.variables = variablesSchema.parse(data[jobKeyword]);
          break;
        case JobKeywords.WHEN:
          job.settings.push(new JobConfig(jobKeyword, data[jobKeyword]));
          break;
        default:
          break;
      }
    }
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
${ this.variablesToMarkdown() }
${ this.settings.map((value) => value.markdown).join("\n") }
</details>
`;
  }

  afterScriptsToMarkdown(): string {
    if (this.afterScripts) {
      return (
        "#### After Scripts\n```bash\n" + this.afterScripts.join("\n") + "\n```"
      );
    }
    return "";
  }

  beforeScriptsToMarkdown(): string {
    if (this.beforeScripts) {
      return (
        "#### Before Scripts\n```bash\n" +
        this.beforeScripts.join("\n") +
        "\n```"
      );
    }
    return "";
  }

  variablesToMarkdown(): string {
    if (this.variables) {
      return (
        `#### Variables\n
        ${getVariablesTable(this.variables)}`
      );
    }
    return "";
  }

  scriptsToMarkdown(): string {
    if (this.scripts) {
      return "#### Scripts\n```bash\n" + this.scripts.join("\n") + "\n```";
    }
    return "";
  }

  imageToMarkdown(): string {
    if (this.image) {
      return getImageBadge(this.image);
    }
    return "";
  }
}
