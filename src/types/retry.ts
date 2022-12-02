import { z } from "zod";

export const retrySchema = z.union([
  z.number(),
  z.object({
    max: z.number().optional(),
    when: z.string().optional(),
  }),
]);

export type Retry = z.infer<typeof retrySchema>;

export function getRetryBadge(data: Retry): string {
  if (typeof data === "number") {
    return `![Retry](https://img.shields.io/badge/Retry-${data}-blue) `;
  } else {
    return `![Retry](https://img.shields.io/badge/Retry-${data.max}-blue) `;
  }
}
