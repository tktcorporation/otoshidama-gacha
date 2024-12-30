import { saveGachaResult } from './supabase';

export interface GachaConfig {
  amounts: number[];
  probabilities: number[];
}

export const OTOSHIDAMA_CONFIG: GachaConfig = {
  amounts: [1000, 2000, 3000, 4000, 5000],
  // 期待値が3000円になるように確率を調整
  // (1000×0.4 + 2000×0.3 + 3000×0.15 + 4000×0.1 + 5000×0.05 = 3000)
  probabilities: [0.4, 0.3, 0.15, 0.1, 0.05]
};

export function calculateExpectedValue(config: GachaConfig): number {
  return config.amounts.reduce((sum, amount, index) => {
    return sum + amount * config.probabilities[index];
  }, 0);
}

export function spinGacha(config: GachaConfig): number {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (let i = 0; i < config.probabilities.length; i++) {
    cumulativeProbability += config.probabilities[i];
    if (random <= cumulativeProbability) {
      return config.amounts[i];
    }
  }
  
  return config.amounts[0]; // フォールバック
}

// ガチャを実行して結果を保存する関数
export async function playAndSaveGacha(playerName: string, config: GachaConfig = OTOSHIDAMA_CONFIG) {
  const amount = spinGacha(config);
  await saveGachaResult(amount, playerName);
  return amount;
}