// Worker runs in isolated thread
self.onmessage = async (event: MessageEvent) => {
  const { files } = event.data as { files: File[] };

  if (!files || files.length === 0) {
    postMessage([]);
    return;
  }

  const file = files[0];
  const text = await file.text();
  const rows = text.split("\n").map((r) => r.split(","));

  // ✅ Send parsed rows back
  postMessage(rows);
};
