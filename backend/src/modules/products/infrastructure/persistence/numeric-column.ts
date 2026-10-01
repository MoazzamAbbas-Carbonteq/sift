export const numericColumnTransformer = {
  to(value: number | null): number | null {
    return value;
  },
  from(value: string | null): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    return Number(value);
  },
};
