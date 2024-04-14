import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga-scanner'; // Import Quagga library

export interface ScannerProps {
  isActive?: boolean;
  children?: React.ReactNode;
  onScanned?: (code: string) => void;
}

const BarcodeScanner = (props: ScannerProps): React.ReactElement => {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.isActive) {
      Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current ?? undefined, // Ensure this is rendered and available
            constraints: {
                facingMode: "environment", // Use the rear-facing camera
                width: 640,
                height: 480
            }
        },
        decoder: {
            readers: ["code_128_reader", "upc_reader", "ean_reader"] // As an example
        }
    }, function(err) {
        if (err) {
            console.error("Initialization error:", err);
            return;
        }
        console.log("Initialization succeeded");
        Quagga.start();
    });
    
    Quagga.onDetected((result) => {
      console.log("Detection result:", result);
      if (result && result.codeResult && result.codeResult.code) {
          console.log("Decoded barcode:", result.codeResult.code);
          if (props.onScanned) {
            props.onScanned(result.codeResult.code);
          }
          Quagga.stop(); // Optional: stop after first successful scan
      }
  });
  
    }

    return () => {
      Quagga.offDetected((result) => {
        // Handle the offDetected event here
      });
      Quagga.stop();
    };
  }, [props.isActive, props.onScanned]);

  return (
    <div ref={videoRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {props.children}
    </div>
  );
};

export default BarcodeScanner;
