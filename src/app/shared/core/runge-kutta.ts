/**
 * Performs one step of Runge-Kutta fourth order integration taking state vector `x` to `xNew`.
 * Since typed array allocation is a known bottleneck, and many iterations would otherwise
 * cause GC pressure, allocating the temp arrays in the caller is recommended.
 *
 * @param xNew Output array: the new state after the integration step.
 * @param x Input array: the current state vector.
 * @param t Current time.
 * @param h Step size (time increment).
 * @param f Function that computes the derivative y = F(x, t). t may be omitted if unneeded.
 * @param n Number of state vector elements. Defaults to length of x.
 * @param yTmp Temporary array for intermediate derivative calculations (optional).
 * @param xTmp Temporary array for intermediate state calculations (optional).
 */
export function step(
  xNew: Float64Array,
  x: Float64Array,
  t: number,
  h: number,
  f: (y: Float64Array, x: Float64Array, t?: number) => void,
  n: number = x.length,
  yTmp: Float64Array = new Float64Array(x.length),
  xTmp: Float64Array = new Float64Array(x.length),
) {
  const half = 0.5;
  const third = 0.33333333333333333333;
  const sixth = 0.16666666666666666666;
  // k1 = h * f(t, x)
  f(yTmp, x, t);
  for (let i = 0; i < n; i++) {
    const k1 = h * yTmp[i];
    xTmp[i] = x[i] + half * k1;
    xNew[i] = x[i] + sixth * k1;
  }
  // k2 = h * f(t + h/2, x + 1/2 k1);
  f(yTmp, xTmp, t + half * h);
  for (let i = 0; i < n; i++) {
    const k2 = h * yTmp[i];
    xTmp[i] = x[i] + half * k2;
    xNew[i] += third * k2;
  }
  // k3 = h * f(t + h/2, x + 1/2 k2);
  f(yTmp, xTmp, t + half * h);
  for (let i = 0; i < n; i++) {
    const k3 = h * yTmp[i];
    xTmp[i] = x[i] + k3;
    xNew[i] += third * k3;
  }
  //  k4 = h * f(t + h, x + k3);
  f(yTmp, xTmp, t + h);
  for (let i = 0; i < n; i++) {
    const k4 = h * yTmp[i];
    xNew[i] += sixth * k4;
  }
}
