import {sleep} from './utils';

export interface DummyCheckResult {
  filename: string;
  score: number;
}

export async function check(filename: string): Promise<DummyCheckResult> {
  console.log('Start check ', filename);
  await sleep(1000);
  console.log(' -> Check finished ', filename);
  return {filename, score: filename.length};
}
