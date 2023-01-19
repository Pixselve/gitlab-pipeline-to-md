import {Stage} from "../index";

export function getMermaid(stages: Stage[]): string[] {
    let result: string[] = [];
    result.push("\`\`\`mermaid");
    result.push("flowchart LR");
    result.push(...stages.map((stage) => stage.toMermaid()));
    result.push(...getMermaidArrows(stages));
    result.push("\`\`\`");
    return result;
}

function getMermaidArrows(stages: Stage[]): string[] {
    let result: string[] = [];
    for (let i = 0; i < stages.length - 1; i++) {
        const stage = stages[i];
        const nextStage = stages[i + 1];
        const stageName = stage.name.replaceAll(" ", "_");
        const nextStageName = nextStage.name.replaceAll(" ", "_");
        result.push(`${stageName}_STAGE --> ${nextStageName}_STAGE`);
    }
    return result;
}
