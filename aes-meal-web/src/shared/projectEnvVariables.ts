type ProjectEnvVariablesType = Pick<ImportMetaEnv, "VITE_BASE_URL">;

const projectEnvVariables: ProjectEnvVariablesType = {
  VITE_BASE_URL: '${VITE_BASE_URL}',
};

export const getProjectEnvVariables = (): {
  envVariables: ProjectEnvVariablesType;
} => {
  return {
    envVariables: {
      VITE_BASE_URL: !projectEnvVariables.VITE_BASE_URL.includes('VITE_')
        ? projectEnvVariables.VITE_BASE_URL
        : projectEnvVariables.VITE_BASE_URL,
      // : import.meta.env.VITE_BASE_URL,
    },
  };
};
