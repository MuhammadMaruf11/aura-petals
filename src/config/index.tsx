export const getApiUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_API_DEV_URL || "";
  } else {
    return process.env.NEXT_PUBLIC_API_PROD_URL || "";
  }
};
