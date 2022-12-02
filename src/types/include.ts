import { z } from "zod";

export const includeSchema = z.union([z.string(), z.array(
  z.union([
    z.object({
      local: z.string(),
    }),
    z.object({
      project: z.string(),
      file: z.union([z.string(), z.array(z.string())]).optional(),
      ref: z.string().optional(),
    }),
    z.object({
      remote: z.string(),
    }),
    z.object({
      template: z.string(),
    })
  ])
)]);

export type Include = z.infer<typeof includeSchema>;

export function getIncludeTable(data: Include): string {
  let result = "";
  result += `| Type | Value |\n`;
  result += `| --- | --- |\n`;
  if (typeof data === "string") {
    result += `| ![Local](https://img.shields.io/badge/-local-green) | ${data} |\n`;
  } else {
    data.forEach((value) => {
      if ("local" in value) {
        result += `| ![Local](https://img.shields.io/badge/-local-green) | ${value.local} |\n`;
      } else if ("project" in value) {
        result += `| ![Project](https://img.shields.io/badge/-project-green) | ${value.project} |\n`;
      } else if ("remote" in value) {
        result += `| ![Remote](https://img.shields.io/badge/-remote-green) | ${value.remote} |\n`;
      } else if ("template" in value) {
        result += `| ![Template](https://img.shields.io/badge/-template-green) | ${value.template} |\n`;
      }
    });
  }
  return result;
}
