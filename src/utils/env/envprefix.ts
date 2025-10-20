export const ENV_PREFIX = "SNAPITER" as any;

export type EnvConfig = {
  SNAPITER_MAPTILER_KEY: string;
  SNAPITER_SHOW_BASE_LINE_UNDER_ANIMATION: boolean;
  SNAPITER_API_URL: string;
  SNAPITER_MARKER_URL: string;
};

export const DEFAULT_ENV: EnvConfig = {
  SNAPITER_MAPTILER_KEY: "",
  SNAPITER_SHOW_BASE_LINE_UNDER_ANIMATION: false,
  SNAPITER_API_URL: "https://api.snapiter.com",
  SNAPITER_MARKER_URL: "https://api.snapiter.com",
};
