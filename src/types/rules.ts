import { JobConfig } from "./jobConfig";
import { whenBadgeUrl, WhenOption } from "./when";
import { z } from "zod";

export class Rules extends JobConfig {
  rules: Rule;

  constructor(keyword: string, data: any) {
    super(keyword, data);
    this.rules = ruleSchema.parse(data);
  }

  get markdown(): string {
    return `
#### Rules

| When | Condition | Allow failure | Variables | Changes | Exists |
|------|-----------|------------| ----- | ----- | ----- |
${this.rules
  .map((rule) => {
    return `| ![${rule.when}](${whenBadgeUrl(rule.when)}) | \`${
      rule.if ?? "-"
    }\` | ${rule.allow_failure ?? false ? "✅" : "❌"} | ${Object.entries(
      rule.variables ?? {}
    )
      .map(([key, value]) => `${key}: ${value}`)
      .join(" • ")} | ${changesToMd(rule.changes ?? [])} | ${
      rule.exists?.join(", ") ?? ""
    } |`;
  })
  .join("\n")}
`;
  }
}

function changesToMd(rule: Rule[0]["changes"]) {
  if (Array.isArray(rule)) {
    return rule.join(" • ");
  } else {
    return rule.paths.join(" • ");
  }
}

type Rule = z.infer<typeof ruleSchema>;
export const ruleSchema = z.array(
  z.object({
    if: z.string().optional(),
    variables: z.record(z.string()).optional(),
    when: z.nativeEnum(WhenOption).default(WhenOption.ON_SUCCESS),
    allow_failure: z.boolean().optional(),
    exists: z.array(z.string()).optional(),
    changes: z
      .union([
        z.array(z.string()),
        z.object({
          paths: z.array(z.string()),
          compare_to: z.string().optional(),
        }),
      ])
      .optional(),
  })
);
