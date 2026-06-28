/** Co Work Workspace V2 feature flags. ALL default OFF — when COWORK_WORKSPACE_V2 is not "true",
 *  the entire /cowork area 404s and nothing in the app changes. Server-read; passed to client as props. */
export interface CoworkFlags {
  v2: boolean;        // master gate
  home: boolean;      // per-surface granular gates (for later steps)
  projects: boolean;
  strategy: boolean;
  cmdk: boolean;      // command palette "live actions" gate
}
const on = (v: string | undefined): boolean => v === "true";

export function coworkFlags(): CoworkFlags {
  return {
    v2: on(process.env.COWORK_WORKSPACE_V2),
    home: on(process.env.COWORK_HOME),
    projects: on(process.env.COWORK_PROJECTS),
    strategy: on(process.env.COWORK_STRATEGY),
    cmdk: on(process.env.COWORK_CMDK),
  };
}
