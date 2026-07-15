const warningLinePatterns = [
  /^\s*\(!\)\s+/u,
  /^\s*(?:warn(?:ing)?)(?:\s|:)/iu,
  /^\s*\[WARN\](?:\s|:)/u,
  /^\s*\(node:\d+\).*Warning:/u,
  /^\s*DeprecationWarning:/u,
  /\[PLUGIN_TIMINGS\]/u,
];

export function collectBuildWarnings(output: string) {
  return output
    .split(/\r?\n/u)
    .filter((line) => warningLinePatterns.some((pattern) => pattern.test(line)));
}
