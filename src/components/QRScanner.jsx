useEffect(() => {
  const readerId = "reader";

  const container = document.getElementById(readerId);
  if (container) {
    container.innerHTML = "";
  }

  const scanner = new Html5QrcodeScanner(readerId, {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    rememberLastUsedCamera: false,
    supportedScanTypes: []
  });

  scanner.render(onScanSuccess, onScanError);

  return () => {
    scanner.clear().catch(() => {});
    const container = document.getElementById(readerId);
    if (container) {
      container.innerHTML = "";
    }
  };
}, [onScanSuccess, onScanError]);