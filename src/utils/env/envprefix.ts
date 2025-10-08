export const ENV_PREFIX = 'SNAPITER' as any;


export type EnvConfig = {
    SNAPITER_MAPTILER_KEY: string;
    SNAPITER_SHOW_BASE_LINE_UNDER_ANIMATION: boolean;
}   

export const DEFAULT_ENV: EnvConfig = {
    SNAPITER_MAPTILER_KEY: "",
    SNAPITER_SHOW_BASE_LINE_UNDER_ANIMATION: false
}
