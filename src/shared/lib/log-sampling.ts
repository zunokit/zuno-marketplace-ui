/**
 * Log Sampling Configuration
 * Control log volume in production
 */

export interface SamplingConfig {
  errorSampleRate: number;
  warnSampleRate: number;
  infoSampleRate: number;
  debugSampleRate: number;
}

export const productionSampling: SamplingConfig = {
  errorSampleRate: 1.0, // 100%
  warnSampleRate: 1.0, // 100%
  infoSampleRate: parseFloat(process.env.LOG_SAMPLING_INFO_RATE || "0.1"),
  debugSampleRate: 0.0, // 0%
};

const levelToRate: Record<number, keyof SamplingConfig> = {
  60: "errorSampleRate", // fatal
  50: "errorSampleRate", // error
  40: "warnSampleRate", // warn
  30: "infoSampleRate", // info
  20: "debugSampleRate", // debug
  10: "debugSampleRate", // trace
};

export function shouldLog(level: number, config: SamplingConfig = productionSampling): boolean {
  const rateKey = levelToRate[level];
  if (!rateKey) return true;

  const rate = config[rateKey];
  return Math.random() < rate;
}
