function throttle(f: () => any, delay: number = 100) {
  let timeout: NodeJS.Timeout | undefined = setTimeout(() => {
    timeout = undefined;
    f();
  }, delay);;
  return () => {    
    if (timeout) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = undefined;
        f();
      }, delay);
    }
  };
}
