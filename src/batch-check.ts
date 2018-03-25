import {Glob} from 'glob';
import PQueue from 'p-queue';
import {check, DummyCheckResult} from './dummy-check';
import {sleep} from './utils';

async function* findFiles(filePattern: string) {
  let filenameQueue: string[] = [];
  let finished = false;

  const glob = new Glob(filePattern);
  glob.on('match', (filename: string) => {
    filenameQueue.push(filename);
  });
  glob.on('end', () => {
    finished = true;
  });

  do {
    await sleep(1);
    yield* filenameQueue;
    filenameQueue = [];
  } while (!finished);
}

async function batchCheck(filePatterns: string[], concurrentChecks = 1): Promise<DummyCheckResult[]> {
  const checkResults: DummyCheckResult[] = [];
  const checkQueue = new PQueue({concurrency: concurrentChecks});
  for (const filePattern of filePatterns) {
    for await (const filename of findFiles(filePattern)) {
      checkQueue.add(() => check(filename)).then((checkResult) => {
        checkResults.push(checkResult);
      }).catch((error) => {
        console.error('Error while checking: ', error);
      });
    }
  }
  return checkQueue.onIdle().then(() => checkResults);
}

batchCheck(['*.json'], 2).then((checkResults) => {
  console.log('Everything is done and it worked great!', checkResults);
}).catch((error) => {
  console.error('Upps, an error: ', error);
});
