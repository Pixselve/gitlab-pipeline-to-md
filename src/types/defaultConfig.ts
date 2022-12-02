import { z } from "zod";
import Artifacts, { artifactList, ArtifactSchema } from "./artifacts";
import { WhenOption } from "./when";
import { JobConfig } from "./jobConfig";
import { getRetryBadge, retrySchema } from "./retry";
import { cacheSchema, getCacheList } from "./cache";
import { getScriptAsAnArray } from "./scripts";

export class DefaultConfig extends JobConfig {
  defaultConfig: z.infer<typeof globalSchema>;

  constructor(name: string, data: any) {
    super(name, data);
    this.defaultConfig = globalSchema.parse(data);
  }

  get markdown(): string {
    let result = "# Global configuration\n";
    if (this.defaultConfig.image) {
      result += `![${this.defaultConfig.image}](https://img.shields.io/badge/image-${this.defaultConfig.image}-brightgreen) `;
    }
    if (this.defaultConfig.interruptible) {
      result += `![Interruptible](https://img.shields.io/badge/-Interruptible-red) `;
    }
    if (this.defaultConfig.timeout) {
      result += `![Timeout](https://img.shields.io/badge/Timeout-${this.defaultConfig.timeout.replaceAll(
        " ",
        "_"
      )}-orange) `;
    }
    if (this.defaultConfig.retry) {
      result += getRetryBadge(this.defaultConfig.retry);
    }
    result += "\n";
    if (this.defaultConfig.artifacts) {
      result += "## Artifacts\n";
      result += artifactList(this.defaultConfig.artifacts);
    }

    if (this.defaultConfig.cache) {
      result += "## Cache\n";
      result += getCacheList(this.defaultConfig.cache);
    }

    if (this.defaultConfig.before_script) {
      result += "## Before scripts\n";
      result += "```bash\n" + getScriptAsAnArray(this.defaultConfig.before_script) + "\n```\n";
    }

    if (this.defaultConfig.after_script) {
      result += "## After scripts\n";
      result += "```bash\n" + getScriptAsAnArray(this.defaultConfig.after_script) + "\n```\n";
    }
    // if (this.global.cache) {
    //   result += `**📦 Cache:** ${ this.global.cache.map(value => "`" + value + "`").join(", ") }\n\n`;
    // }
    // if (this.global.pages) {
    //   result += `**📦 Pages:** ${ this.global.pages.map(value => "`" + value + "`").join(", ") }\n\n`;
    // }
    // if (this.global.retry) {
    //   result += `**📦 Retry:** ${ this.global.retry.map(value => "`" + value + "`").join(", ") }\n\n`;
    // }
    // if (this.global.timeout) {
    //   result += `**📦 Timeout:** ${ this.global.timeout.map(value => "`" + value + "`").join(", ") }\n\n`;
    // }
    return result;
  }
}

export const globalSchema = z.object({
  after_script: z.union([z.string(), z.array(z.string())]).optional(),
  before_script: z.union([z.string(), z.array(z.string())]).optional(),
  artifacts: ArtifactSchema.optional(),
  cache: cacheSchema.optional(),
  image: z.string().optional(),
  interruptible: z.boolean().optional(),
  services: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
  retry: retrySchema.optional(),
  tags: z.array(z.string()).optional(),
  timeout: z.string().optional(),
});
