let accessToken: string | null = null;

export const authService = {
  get: () => accessToken,
  set: (t: string | null) => { accessToken = t; }
};
