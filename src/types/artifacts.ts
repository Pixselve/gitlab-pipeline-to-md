import { z } from "zod";
import { whenBadgeUrl, WhenOption } from "./when";
import { JobConfig } from "./jobConfig";

export function artifactList(data: Artifact): string {
  let result = "";
  if (data.untracked) {
    result += `![Untracked](https://img.shields.io/badge/-Untracked-orange) `;
  }
  if (data.when) {
    result += `![${data.when}](${whenBadgeUrl(data.when)}) `;
  }
  if (data.public) {
    result += `![Public](https://img.shields.io/badge/-Public-green) `;
  }
  result += "\n\n";
  if (data.paths) {
    result += `**✅ Paths:** ${data.paths
      .map((value) => "`" + value + "`")
      .join(", ")}\n\n`;
  }
  if (data.exclude) {
    result += `**❌ Exclude:** ${data.exclude
      .map((value) => "`" + value + "`")
      .join(", ")}\n\n`;
  }

  if (data.expire_in) {
    result += `**⌚ Expire in:** \`${data.expire_in}\`\n\n`;
  }

  if (data.reports) {
    result += `**📊 Reports:** ${Object.entries(data.reports)
      .map((value) => value[0] + ": `" + value[1] + "`")
      .join(", ")}\n\n`;
  }
  return result;
}

export default class Artifacts extends JobConfig {
  artifacts: Artifact;

  constructor(name: string, data: any) {
    super(name, data);
    this.artifacts = ArtifactSchema.parse(data);
  }

  get markdown(): string {
    let result = "#### Artifacts\n";
    result += artifactList(this.artifacts);

    return result;
  }
}

export const ArtifactSchema = z.object({
  paths: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  expire_in: z.string().optional(),
  expose_as: z.string().optional(),
  name: z.string().optional(),
  public: z.boolean().default(true),
  reports: z.record(z.string()).optional(),
  untracked: z.boolean().optional(),
  when: z.nativeEnum(WhenOption).default(WhenOption.ON_SUCCESS).optional(),
});

type Artifact = z.infer<typeof ArtifactSchema>;
