import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function QRScanner({ onScanSuccess, onScanError }) {
  useEffect(() => {
    const readerId = "reader";

    // 🔥 Force remove any previous injected UI
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
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
      <div id="reader"></div>
    </div>
  );
}