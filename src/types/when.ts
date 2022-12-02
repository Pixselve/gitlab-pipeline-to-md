/**
 * Possible inputs:
 *
 * on_success (default): Run the job only when all jobs in earlier stages succeed or have allow_failure: true.
 * manual: Run the job only when triggered manually.
 * always: Run the job regardless of the status of jobs in earlier stages. Can also be used in workflow:rules.
 * on_failure: Run the job only when at least one job in an earlier stage fails.
 * delayed: Delay the execution of a job for a specified duration.
 * never: Don’t run the job. Can only be used in a rules section or workflow: rules.
 */
export enum WhenOption {
  ON_SUCCESS = "on_success",
  MANUAL = "manual",
  ALWAYS = "always",
  ON_FAILURE = "on_failure",
  DELAYED = "delayed",
  NEVER = "never",
}

export function whenBadgeUrl(option: WhenOption) {
  switch (option) {
    case WhenOption.ON_SUCCESS:
      return "https://img.shields.io/badge/-on__success-green";
    case WhenOption.MANUAL:
      return "https://img.shields.io/badge/-manual-purple";
    case WhenOption.ALWAYS:
      return "https://img.shields.io/badge/-always-blue";
    case WhenOption.ON_FAILURE:
      return "https://img.shields.io/badge/-on__failure-red";
    case WhenOption.DELAYED:
      return "https://img.shields.io/badge/-delayed-orange";
    case WhenOption.NEVER:
      return "https://img.shields.io/badge/-never-red";
  }
}

export function whenBadge(option: WhenOption) {
  return `![${option}](${whenBadgeUrl(option)})`;
}
