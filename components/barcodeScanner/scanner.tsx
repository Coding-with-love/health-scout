import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, NotFoundException, Result } from '@zxing/library';

const BarcodeScanner = ({ onDetected }: { onDetected: (text: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader.listVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length === 0) {
          throw new Error('No video devices found');
        }
        const selectedDeviceId = videoInputDevices[0].deviceId;
        // Continuously decode from video stream
        codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
          if (result) {
            onDetected(result.getText()); // This method extracts the text from the Result object
            codeReader.reset(); // Resets the decoder
          } else if (err && !(err instanceof NotFoundException)) {
            console.error(err);
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      codeReader.reset(); // Ensure resources are released on component unmount
    };
  }, [onDetected]);

  return <video ref={videoRef} style={{ width: '100%' }} />;
};

export default BarcodeScanner;
