export const DelayTimer = function (milliseconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

  /*
  async function example() {
    console.log('Before delay');
    await delay(1000);
    console.log('After delay');
  }
  
  example();
  */
