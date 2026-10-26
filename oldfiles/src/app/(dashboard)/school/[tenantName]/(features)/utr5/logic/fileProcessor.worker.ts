// parseFile.ts



// utr5/logic/fileProcessor.worker.ts
import { parseFile } from './parseFile';

self.onmessage = async (e) => {
    console.log( "  login/ parseFile.ts ")

  const { file } = e.data;
  try {
    const data = await parseFile(file);
    // Send parsed data back to main thread
    postMessage(data);
  } catch (err: unknown) {
    // / Type-safe error handling
    const errorMessage = err instanceof Error ? err.message : String(err);
    postMessage({ error: errorMessage });
  }
};

