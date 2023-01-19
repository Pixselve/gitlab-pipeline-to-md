import * as yaml from "js-yaml";
import * as fs from "fs";
import { TopLevelKeywords } from "./types/topLevelKeywords";
import { JobConfig } from "./types/jobConfig";
import { DefaultConfig } from "./types/defaultConfig";
import { program } from "commander";
import { getMermaid } from "./utils/mermaid";
import { Job } from "./types/job";
import { getIncludeTable, Include, includeSchema } from "./types/include";
import { Workflow, workflowSchema } from "./types/workflow";
import { Rules } from "./types/rules";
import {
  getVariablesTable,
  Variables,
  variablesSchema,
} from "./types/variables";

export type Recursion = Record<
  string,
  string | string[] | RecordInterface | RecordInterface[]
>;

export interface RecordInterface extends Record<string, Recursion> {}

export class Stage {
  name: string;
  jobs: Job[];

  constructor(name: string) {
    this.name = name;
    this.jobs = [];
  }

  toMermaid() {
    return `subgraph ${this.name.replaceAll(" ", "_")}_STAGE[${this.name}]
${this.jobs
  .map((job) => `${job.name.replaceAll(" ", "_")}[${job.name}]`)
  .join("\n")}
end`;
  }

  toMarkdown() {
    return `## ⚙️ ${this.name}
${this.jobs.map((job) => job.toMarkdown()).join("\n")}`;
  }
}

function parseTopDownInstructions(data: any): string {
  let global: DefaultConfig | null = null;
  let include: Include | null = null;
  let workflow: Workflow | null = null;
  let variables: Variables | null = null;

  let stageOf = new Map<string, Stage>();
  for (const topLevelKeyword in data) {
    switch (topLevelKeyword) {
      case TopLevelKeywords.DEFAULT:
        global = new DefaultConfig("global", data[topLevelKeyword]);
        break;
      case TopLevelKeywords.INCLUDE:
        include = includeSchema.parse(data[topLevelKeyword]);
        break;
      case TopLevelKeywords.STAGES:
        break;
      case TopLevelKeywords.VARIABLES:
        variables = variablesSchema.parse(data[topLevelKeyword]);
        break;
      case TopLevelKeywords.WORKFLOW:
        workflow = workflowSchema.parse(data[topLevelKeyword]);
        break;
      default:
        // Job
        const job = Job.fromYaml(topLevelKeyword, data[topLevelKeyword]);
        const stage = stageOf.get(job.stage);
        if (!stage) {
          stageOf.set(job.stage, new Stage(job.stage));
        }
        stageOf.get(job.stage)?.jobs.push(job);
        break;
    }
  }
  const stages = Array.from(stageOf.values());

  let result = "";
  // workflow name
  if (workflow?.name) {
    result += `# ${workflow.name}`;
  } else {
    result += "# Workflow";
  }
  result += "\n";
  // workflow rules
  if (workflow?.rules) {
    result += `## Rules
${new Rules("rules", workflow.rules)}`;
    result += "\n";
  }
  // workflow include
  if (include) {
    result += "## 📥 Includes\n";
    result += getIncludeTable(include);
    result += "\n";
  }
  // global properties
  if (global) {
    result += "## 🌍 Default properties\n";
    result += global.markdown;
    result += "\n";
  }
  // workflow variables
  if (variables) {
    result += "## 📑 Variables\n";
    result += getVariablesTable(variables);
    result += "\n";
  }
  // mermaid
  result += "## 📊 Workflow overview\n";
  result += getMermaid(stages);
  result += "\n";
  // workflow stages
  result += "## 📃 Stages\n";
  result += stages.map((stage) => stage.toMarkdown()).join("\n");

  return result;
}

function parseFile(inputPath: string, outputPath: string) {
  // Get document, or throw exception on error
  try {
    const doc = yaml.load(fs.readFileSync(inputPath, "utf8"));
    const result = parseTopDownInstructions(doc);
    // write file to disk
    fs.writeFileSync(outputPath, result);
  } catch (e) {
    console.error("Error parsing file", e);
  }
}

const test = program
  .name("Gitlab CI documentation generator")
  .version("0.0.1")
  .requiredOption("-i, --input <file>", "input file")
  .requiredOption("-o, --output <file>", "output file")
  .parse(process.argv);

const input = test.getOptionValue("input");
const output = test.getOptionValue("output");

parseFile(input, output);
