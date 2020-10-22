import React, { useRef } from 'react';
import './App.css';
// import * as tf from '@tensorflow/tfjs';
import * as bodypix from '@tensorflow-models/body-pix';
import Webcam from 'react-webcam';

function App() {

    const webCamRef = useRef(null);
    const canvasRef = useRef(null);

    const loadModel = async () => {
      const preTrainedModel = await bodypix.load();
      console.log('loadindg successful');

      setInterval(() => {
        detect(preTrainedModel);
      }, 100);
    };


    const detect = async (preTrainedModel) => {
      // Check data availability
      if (typeof webCamRef.current !== 'undefined' &&
          webCamRef.current !== null &&
          webCamRef.current.video.readyState === 4)
        {
          // Get video properties
          const video = webCamRef.current.video;
          const videoHeight = video.videoHeight;
          const videoWidth = video.videoWidth;

          // Set video, canvas width and height
          webCamRef.current.height = videoHeight;
          webCamRef.current.width = videoWidth;

          canvasRef.current.height = videoHeight;
          canvasRef.current.width = videoWidth;

          // Make detections
          const person = await loadModel.preTrainedModel.segmentPersonParts(video);
          console.log(person);

          // Draw detections
          const coloredPartImg = bodypix.toColoredPartMask(person);

          bodypix.drawMask(
            canvasRef.current,
            video,
            coloredPartImg,
            0.7,
            0,
            false
          );
        }
      };
  
      loadModel();

      
  return (
    <div className="App">
      
      <header className="App-header">
        
        <Webcam ref = {webCamRef}
                style = {{
                  position: 'absolute',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  height: 650,
                  width: 500,
                  zIndex: 9 }} />
        
        <canvas ref = {canvasRef}
                style = {{
                  position: 'absolute',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  height: 650,
                  width: 500,
                  zIndex: 9 }} />

      </header>
    
    </div>
  );
}

export default App;
