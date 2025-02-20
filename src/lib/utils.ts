export const debounce = (callback: (value: string) => void, timeout = 400) => {
  let timer: NodeJS.Timeout;
  return (value: string) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(value);
    }, timeout);
  };
};
