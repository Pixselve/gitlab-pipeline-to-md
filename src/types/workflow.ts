import { z } from "zod";
import { ruleSchema } from "./rules";

export const workflowSchema = z.object({
  name: z.string().optional(),
  rules: ruleSchema.optional(),
});

export type Workflow = z.infer<typeof workflowSchema>;
