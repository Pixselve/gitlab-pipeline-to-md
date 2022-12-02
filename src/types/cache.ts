import { z } from "zod";
import { whenBadge, whenBadgeUrl, WhenOption } from "./when";
import { JobConfig } from "./jobConfig";

export const cacheSchema = z.object({
  paths: z.array(z.string()).optional(),
  key: z.string().optional(),
  untracked: z.boolean().optional(),
  when: z.nativeEnum(WhenOption).default(WhenOption.ON_SUCCESS),
  policy: z.enum(["pull-push", "pull", "push"]).default("pull-push"),
});

export type Cache = z.infer<typeof cacheSchema>;

export function getCacheList(cacheData: Cache) {
  let data = "";
  data += `| Key | Paths | Untracked | Policy | When |\n`;
  data += `| --- | --- | --- | --- | --- |\n`;
  data += `| ${cacheData.key && keyBadge(cacheData.key)} | ${cacheData.paths
    ?.map((value) => "`" + value + "`")
    .join(", ")} | ${cacheData.untracked ? "✅" : "❌"} | ${policyBadge(
    cacheData.policy
  )} | ${whenBadge(cacheData.when)} |\n`;
  return data;
}

function keyBadge(key: string) {
  return `![Cache key](https://img.shields.io/badge/Cache_key-${key.replaceAll(
    "-",
    "--"
  )}-blue)`;
}

function policyBadge(policy: string) {
  return `![Cache policy](https://img.shields.io/badge/Cache_policy-${policy.replaceAll(
    "-",
    "--"
  )}-blue)`;
}

export class CacheClass extends JobConfig {
  cache: Cache;

  constructor(name: string, data: any) {
    super(name, data);
    this.cache = cacheSchema.parse(data);
  }

  get markdown(): string {
    let result = "### Cache\n";
    result += getCacheList(this.cache);
    return result;
  }
}
