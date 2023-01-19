import {JobConfig} from "./jobConfig";
import {retrySchema} from "./retry";
import Artifacts, {ArtifactSchema} from "./artifacts";
import {CacheClass, cacheSchema} from "./cache";
import {Rules, ruleSchema} from "./rules";
import {getScriptAsAnArray, scriptSchema} from "./scripts";
import {getImageBadge, Image, imageSchema} from "./image";
import {getVariablesTable, Variables, variablesSchema} from "./variables";
import {z} from "zod";


export const jobSchema = z.object({
    after_script: scriptSchema.optional(),
    before_script: scriptSchema.optional(),
    script: scriptSchema.optional(),
    stage: z.string().default("test"),
    variables: variablesSchema.optional(),
    image: imageSchema.optional(),
    rules: ruleSchema.optional(),
    artifacts: ArtifactSchema.optional(),
    cache: cacheSchema.optional(),
    retry: retrySchema.optional(),

    // TODO: add better support for rules
    allow_failure: z.any().optional(),
    coverage: z.any().optional(),
    dast_configuration: z.any().optional(),
    dependencies: z.any().optional(),
    environment: z.any().optional(),
    except: z.any().optional(),
    extends: z.any().optional(),
    inherit: z.any().optional(),
    interruptible: z.any().optional(),
    needs: z.any().optional(),
    only: z.any().optional(),
    pages: z.any().optional(),
    parallel: z.any().optional(),
    release: z.any().optional(),
    resource_group: z.any().optional(),
    secrets: z.any().optional(),
    services: z.any().optional(),
    tags: z.any().optional(),
    timeout: z.any().optional(),
    trigger: z.any().optional(),
    when: z.any().optional(),
});


export class Job {
    name: string;
    job: z.infer<typeof jobSchema>;

    constructor(name: string, data: any) {
        this.name = name;
        this.job = jobSchema.parse(data);

    }

    get stage(): string {
        return this.job.stage;
    }

    get scripts(): string[] {
        return getScriptAsAnArray(this.job.script ?? []);
    }

    get beforeScripts(): string[] {
        return getScriptAsAnArray(this.job.before_script ?? []);
    }

    get afterScripts(): string[] {
        return getScriptAsAnArray(this.job.after_script ?? []);
    }

    get variables(): Variables | undefined {
        return this.job.variables;
    }

    get image(): Image | undefined {
        return this.job.image;
    }

    get settings(): JobConfig[] {
        const result: JobConfig[] = [];
        for (const [key, value] of Object.entries(this.job)) {
            if (["after_script", "before_script", "script", "stage", "variables", "image", "rules",
                "artifacts", "cache", "retry"].includes(key)) {
                continue;
            }
            result.push(new JobConfig(key, value));
        }
        return result;
    }

    toMarkdown(): string {
        let result: string[] = [];
        result.push(`<details>`);
        result.push(`<summary><h3>${this.name}</h3></summary>`);
        result.push(``);
        if (this.image) {
            result.push(this.imageToMarkdown());
        }
        if (this.job.before_script) {
            result.push(this.beforeScriptsToMarkdown());
        }
        if (this.job.script) {
            result.push(this.scriptsToMarkdown());
        }
        if (this.job.after_script) {
            result.push(this.afterScriptsToMarkdown());
        }
        if (this.job.variables) {
            result.push(this.variablesToMarkdown());
        }
        if (this.job.rules) {
            result.push(new Rules("rules", this.job.rules).markdown);
        }
        if (this.job.artifacts) {
            result.push(new Artifacts("artifacts", this.job.artifacts).markdown);
        }
        if (this.job.cache) {
            result.push(new CacheClass("cache", this.job.cache).markdown);
        }
        this.settings.forEach((setting) => {

            result.push(setting.markdown);
        });
        result.push(`</details>`);
        result.push(``);
        return result.join("\n");
    }

//     toMarkdown(): string {
//         return `
// <details>
// <summary><h3>${this.name}</h3></summary>
//
// ${this.imageToMarkdown()}
// ${this.beforeScriptsToMarkdown()}
// ${this.scriptsToMarkdown()}
// ${this.afterScriptsToMarkdown()}
// ${this.variablesToMarkdown()}
// ${this.settings.map((value) => value.markdown).join("\n")}
// </details>
// `;
//     }

    afterScriptsToMarkdown(): string {
        if (this.afterScripts) {
            return (
                "#### After Scripts\n```bash\n" + this.afterScripts.join("\n") + "\n```"
            );
        }
        return "";
    }

    beforeScriptsToMarkdown(): string {
        if (this.beforeScripts) {
            return (
                "#### Before Scripts\n```bash\n" +
                this.beforeScripts.join("\n") +
                "\n```"
            );
        }
        return "";
    }

    variablesToMarkdown(): string {
        if (this.variables) {
            return (
                `#### Variables\n
        ${getVariablesTable(this.variables)}`
            );
        }
        return "";
    }

    scriptsToMarkdown(): string {
        if (this.scripts) {
            return "#### Scripts\n```bash\n" + this.scripts.join("\n") + "\n```";
        }
        return "";
    }

    imageToMarkdown(): string {
        if (this.image) {
            return getImageBadge(this.image);
        }
        return "";
    }
}
