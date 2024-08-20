const checkDev = () => {
  const location = window.location;

  if (!location) {
    return false;
  }

  const hostname = location.hostname;

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.includes("preview")
  );
};

export const log = (...args: any[]) => {
  if (checkDev()) {
    console.log(...args);
  }
};
