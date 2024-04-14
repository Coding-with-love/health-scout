import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga-scanner';  // Assuming 'quagga-scanner' is the correct library

// Define a TypeScript interface for the component's props
interface BarcodeScannerProps {
    onBarcodeDetected: (code: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onBarcodeDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isQuaggaInitialized, setIsQuaggaInitialized] = useState(false);

  useEffect(() => {
    async function initQuagga() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 640, height: 480 }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(console.error);
        }

        Quagga.init({
          inputStream: {
            type: "LiveStream",
            target: videoRef.current || undefined,
          },
          decoder: {
            readers: ["code_128_reader", "upc_reader", "ean_reader", "ean_8_reader",
                      "code_39_reader", "code_39_vin_reader", "codabar_reader",
                      "upc_e_reader", "i2of5_reader"]
          },
          locate: true,
        }, (err) => {
          if (err) {
            console.error('Error initializing Quagga:', err);
            return;
          }
          Quagga.start();
          setIsQuaggaInitialized(true);
        });

        Quagga.onDetected((result) => {
          if (result && result.codeResult && result.codeResult.code) {
            onBarcodeDetected(result.codeResult.code);
          }
        });
      } catch (error) {
        console.error('Error accessing the media devices.', error);
      }
    }

    initQuagga();

    return () => {
      if (isQuaggaInitialized) {
        Quagga.offDetected((result) => {
          if (result && result.codeResult && result.codeResult.code) {
            onBarcodeDetected(result.codeResult.code);
          }
        });
        Quagga.stop();
      }
    };
  }, [onBarcodeDetected, isQuaggaInitialized]);

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }} autoPlay playsInline muted />
    </div>
  );
};

export default BarcodeScanner;
