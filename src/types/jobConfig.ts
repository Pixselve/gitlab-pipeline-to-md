import { RecordInterface, Recursion } from "../index";

export class JobConfig {
  data: any;
  name: string;

  constructor(name: string, data: any) {
    this.data = data;
    this.name = name;
  }

  get markdown() {
    return `
#### ${this.name}
  ${JobConfig.bulletPoint(this.data)}`;
  }

  static bulletPoint(data: RecordInterface | Recursion, indent = 0) {
    let result = "";
    if (typeof data === "string") {
      result += data;
    } else if (Array.isArray(data)) {
      data.forEach((item) => {
        result += JobConfig.bulletPoint(item, indent) + "\n";
      });
    } else {
      for (const [key, value] of Object.entries(data)) {
        result += "\t".repeat(indent);
        if (typeof value === "string") {
          result += `* ${key}: \`${value}\``;
        } else if (Array.isArray(value)) {
          result += `* ${key}: ${value
            .map((value1) => "`" + value1 + "`")
            .join(", ")}`;
        } else if (typeof value === "object") {
          result += `* ${key}:\n`;

          result += JobConfig.bulletPoint(value, indent + 1);
        }
        result += "\n";
      }
    }

    return result;
  }
}
