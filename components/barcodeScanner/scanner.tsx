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
          type: 'LiveStream',
          target: videoRef.current ?? undefined, // Pass the video container ref here
          constraints: {
            facingMode: 'environment',
            width: 640,
            height: 480
          }
        },
        decoder: {
          readers: ['code_128_reader'] // specify barcode formats here
        },
        locate: true // enables barcode location
      }, function(err) {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        if (props.onScanned) {
          props.onScanned(code);
        }
        Quagga.stop(); // Stop scanning after first successful detection
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
