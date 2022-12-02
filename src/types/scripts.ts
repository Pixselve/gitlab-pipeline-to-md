import { z } from "zod";

export const scriptSchema = z.union([z.string(), z.array(z.string())]);

export type Script = z.infer<typeof scriptSchema>;

export function getScriptAsAnArray(script: Script): string[] {
  if (Array.isArray(script)) {
    return script;
  } else {
    return [script];
  }
}
