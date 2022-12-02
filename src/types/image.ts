import { z } from "zod";

export const imageSchema = z.union([z.string(), z.object({ name: z.string(), entrypoint: z.array(z.string()).optional() })]);

export type Image = z.infer<typeof imageSchema>;

export function getImageBadge(data: Image): string {
  const name = typeof data === "string" ? data : data.name;
  return `![Image](https://img.shields.io/badge/Image-${ name.replaceAll("-", "--") }-blue) `;
}
