import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { FaceMeshRenderer } from './components/FaceMeshRenderer';
import { AsymmetryCalculator } from './components/AsymmetryCalculator';
import './App.css';

const App: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [asymmetry, setAsymmetry] = useState<number | null>(null);
  const [currentResults, setCurrentResults] = useState<Results | null>(null);

  const onResults = useCallback((results: Results) => {
    setCurrentResults(results);
  }, []);

  const startAnalysis = useCallback(() => {
    if (!webcamRef.current?.video) return;

    setIsAnalyzing(true);
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        if (webcamRef.current?.video) {
          await faceMesh.send({ image: webcamRef.current.video });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }, [onResults]);

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    setAsymmetry(null);
    setCurrentResults(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Facial Symmetry Analysis</h1>
        <p className="description">
          Using advanced AI technology, this tool analyzes your facial features in real-time to measure facial symmetry. 
          Simply position yourself in front of the camera and click "Start Analysis" to begin. The lower the percentage, 
          the more symmetrical your face is.
        </p>
      </div>
      
      <div className="video-container">
        <Webcam
          ref={webcamRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
          }}
        />
        {isAnalyzing && currentResults && (
          <>
            <FaceMeshRenderer canvasRef={canvasRef} results={currentResults} />
            <AsymmetryCalculator 
              results={currentResults}
              onAsymmetryCalculated={setAsymmetry}
            />
          </>
        )}
      </div>

      <div className="controls">
        {!isAnalyzing ? (
          <button className="button start" onClick={startAnalysis}>
            Start Analysis
          </button>
        ) : (
          <button className="button stop" onClick={stopAnalysis}>
            Stop Analysis
          </button>
        )}
      </div>

      {asymmetry !== null && (
        <div className="result">
          <p>
            Facial Asymmetry: <strong>{asymmetry}%</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default App;