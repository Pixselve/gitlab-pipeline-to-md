#! /usr/bin/env node
import * as yaml from "js-yaml";
import * as fs from "fs";
import {TopLevelKeywords} from "./types/topLevelKeywords";
import {DefaultConfig} from "./types/defaultConfig";
import {program} from "commander";
import {getMermaid} from "./utils/mermaid";
import {Job} from "./types/job";
import {getIncludeTable, Include, includeSchema} from "./types/include";
import {Workflow, workflowSchema} from "./types/workflow";
import {Rules} from "./types/rules";
import {getVariablesTable, Variables, variablesSchema,} from "./types/variables";

export type Recursion = Record<
    string,
    string | string[] | RecordInterface | RecordInterface[]
>;

export interface RecordInterface extends Record<string, Recursion> {
}

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
        const job = new Job(topLevelKeyword, data[topLevelKeyword]);
        const stage = stageOf.get(job.stage);
        if (!stage) {
          stageOf.set(job.stage, new Stage(job.stage));
        }
        stageOf.get(job.stage)?.jobs.push(job);
        break;
    }
  }
  const stages = Array.from(stageOf.values());

  let result: string[] = [];

  // workflow name
  if (workflow?.name) {
    result.push(`# ${workflow.name}`);
  } else {
    result.push("# Workflow");
  }

  // workflow rules
  if (workflow?.rules) {
    result.push("## Rules");
    result.push(new Rules("rules", workflow.rules).markdown);
  }

  // workflow include
  if (include) {
    result.push("## 📥 Includes");
    result.push(getIncludeTable(include));
  }

  // global properties
  if (global) {
    result.push("## 🌍 Default properties");
    result.push(global.markdown);
  }

  // workflow variables
  if (variables) {
    result.push("## 📑 Variables");
    result.push(getVariablesTable(variables));
  }

  // mermaid
  result.push("## 📊 Workflow overview");
  result.push(...getMermaid(stages));

  // workflow stages
  result.push("## 📃 Stages");
  result.push(...stages.map((stage) => stage.toMarkdown()));

  return result.join("\n");
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
    .requiredOption("-i, --input <file>", "input file")
    .requiredOption("-o, --output <file>", "output file")
    .parse(process.argv);

const input = test.getOptionValue("input");
const output = test.getOptionValue("output");

parseFile(input, output);
