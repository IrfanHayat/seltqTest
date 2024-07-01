// import React, { useState, useRef, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3001'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [question, setQuestion] = useState(null);

//   const videoRef = useRef(null);
//   let recorder = useRef(null);
//   let audioInterval = useRef(null);

//   const handleStartSharing = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 44100, // Higher sample rate for better quality
//         },
//       });
//       if (!stream) {
//         throw new Error('Failed to obtain media stream.');
//       }
//       setSharedContent(stream);

//       const audioTracks = stream.getAudioTracks();
//       const audioStream = new MediaStream([audioTracks[0]]);

//       recorder.current = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });

//       recorder.current.ondataavailable = async event => {
//         if (event.data.size > 0) {
//           const arrayBuffer = await event.data.arrayBuffer();
//           const buffer = Buffer.from(arrayBuffer);
//           socket.emit('audioData', buffer);
//         }
//       };

//       recorder.current.onstop = async () => {
//         recorder.current.start(); // Automatically restart recording after it stops
//       };

//       recorder.current.start();

//       // Schedule stopping and starting the recording every 30 seconds
//       audioInterval.current = setInterval(() => {
//         if (recorder.current.state === 'recording') {
//           recorder.current.stop();
//         }
//       }, 30000);

//       socket.on('transcription', data => {
//         setQuestion(data.DisplayText);
//       });
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleStartSharing}>Start Sharing</button>
//       {sharedContent && <SharedContent sharedStream={sharedContent} videoRef={videoRef} question={question} />}
//     </div>
//   );
// };

// const SharedContent = ({ sharedStream, videoRef, question }) => {
//   useEffect(() => {
//     if (sharedStream && videoRef.current) {
//       videoRef.current.srcObject = sharedStream;
//     }

//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [sharedStream, videoRef]);

//   return (
//     <div>
//       <h2>Shared Content</h2>
//       <h4>Question</h4>
//       <p>{question}</p>
//       <video ref={videoRef} controls autoPlay />
//     </div>
//   );
// };

// export default TabSharing;



// import React, { useState, useRef, useEffect } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:3001'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [question, setQuestion] = useState(null);

//   const videoRef = useRef(null);
//   let recorder = useRef(null);
//   let audioInterval = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';
//   }, []);

//   const handleStartSharing = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 44100, // Higher sample rate for better quality
//         },
//       });
//       if (!stream) {
//         throw new Error('Failed to obtain media stream.');
//       }
//       setSharedContent(stream);

//       const audioTracks = stream.getAudioTracks();
//       const audioStream = new MediaStream([audioTracks[0]]);

//       audioConfig.current = sdk.AudioConfig.fromStreamInput(audioStream);
//       recognizer.current = new sdk.SpeechRecognizer(speechConfig.current, audioConfig.current);

//       recognizer.current.recognizing = (s, e) => {
//         console.log(`RECOGNIZING: Text=${e.result.text}`);
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`RECOGNIZED: Text=${e.result.text}`);
//           setQuestion(e.result.text);
//         } else if (e.result.reason === sdk.ResultReason.NoMatch) {
//           console.log('NOMATCH: Speech could not be recognized.');
//         }
//       };

//       recognizer.current.canceled = (s, e) => {
//         console.log(`CANCELED: Reason=${e.reason}`);
//         if (e.reason === sdk.CancellationReason.Error) {
//           console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
//         }
//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.sessionStopped = (s, e) => {
//         console.log('Session stopped.');
//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.startContinuousRecognitionAsync();

//       // Schedule stopping and starting the recording every 30 seconds
//       audioInterval.current = setInterval(() => {
//         if (recorder.current && recorder.current.state === 'recording') {
//           recorder.current.stop();
//         }
//       }, 30000);
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleStartSharing}>Start Sharing</button>
//       {sharedContent && <SharedContent sharedStream={sharedContent} videoRef={videoRef} question={question} />}
//     </div>
//   );
// };

// const SharedContent = ({ sharedStream, videoRef, question }) => {
//   useEffect(() => {
//     if (sharedStream && videoRef.current) {
//       videoRef.current.srcObject = sharedStream;
//     }

//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [sharedStream, videoRef]);

//   return (
//     <div>
//       <h2>Shared Content</h2>
//       <h4>Question</h4>
//       <p>{question}</p>
//       <video ref={videoRef} controls autoPlay />
//     </div>
//   );
// };

// export default TabSharing;



// import React, { useState, useRef, useEffect } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:3001'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [question, setQuestion] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);

//   const videoRef = useRef(null);
//   const recorder = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';
//   }, []);

//   const handleStartSharing = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: {
//           systemAudio: 'include',
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 44100, // Higher sample rate for better quality
//         },
//       });

//       if (!stream) {
//         throw new Error('Failed to obtain media stream.');
//       }

//       setSharedContent(stream);

//       const audioTracks = stream.getAudioTracks();
//       const audioStream = new MediaStream([audioTracks[0]]);

//       audioConfig.current = sdk.AudioConfig.fromStreamInput(audioStream);
//       recognizer.current = new sdk.SpeechRecognizer(speechConfig.current, audioConfig.current);

//       let currentSegment = ''; // Buffer for current speech segment
//       let segmentStartTime = new Date().getTime(); // Start time of current segment

//       recognizer.current.recognizing = (s, e) => {
//         console.log(`RECOGNIZING: Text=${e.result.text}`);
//         currentSegment += e.result.text + ' '; // Append recognized text to current segment buffer
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`RECOGNIZED: Text=${e.result.text}`);
//           setQuestion(e.result.text);
//           // Check if enough time has passed since last segment to send it to backend
//           const currentTime = new Date().getTime();
//           if (currentTime - segmentStartTime >= 5000) { // Send segment every 10 seconds
//              // Send accumulated segment to backend
//              socket.emit('speechToText', currentSegment.trim());
//             currentSegment = ''; // Clear buffer for next segment
//             segmentStartTime = currentTime; // Update segment start time
//           }
//         } else if (e.result.reason === sdk.ResultReason.NoMatch) {
//           console.log('NOMATCH: Speech could not be recognized.');
//         }
//       };

//       recognizer.current.canceled = (s, e) => {
//         console.log(`CANCELED: Reason=${e.reason}`);
//         if (e.reason === sdk.CancellationReason.Error) {
//           console.error(`CANCELED: ErrorDetails=${e.errorDetails}`);
//         }
//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.sessionStopped = (s, e) => {
//         console.log('Session stopped.');
//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.startContinuousRecognitionAsync();
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   const handleStopSharing = () => {
//     if (recognizer.current && isRecording) {
//       recognizer.current.stopContinuousRecognitionAsync();
//       setIsRecording(false);
//     }
//   };

//   return (
//     <div>
//       {!isRecording ? (
//         <button onClick={handleStartSharing}>Start Sharing</button>
//       ) : (
//         <button onClick={handleStopSharing}>Stop Sharing</button>
//       )}
//       { <SharedContent sharedStream={sharedContent} videoRef={videoRef} question={question} />}
//     </div>
//   );
// };

// const SharedContent = ({ sharedStream, videoRef, question }) => {
//   useEffect(() => {
//     if (sharedStream && videoRef.current) {
//       videoRef.current.srcObject = sharedStream;

//       // Add event listener for errors (optional but useful for debugging)
//       videoRef.current.addEventListener('error', (event) => {
//         console.error('Video playback error:', event);
//       });
//     }

//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [sharedStream, videoRef]);

//   return (
//     <div>
//       <h2>Shared Content</h2>
//       <h4>Question</h4>
//       <p>{question}</p>
//       { videoRef && (
//         <video ref={videoRef} controls autoPlay  style={{ width: '100%', height: 'auto' }}/>
//       )}
//     </div>
//   );
// };

// export default TabSharing;




// import React, { useState, useRef, useEffect } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:3001'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [qaHistory, setQAHistory] = useState([]); // Store question-answer history
//   const [isRecording, setIsRecording] = useState(false);

//   const videoRef = useRef(null);
//   const recorder = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';
//   }, []);

//   const handleStartSharing = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: {
//           systemAudio: 'include',
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 44100, // Higher sample rate for better quality
//         },
//       });

//       if (!stream) {
//         throw new Error('Failed to obtain media stream.');
//       }

//       setSharedContent(stream);

//       const audioTracks = stream.getAudioTracks();
//       const audioStream = new MediaStream([audioTracks[0]]);

//       audioConfig.current = sdk.AudioConfig.fromStreamInput(audioStream);
//       recognizer.current = new sdk.SpeechRecognizer(speechConfig.current, audioConfig.current);

//       recognizer.current.recognizing = (s, e) => {
//         console.log(`RECOGNIZING: Text=${e.result.text}`);
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`RECOGNIZED: Text=${e.result.text}`);
//           const newQA = { question: e.result.text, answer: null };
//           setQAHistory(prevHistory => [...prevHistory, newQA]);
//           socket.emit('speechToText', e.result.text); // Send question to backend
//         } else if (e.result.reason === sdk.ResultReason.NoMatch) {
//           console.log('NOMATCH: Speech could not be recognized.');
//         }
//       };

//       recognizer.current.canceled = (s, e) => {
//         console.log(`CANCELED: Reason=${e.reason}`);
//         if (e.reason === sdk.CancellationReason.Error) {
//           console.error(`CANCELED: ErrorDetails=${e.errorDetails}`);
//         }
//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.sessionStopped = (s, e) => {
//         console.log('Session stopped.');
//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.startContinuousRecognitionAsync();
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   const handleStopSharing = () => {
//     if (recognizer.current && isRecording) {
//       recognizer.current.stopContinuousRecognitionAsync();
//       setIsRecording(false);
//     }
//   };

//   const updateAnswer = (question, answer) => {
//     setQAHistory(prevHistory =>
//       prevHistory.map(item => (item.question === question ? { ...item, answer } : item))
//     );
//   };

//   return (
//     <div>
//       {!isRecording ? (
//         <button onClick={handleStartSharing}>Start Sharing</button>
//       ) : (
//         <button onClick={handleStopSharing}>Stop Sharing</button>
//       )}
//       <SharedContent sharedStream={sharedContent} videoRef={videoRef} qaHistory={qaHistory} updateAnswer={updateAnswer} />
//     </div>
//   );
// };

// const SharedContent = ({ sharedStream, videoRef, qaHistory, updateAnswer }) => {
//   useEffect(() => {
//     if (sharedStream && videoRef.current) {
//       videoRef.current.srcObject = sharedStream;

//       // Add event listener for errors (optional but useful for debugging)
//       videoRef.current.addEventListener('error', (event) => {
//         console.error('Video playback error:', event);
//       });
//     }

//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [sharedStream, videoRef]);

//   return (
//     <div>
//       <h2>Shared Content</h2>
//       <video ref={videoRef} controls autoPlay style={{ width: '100%', height: 'auto' }} />
//       {qaHistory.map((qa, index) => (
//         <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
//           <div style={{ flex: 1, padding: '10px' }}>
//             <h4>Question</h4>
//             <p>{qa.question}</p>
//           </div>
//           <div style={{ flex: 1, padding: '10px' }}>
//             <h4>Answer</h4>
//             <p>{qa.answer}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TabSharing;




// import React, { useState, useRef, useEffect } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:3001'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [qaHistory, setQAHistory] = useState([]); // Store question-answer history
//   const [isRecording, setIsRecording] = useState(false);

//   const videoRef = useRef(null);
//   const recorder = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';
//   }, []);

//   const handleStartSharing = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: {
//           systemAudio: 'include',
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 44100, // Higher sample rate for better quality
//         },
//       });

//       if (!stream) {
//         throw new Error('Failed to obtain media stream.');
//       }

//       setSharedContent(stream);

//       const audioTracks = stream.getAudioTracks();
//       const audioStream = new MediaStream([audioTracks[0]]);

//       audioConfig.current = sdk.AudioConfig.fromStreamInput(audioStream);
//       recognizer.current = new sdk.SpeechRecognizer(speechConfig.current, audioConfig.current);

//       recognizer.current.recognizing = (s, e) => {
//         console.log(`RECOGNIZING: Text=${e.result.text}`);
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`RECOGNIZED: Text=${e.result.text}`);
//           const newQA = { question: e.result.text, answer: null, startTime: new Date() };
//           setQAHistory(prevHistory => [...prevHistory, newQA]);
//           socket.emit('speechToText', e.result.text); // Send question to backend
//         } else if (e.result.reason === sdk.ResultReason.NoMatch) {
//           console.log('NOMATCH: Speech could not be recognized.');
//         }
//       };

//       recognizer.current.canceled = (s, e) => {
//         console.log(`CANCELED: Reason=${e.reason}`);
//         if (e.reason === sdk.CancellationReason.Error) {
//           console.error(`CANCELED: ErrorDetails=${e.errorDetails}`);
//         }
//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.sessionStopped = (s, e) => {
//         console.log('Session stopped.');
//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.startContinuousRecognitionAsync();
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   const handleStopSharing = () => {
//     if (recognizer.current && isRecording) {
//       recognizer.current.stopContinuousRecognitionAsync();
//       setIsRecording(false);
//     }
//   };

//   const updateAnswer = (question, answer) => {
//     const answeredQuestion = qaHistory.find(item => item.question === question);
//     if (answeredQuestion) {
//       const answeredTime = new Date(); // Get current time when the answer is provided
//       const timeDiff = answeredTime - answeredQuestion.startTime;
//       const hours = Math.floor(timeDiff / (1000 * 60 * 60));
//       const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
//       const updatedQA = {
//         ...answeredQuestion,
//         answer,
//         answeredTime,
//         timeTaken: { hours, minutes, seconds }
//       };
//       setQAHistory(prevHistory =>
//         prevHistory.map(item => (item.question === question ? updatedQA : item))
//       );
//     }
//   };

//   return (
//     <div>
//       {!isRecording ? (
//         <button onClick={handleStartSharing}>Start Sharing</button>
//       ) : (
//         <button onClick={handleStopSharing}>Stop Sharing</button>
//       )}
//       <SharedContent sharedStream={sharedContent} videoRef={videoRef} qaHistory={qaHistory} updateAnswer={updateAnswer} />
//     </div>
//   );
// };

// const SharedContent = ({ sharedStream, videoRef, qaHistory, updateAnswer }) => {
//   useEffect(() => {
//     if (sharedStream && videoRef.current) {
//       videoRef.current.srcObject = sharedStream;

//       // Add event listener for errors (optional but useful for debugging)
//       videoRef.current.addEventListener('error', (event) => {
//         console.error('Video playback error:', event);
//       });
//     }

//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [sharedStream, videoRef]);

//   return (
//     <div>
//       <h2>Shared Content</h2>
//       <video ref={videoRef} controls autoPlay style={{ width: '100%', height: 'auto' }} />
//       {qaHistory.map((qa, index) => (
//         <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
//           <div style={{ flex: 1, padding: '10px' }}>
//             <h4>Question</h4>
//             <p>{qa.question}</p>
//           </div>
//           <div style={{ flex: 1, padding: '10px' }}>
//             <h4>Answer</h4>
//             <p>{qa.answer}</p>
           
//               <p>
//                 Time Taken: {qa?.timeTaken?.hours} hours, {qa?.timeTaken?.minutes} minutes, {qa?.timeTaken?.seconds} seconds
//               </p>
           
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TabSharing;



import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const socket = io('http://localhost:3001'); // Connect to your Socket.io server

const TabSharing = () => {
  const [sharedContent, setSharedContent] = useState(null);
  const [qaHistory, setQAHistory] = useState([]); // Store question history
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef(null);
  const speechConfig = useRef(null);
  const audioConfig = useRef(null);
  const recognizer = useRef(null);

  useEffect(() => {
    // Initialize Azure Speech SDK configurations
    speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
    speechConfig.current.speechRecognitionLanguage = 'en-US';

    // Socket.io event listeners
    socket.on('answerFromServer', handleAnswerFromServer);

    return () => {
      socket.off('answerFromServer', handleAnswerFromServer);
    };
  }, []);

  const handleStartSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          systemAudio: 'include',
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100, // Higher sample rate for better quality
        },
      });

      if (!stream) {
        throw new Error('Failed to obtain media stream.');
      }

      setSharedContent(stream);

      const audioTracks = stream.getAudioTracks();
      const audioStream = new MediaStream([audioTracks[0]]);

      audioConfig.current = sdk.AudioConfig.fromStreamInput(audioStream);
      recognizer.current = new sdk.SpeechRecognizer(speechConfig.current, audioConfig.current);

      recognizer.current.recognizing = (s, e) => {
        console.log(`RECOGNIZING: Text=${e.result.text}`);
      };

      recognizer.current.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          console.log(`RECOGNIZED: Text=${e.result.text}`);
          const currentTime = new Date();
          const newQuestion = {
            question: e.result.text,
            startTime: currentTime,
            completionTime: null,
            updateTimes: [currentTime],
            currentTime: currentTime,
            answer: '', // Initialize an empty answer field
          };

          setQAHistory(prevHistory => [...prevHistory, newQuestion]);

          socket.emit('questionToServer', { question: e.result.text }); // Send question to backend via Socket.io
        } else if (e.result.reason === sdk.ResultReason.NoMatch) {
          console.log('NOMATCH: Speech could not be recognized.');
        }
      };

      recognizer.current.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`);
        if (e.reason === sdk.CancellationReason.Error) {
          console.error(`CANCELED: ErrorDetails=${e.errorDetails}`);
        }
        recognizer.current.stopContinuousRecognitionAsync();
      };

      recognizer.current.sessionStopped = (s, e) => {
        console.log('Session stopped.');

        setQAHistory(prevHistory => {
          const lastQuestionIndex = prevHistory.length - 1;

          if (lastQuestionIndex >= 0) {
            const updatedQA = [...prevHistory];
            updatedQA[lastQuestionIndex].completionTime = new Date();
            return updatedQA;
          }
          return prevHistory;
        });

        recognizer.current.stopContinuousRecognitionAsync();
      };

      recognizer.current.startContinuousRecognitionAsync();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const handleStopSharing = () => {
    if (recognizer.current && isRecording) {
      recognizer.current.stopContinuousRecognitionAsync();
      setIsRecording(false);
    }
  };

  const handleAnswerFromServer = (answer) => {
    setQAHistory(prevHistory => {
      const lastQuestionIndex = prevHistory.length - 1;

      if (lastQuestionIndex >= 0) {
        const updatedQA = [...prevHistory];
        updatedQA[lastQuestionIndex].answer = answer;
        return updatedQA;
      }
      return prevHistory;
    });
  };

  return (
    <div>
      {!isRecording ? (
        <button onClick={handleStartSharing}>Start Sharing</button>
      ) : (
        <button onClick={handleStopSharing}>Stop Sharing</button>
      )}
      <SharedContent sharedStream={sharedContent} videoRef={videoRef} qaHistory={qaHistory} />
    </div>
  );
};

const SharedContent = ({ sharedStream, videoRef, qaHistory }) => {
  useEffect(() => {
    if (sharedStream && videoRef.current) {
      videoRef.current.srcObject = sharedStream;

      // Add event listener for errors (optional but useful for debugging)
      videoRef.current.addEventListener('error', (event) => {
        console.error('Video playback error:', event);
      });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [sharedStream, videoRef]);

  return (
    <div>
      <h2>Shared Content</h2>
      <video ref={videoRef} controls autoPlay style={{ width: '100%', height: 'auto' }} />
      {qaHistory.map((qa, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <h4>Question</h4>
            <p>{qa.question}</p>
            <div>
              {qa.updateTimes.map((time, timeIndex) => (
                <p key={timeIndex}>{time.toLocaleTimeString()}</p>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <h4>Answer</h4>
            <p>{qa.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabSharing;
