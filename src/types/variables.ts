import { z } from "zod";

export const variablesSchema = z.record(z.union([z.string(), z.object({
  value: z.string(),
  description: z.string().optional(),
  expand: z.boolean().default(true)
})]));

export type Variables = z.infer<typeof variablesSchema>;

export function getVariablesTable(data: Variables): string {
  return `
| Name | Value | Description |
|------|-------|-------------|
${ Object.entries(data)
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `| \`${ key }\` | \`${ value }\` |  |`;
      } else {
        return `| \`${ key }\` | \`${ value.value }\` | ${ value.description ?? "" } |`;
      }
    })
    .join("\n") }
`;
}
