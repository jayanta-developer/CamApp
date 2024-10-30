import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  const getVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1920,
          height: 1080
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Error accessing webcam: " + err.message);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    getVideo();
    // Cleanup video stream on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <>
      <h1>Webcam</h1>
      <button onClick={takePhoto}>Take Photo</button>
      <div className='videoBox'>
        {error ? (
          <p>{error}</p>
        ) : (
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
        )}
      </div>
      <canvas ref={canvasRef} className='canvas' style={{ marginTop: '10px', width: '100%' }}></canvas>
    </>
  );
}

export default App;
