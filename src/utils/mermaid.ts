import { Stage } from "../index";

export function getMermaid(stages: Stage[]): string {
  return `\`\`\`mermaid
flowchart LR
${stages.map((stage) => stage.toMermaid()).join("\n")}
${getMermaidArrows(stages)}
\`\`\``;
}

function getMermaidArrows(stages: Stage[]): string {
  let arrows = "";
  for (let i = 0; i < stages.length - 1; i++) {
    const stage = stages[i];
    const nextStage = stages[i + 1];
    arrows += `${stage.name.replaceAll(
      " ",
      "_"
    )}_STAGE --> ${nextStage.name.replaceAll(" ", "_")}_STAGE
`;
  }
  return arrows;
}
