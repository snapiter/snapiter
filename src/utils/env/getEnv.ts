import { unstable_noStore as noStore } from "next/cache";
import { DEFAULT_ENV, ENV_PREFIX, EnvConfig } from "./envprefix";

export default function getEnv(): EnvConfig {
  noStore();

  const raw = Object.entries(process.env).reduce(
    (acc: Record<string, string | undefined>, [key, value]) => {
      if (key.startsWith(ENV_PREFIX)) acc[key] = value;
      return acc;
    },
    {}
  );

  return {
    ...DEFAULT_ENV,
    ...raw,
    SNAPITER_SHOW_BASE_LINE_UNDER_ANIMATION:
      raw.SNAPITER_SHOW_BASE_LINE_UNDER_ANIMATION === "true"
  };
}
