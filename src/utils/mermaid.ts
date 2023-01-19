import {Stage} from "../index";

export function getMermaid(stages: Stage[]): string {
    let result = [];
    result.push("\`\`\`mermaid");
    result.push("flowchart LR");
    result.push(stages.map((stage) => stage.toMermaid()));
    result.push(getMermaidArrows(stages));
    result.push("\`\`\`");
    return result.join("\n");
}

function getMermaidArrows(stages: Stage[]): string {
    let result = [];
    for (let i = 0; i < stages.length - 1; i++) {
        const stage = stages[i];
        const nextStage = stages[i + 1];
        const stageName = stage.name.replaceAll(" ", "_");
        const nextStageName = nextStage.name.replaceAll(" ", "_");
        result.push(`${stageName} --> ${nextStageName}`);
    }
    return result.join("\n");
}
