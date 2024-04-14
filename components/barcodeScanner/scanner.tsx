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
                facingMode: "environment",
                width: 1280,
                height: 720
            }
        },
        decoder: {
          readers: ["upc_reader"], // Specify your barcode formats
          multiple: false, // Set to 'true' if expecting multiple barcodes
          debug: {
              drawBoundingBox: true,
              showFrequency: true,
              drawScanline: true,
              showPattern: true
          },
      }
      
    }, function(err) {
        if (err) {
            console.error("Initialization error:", err);
            return;
        }
        console.log("Initialization finished. Ready to start");
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
