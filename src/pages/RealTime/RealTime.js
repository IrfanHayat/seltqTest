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



// import React, { useState, useRef, useEffect } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:3001'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [qaHistory, setQAHistory] = useState([]); // Store question history
//   const [isRecording, setIsRecording] = useState(false);

//   const videoRef = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';

//     // Socket.io event listeners
//     socket.on('answerFromServer', handleAnswerFromServer);

//     return () => {
//       socket.off('answerFromServer', handleAnswerFromServer);
//     };
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
//           const currentTime = new Date();
//           const newQuestion = {
//             question: e.result.text,
//             startTime: currentTime,
//             completionTime: null,
//             updateTimes: [currentTime],
//             currentTime: currentTime,
//             answer: '', // Initialize an empty answer field
//           };

//           setQAHistory(prevHistory => [...prevHistory, newQuestion]);

//           socket.emit('questionToServer', { question: e.result.text }); // Send question to backend via Socket.io
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

//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].completionTime = new Date();
//             return updatedQA;
//           }
//           return prevHistory;
//         });

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

//   const handleAnswerFromServer = (answer) => {
//     setQAHistory(prevHistory => {
//       const lastQuestionIndex = prevHistory.length - 1;

//       if (lastQuestionIndex >= 0) {
//         const updatedQA = [...prevHistory];
//         updatedQA[lastQuestionIndex].answer = answer;
//         return updatedQA;
//       }
//       return prevHistory;
//     });
//   };

//   return (
//     <div>
//       {!isRecording ? (
//         <button onClick={handleStartSharing}>Start Sharing</button>
//       ) : (
//         <button onClick={handleStopSharing}>Stop Sharing</button>
//       )}
//       <SharedContent sharedStream={sharedContent} videoRef={videoRef} qaHistory={qaHistory} />
//     </div>
//   );
// };

// const SharedContent = ({ sharedStream, videoRef, qaHistory }) => {
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
//         <div key={index} style={{ marginBottom: '20px' }}>
//           <div style={{ marginBottom: '10px' }}>
//             <h4>Question</h4>
//             <p>{qa.question}</p>
//             <div>
//               {qa.updateTimes.map((time, timeIndex) => (
//                 <p key={timeIndex}>{time.toLocaleTimeString()}</p>
//               ))}
//             </div>
//           </div>
//           <div style={{ marginBottom: '10px' }}>
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
//   const [qaHistory, setQAHistory] = useState([]); // Store question history
//   const [isRecording, setIsRecording] = useState(false);

//   const videoRef = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';

//     // Socket.io event listeners
//     socket.on('answerFromServer', handleAnswerFromServer);

//     return () => {
//       socket.off('answerFromServer', handleAnswerFromServer);
//     };
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
//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0 && prevHistory[lastQuestionIndex].completionTime === null) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].question = e.result.text;
//             return updatedQA;
//           } else {
//             const newQuestion = {
//               question: e.result.text,
//               startTime: new Date(),
//               completionTime: null,
//               answer: '', // Initialize an empty answer field
//             };
//             return [...prevHistory, newQuestion];
//           }
//         });
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`RECOGNIZED: Text=${e.result.text}`);
//           setQAHistory(prevHistory => {
//             const updatedQA = [...prevHistory];
//             updatedQA[updatedQA.length - 1].question = e.result.text;
//             updatedQA[updatedQA.length - 1].completionTime = new Date();
//             return updatedQA;
//           });

//           socket.emit('questionToServer', { question: e.result.text }); // Send question to backend via Socket.io
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

//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].completionTime = new Date();
//             return updatedQA;
//           }
//           return prevHistory;
//         });

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

//   const handleAnswerFromServer = (answer) => {
//     setQAHistory(prevHistory => {
//       const lastQuestionIndex = prevHistory.length - 1;

//       if (lastQuestionIndex >= 0) {
//         const updatedQA = [...prevHistory];
//         updatedQA[lastQuestionIndex].answer = answer;
//         return updatedQA;
//       }
//       return prevHistory;
//     });
//   };

//   return (
//     <div>
//       {!isRecording ? (
//         <button onClick={handleStartSharing}>Start Sharing</button>
//       ) : (
//         <button onClick={handleStopSharing}>Stop Sharing</button>
//       )}
//       <SharedContent sharedStream={sharedContent} videoRef={videoRef} qaHistory={qaHistory} />
//     </div>
//   );
// };

// const SharedContent = ({ sharedStream, videoRef, qaHistory }) => {
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
//       <video ref={videoRef} controls autoPlay style={{ width: '100%', height: 'auto',visibility:'hidden' }} />
//       {qaHistory.map((qa, index) => (
//         <div key={index} style={{ marginBottom: '20px' }}>
//           <div style={{ marginBottom: '10px' }}>
//             <h4>Question</h4>
//             <p>{qa.question}</p>
//             <p>{qa.startTime.toLocaleTimeString()}</p>
//           </div>
//           <div style={{ marginBottom: '10px' }}>
//             <h4>Answer</h4>
//             <p>{qa.answer}</p>
//             <p>{qa.startTime.toLocaleTimeString()}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TabSharing;


// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:3001'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [qaHistory, setQAHistory] = useState([]); // Store question history
//   const [isRecording, setIsRecording] = useState(false);
//   const [currentAnswer, setCurrentAnswer] = useState(''); // For managing the progressive answer

//   const videoRef = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';

//     // Socket.io event listeners
//     socket.on('answerFromServer', handleAnswerFromServer);

//     return () => {
//       socket.off('answerFromServer', handleAnswerFromServer);
//     };
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
//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0 && prevHistory[lastQuestionIndex].completionTime === null) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].question = e.result.text;
//             return updatedQA;
//           } else {
//             const newQuestion = {
//               question: e.result.text,
//               startTime: new Date(),
//               completionTime: null,
//               answer: '', // Initialize an empty answer field
//             };
//             return [...prevHistory, newQuestion];
//           }
//         });
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`RECOGNIZED: Text=${e.result.text}`);
//           setQAHistory(prevHistory => {
//             const updatedQA = [...prevHistory];
//             updatedQA[updatedQA.length - 1].question = e.result.text;
//             updatedQA[updatedQA.length - 1].completionTime = new Date();
//             return updatedQA;
//           });

//           socket.emit('questionToServer', { question: e.result.text, history: qaHistory }); // Send question to backend via Socket.io
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

//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].completionTime = new Date();
//             return updatedQA;
//           }
//           return prevHistory;
//         });

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

//   const handleAnswerFromServer = (answer) => {
//     setCurrentAnswer(answer); // Set the full answer to progressively display it
//   };

//   // useEffect to handle the word-by-word update
//   useEffect(() => {
//     if (currentAnswer) {
//       const words = currentAnswer.split(' ');
//       let currentWordIndex = 0;
//       let displayedText = '';

//       const interval = 50; // Time between words in milliseconds

//       const timer = setInterval(() => {
//         if (currentWordIndex < words.length) {
//           displayedText += words[currentWordIndex] + ' ';
//           setQAHistory(prevHistory => {
//             const lastQuestionIndex = prevHistory.length - 1;

//             if (lastQuestionIndex >= 0) {
//               const updatedQA = [...prevHistory];
//               updatedQA[lastQuestionIndex].answer = displayedText;
//               return updatedQA;
//             }
//             return prevHistory;
//           });
//           currentWordIndex++;
//         } else {
//           clearInterval(timer);
//         }
//       }, interval);

//       return () => clearInterval(timer);
//     }
//   }, [currentAnswer]);

//   return (
//     <div>
//       {!isRecording ? (
//         <button onClick={handleStartSharing}>Start Sharing</button>
//       ) : (
//         <button onClick={handleStopSharing}>Stop Sharing</button>
//       )}
//       <SharedContent sharedStream={sharedContent} videoRef={videoRef} qaHistory={qaHistory} />
//     </div>
//   );
// };

// const SharedContent = ({ sharedStream, videoRef, qaHistory }) => {
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
//       <video ref={videoRef} controls autoPlay style={{ width: '1px', height: '1px', visibility: 'hidden' }} />
//       {qaHistory.map((qa, index) => (
//         <div key={index} style={{ marginBottom: '20px' }}>
//           <div style={{ marginBottom: '10px' }}>
//             <h4>Question</h4>
//             <p>{qa.question}</p>
//             <p>{qa.startTime.toLocaleTimeString()}</p>
//           </div>
//           <div style={{ marginBottom: '10px' }}>
//             <h4>Answer</h4>
//             <p>{qa.answer}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TabSharing;


// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:3001'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [qaHistory, setQAHistory] = useState([]); // Store question history
//   const [isRecording, setIsRecording] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState(''); // For managing the current question
//   const [currentAnswer, setCurrentAnswer] = useState(''); // For managing the progressive answer

//   const videoRef = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';

//     // Socket.io event listeners
//     socket.on('answerFromServer', handleAnswerFromServer);

//     return () => {
//       socket.off('answerFromServer', handleAnswerFromServer);
//     };
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
//         setCurrentQuestion(e.result.text); // Update current question
//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0 && prevHistory[lastQuestionIndex].completionTime === null) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].question = e.result.text;
//             return updatedQA;
//           } else {
//             const newQuestion = {
//               question: e.result.text,
//               startTime: new Date(),
//               completionTime: null,
//               answer: '', // Initialize an empty answer field
//             };
//             return [...prevHistory, newQuestion];
//           }
//         });
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`RECOGNIZED: Text=${e.result.text}`);
//           setQAHistory(prevHistory => {
//             const updatedQA = [...prevHistory];
//             updatedQA[updatedQA.length - 1].question = e.result.text;
//             updatedQA[updatedQA.length - 1].completionTime = new Date();
//             return updatedQA;
//           });

//           socket.emit('questionToServer', { question: e.result.text, history: qaHistory }); // Send question to backend via Socket.io
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

//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].completionTime = new Date();
//             return updatedQA;
//           }
//           return prevHistory;
//         });

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

//   const handleAnswerFromServer = (answer) => {
//     setCurrentAnswer(answer);
//     setQAHistory(prevHistory => {
//             const lastQuestionIndex = prevHistory.length - 1;
      
//             if (lastQuestionIndex >= 0) {
//               const updatedQA = [...prevHistory];
//               updatedQA[lastQuestionIndex].answer = answer;
//               return updatedQA;
//             }
//             return prevHistory;
//           });

//      // Set the full answer to progressively display it
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       <div style={{ flex: 1 }}>
//         {!isRecording ? (
//           <button onClick={handleStartSharing}>Start Sharing</button>
//         ) : (
//           <button onClick={handleStopSharing}>Stop Sharing</button>
//         )}
       
//       </div>
//       <InterviewerSection question={currentQuestion} />
//       <SharedContent sharedStream={sharedContent}  currentAnswer={currentAnswer} videoRef={videoRef} qaHistory={qaHistory} />
//     </div>
//   );
// };

// const InterviewerSection = ({ question }) => (
//   <div>
//     <h2>Interviewer Section</h2>
//     <div style={{ marginBottom: '20px' }}>
//       <h4>Current Question</h4>
//       <p>{question}</p>
//     </div>
//   </div>
// );



// const SharedContent = ({ sharedStream, videoRef,currentAnswer, qaHistory }) => {
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
//       <video ref={videoRef} controls autoPlay style={{ width: '1px', height: '1px', visibility: 'hidden' }} />
//       <p>
//         Current answer
//       </p>
//       <p> {currentAnswer && (
//       <div style={{ marginBottom: '20px' }}>
//         <h4>Current Answer</h4>
//         <p>{currentAnswer}</p>
//       </div>
//     )}</p>
//       {qaHistory.map((qa, index) => (
//         <div key={index} style={{ marginBottom: '20px' }}>
//           <div style={{ marginBottom: '10px' }}>
//             <h4>Question</h4>
//             <p>{qa.question}</p>
//             <p>{qa.startTime.toLocaleTimeString()}</p>
//           </div>
//           <div style={{ marginBottom: '10px' }}>
//             <h4>Answer</h4>
//             <p>{qa.answer}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TabSharing;



// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:3001'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [qaHistory, setQAHistory] = useState([]); // Store question history
//   const [isRecording, setIsRecording] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState(''); // For managing the current question
//   const [currentAnswer, setCurrentAnswer] = useState(''); // For managing the progressive answer

//   const videoRef = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';

//     // Socket.io event listeners
//     socket.on('answerFromServer', handleAnswerFromServer);

//     return () => {
//       socket.off('answerFromServer', handleAnswerFromServer);
//     };
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
//         setCurrentQuestion(e.result.text); // Update current question
//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0 && prevHistory[lastQuestionIndex].completionTime === null) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].question = e.result.text;
//             return updatedQA;
//           } else {
//             const newQuestion = {
//               question: e.result.text,
//               startTime: new Date(),
//               completionTime: null,
//               answer: '', // Initialize an empty answer field
//             };
//             return [...prevHistory, newQuestion];
//           }
//         });
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`RECOGNIZED: Text=${e.result.text}`);
//           setQAHistory(prevHistory => {
//             const updatedQA = [...prevHistory];
//             updatedQA[updatedQA.length - 1].question = e.result.text;
//             updatedQA[updatedQA.length - 1].completionTime = new Date();
//             return updatedQA;
//           });

//           socket.emit('questionToServer', { question: e.result.text, history: qaHistory }); // Send question to backend via Socket.io
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

//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].completionTime = new Date();
//             return updatedQA;
//           }
//           return prevHistory;
//         });

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

//   const handleAnswerFromServer = (answer) => {
//     setCurrentAnswer(answer);
//     setQAHistory(prevHistory => {
//       const lastQuestionIndex = prevHistory.length - 1;

//       if (lastQuestionIndex >= 0) {
//         const updatedQA = [...prevHistory];
//         updatedQA[lastQuestionIndex].answer = answer;
//         return updatedQA;
//       }
//       return prevHistory;
//     });

//     // Set the full answer to progressively display it
//   };

//   return (
//     <div style={{ display: 'flex', border: '1px solid black' }}>
//       <div style={{ flex: 1, width: '20%', border: '1px solid black', padding: '10px' }}>
//         {!isRecording ? (
//           <button onClick={handleStartSharing}>Start Sharing</button>
//         ) : (
//           <button onClick={handleStopSharing}>Stop Sharing</button>
//         )}
//         <InterviewerSection question={currentQuestion} />
//       </div>
//       <div style={{ flex: 4, width: '80%', border: '1px solid black', padding: '10px' }}>
//         <SharedContent sharedStream={sharedContent} currentAnswer={currentAnswer} videoRef={videoRef} qaHistory={qaHistory} />
//       </div>
//     </div>
//   );
// };

// const InterviewerSection = ({ question }) => (
//   <div>
//     <h2>Interviewer Section</h2>
//     <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//       <h4>Current Question</h4>
//       <p>{question}</p>
//     </div>
//   </div>
// );

// const SharedContent = ({ sharedStream, videoRef, currentAnswer, qaHistory }) => {
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
//       <video ref={videoRef} controls autoPlay style={{ width: '1px', height: '1px', visibility: 'hidden' }} />
//       <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//         <h4>Current Answer</h4>
//         <p>{currentAnswer}</p>
//       </div>
//       <div  style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//       {qaHistory.map((qa, index) => (
//         <div>
//           <div style={{ marginBottom: '10px' }}>
//             <h4>Question</h4>
//             <p>{qa.question}</p>
//             <p>{qa.startTime.toLocaleTimeString()}</p>
//           </div>
//           <div style={{ marginBottom: '10px' }}>
//             <h4>Answer</h4>
//             <p>{qa.answer}</p>
//           </div>
//           </div>
           
        
//       ))}
//       </div>
//     </div>
//   );
// };

// export default TabSharing;




// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:8000'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [qaHistory, setQAHistory] = useState([]); // Store question history
//   const [isRecording, setIsRecording] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState(''); // For managing the current question
//   const [currentAnswer, setCurrentAnswer] = useState(''); // For managing the progressive answer
//   const [userResponse, setUserResponse] = useState(''); // For managing the user's response

//   const videoRef = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);
//   const userAudioRecognizer = useRef(null); // Recognizer for user's audio

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';

//     // Socket.io event listeners
//     socket.on('answerFromServer', handleAnswerFromServer);

//     return () => {
//       socket.off('answerFromServer', handleAnswerFromServer);
//     };
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

//       // Configure user's audio recognizer
//       const userAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const userAudioConfig = sdk.AudioConfig.fromStreamInput(userAudioStream);
//       userAudioRecognizer.current = new sdk.SpeechRecognizer(speechConfig.current, userAudioConfig);

//       recognizer.current.recognizing = (s, e) => {
//         console.log(`RECOGNIZING: Text=${e.result.text}`);
//         setCurrentQuestion(e.result.text); // Update current question
//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0 && prevHistory[lastQuestionIndex].completionTime === null) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].question = e.result.text;
//             return updatedQA;
//           } else {
//             const newQuestion = {
//               question: e.result.text,
//               startTime: new Date(),
//               completionTime: null,
//               answer: '', // Initialize an empty answer field
//               userResponse: '', // Initialize an empty user response field
//             };
//             return [...prevHistory, newQuestion];
//           }
//         });
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`RECOGNIZED: Text=${e.result.text}`);
//           setQAHistory(prevHistory => {
//             const updatedQA = [...prevHistory];
//             updatedQA[updatedQA.length - 1].question = e.result.text;
//             updatedQA[updatedQA.length - 1].completionTime = new Date();
//             return updatedQA;
//           });

//           socket.emit('questionToServer', { question: e.result.text, history: qaHistory }); // Send question to backend via Socket.io
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

//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].completionTime = new Date();
//             return updatedQA;
//           }
//           return prevHistory;
//         });

//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.startContinuousRecognitionAsync();
//       setIsRecording(true);

//       // Start recognizing user's audio
//       userAudioRecognizer.current.recognizing = (s, e) => {
//         setUserResponse(e.result.text); // Update user's response
//       };

//       userAudioRecognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           setUserResponse(e.result.text);
//           setQAHistory(prevHistory => {
//             const updatedQA = [...prevHistory];
//             updatedQA[updatedQA.length - 1].userResponse = e.result.text;
//             return updatedQA;
//           });
//         } else if (e.result.reason === sdk.ResultReason.NoMatch) {
//           console.log('NOMATCH: User speech could not be recognized.');
//         }
//       };

//       userAudioRecognizer.current.canceled = (s, e) => {
//         console.log(`CANCELED: Reason=${e.reason}`);
//         if (e.reason === sdk.CancellationReason.Error) {
//           console.error(`CANCELED: ErrorDetails=${e.errorDetails}`);
//         }
//         userAudioRecognizer.current.stopContinuousRecognitionAsync();
//       };

//       userAudioRecognizer.current.sessionStopped = (s, e) => {
//         console.log('User audio session stopped.');
//         userAudioRecognizer.current.stopContinuousRecognitionAsync();
//       };

//       userAudioRecognizer.current.startContinuousRecognitionAsync();
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   const handleStopSharing = () => {
//     if (recognizer.current && isRecording) {
//       recognizer.current.stopContinuousRecognitionAsync();
//       userAudioRecognizer.current.stopContinuousRecognitionAsync();
//       setIsRecording(false);
//     }
//   };

//   const handleAnswerFromServer = (answer) => {
//     setCurrentAnswer(answer);
//     setQAHistory(prevHistory => {
//       const lastQuestionIndex = prevHistory.length - 1;

//       if (lastQuestionIndex >= 0) {
//         const updatedQA = [...prevHistory];
//         updatedQA[lastQuestionIndex].answer = answer;
//         return updatedQA;
//       }
//       return prevHistory;
//     });
//   };

//   return (
//     <div style={{ display: 'flex', border: '1px solid black' }}>
//       <div style={{ flex: 1, width: '20%', border: '1px solid black', padding: '10px' }}>
//         {!isRecording ? (
//           <button onClick={handleStartSharing}>Start Sharing</button>
//         ) : (
//           <button onClick={handleStopSharing}>Stop Sharing</button>
//         )}
//         <InterviewerSection question={currentQuestion} />
//       </div>
//       <div style={{ flex: 4, width: '80%', border: '1px solid black', padding: '10px' }}>
//         <SharedContent sharedStream={sharedContent} currentAnswer={currentAnswer} videoRef={videoRef} qaHistory={qaHistory} userResponse={userResponse} />
//       </div>
//     </div>
//   );
// };

// const InterviewerSection = ({ question }) => (
//   <div>
//     <h2>Interviewer Section</h2>
//     <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//       <h4>Current Question</h4>
//       <p>{question}</p>
//     </div>
//   </div>
// );

// const SharedContent = ({ sharedStream, videoRef, currentAnswer, qaHistory, userResponse }) => {
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
//       <video ref={videoRef} controls autoPlay style={{ width: '1px', height: '1px', visibility: 'hidden' }} />
//       <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//         <h4>Current Answer</h4>
//         <p>{currentAnswer}</p>
//       </div>
//       <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//         <h4>User Response</h4>
//         <p>{userResponse}</p>
//       </div>
//       <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//         <h4>History</h4>
//         {qaHistory.map((qa, index) => (
//           <div key={index}>
//             <div style={{ marginBottom: '10px' }}>
//               <h4>Question</h4>
//               <p>{qa.question}</p>
//               <p>{qa.startTime.toLocaleTimeString()}</p>
//             </div>
//             <div style={{ marginBottom: '10px' }}>
//               <h4>Answer</h4>
//               <p>{qa.answer}</p>
//             </div>
            
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TabSharing;



// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:8000'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [qaHistory, setQAHistory] = useState([]); // Store question history
//   const [isRecording, setIsRecording] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState(''); // For managing the current question
//   const [currentAnswer, setCurrentAnswer] = useState(''); // For managing the progressive answer
//   const [userResponse, setUserResponse] = useState(''); // For managing the user's response

//   const videoRef = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);
//   const userAudioRecognizer = useRef(null); // Recognizer for user's audio

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';

//     // Socket.io event listeners
//     socket.on('answerFromServer', handleAnswerFromServer);

//     return () => {
//       socket.off('answerFromServer', handleAnswerFromServer);
//     };
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

//       // Configure user's audio recognizer
//       const userAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const userAudioConfig = sdk.AudioConfig.fromStreamInput(userAudioStream);
//       userAudioRecognizer.current = new sdk.SpeechRecognizer(speechConfig.current, userAudioConfig);

//       recognizer.current.recognizing = (s, e) => {
//         console.log(`RECOGNIZING: Text=${e.result.text}`);
//         setCurrentQuestion(e.result.text); // Update current question
//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0 && prevHistory[lastQuestionIndex].completionTime === null) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].question = e.result.text;
//             return updatedQA;
//           } else {
//             const newQuestion = {
//               question: e.result.text,
//               startTime: new Date(),
//               completionTime: null,
//               answer: '', // Initialize an empty answer field
//               userResponse: '', // Initialize an empty user response field
//             };
//             return [...prevHistory, newQuestion];
//           }
//         });
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`RECOGNIZED: Text=${e.result.text}`);
//           setQAHistory(prevHistory => {
//             const updatedQA = [...prevHistory];
//             updatedQA[updatedQA.length - 1].question = e.result.text;
//             updatedQA[updatedQA.length - 1].completionTime = new Date();
//             return updatedQA;
//           });

//           socket.emit('questionToServer', { question: e.result.text, history: qaHistory }); // Send question to backend via Socket.io
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

//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].completionTime = new Date();
//             return updatedQA;
//           }
//           return prevHistory;
//         });

//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.startContinuousRecognitionAsync();
//       setIsRecording(true);

//       // Start recognizing user's audio
//       userAudioRecognizer.current.recognizing = (s, e) => {
//         setUserResponse(e.result.text); // Update user's response
//       };

//       userAudioRecognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           setUserResponse(e.result.text);
//           setQAHistory(prevHistory => {
//             const updatedQA = [...prevHistory];
//             updatedQA[updatedQA.length - 1].userResponse = e.result.text;
//             return updatedQA;
//           });
//         } else if (e.result.reason === sdk.ResultReason.NoMatch) {
//           console.log('NOMATCH: User speech could not be recognized.');
//         }
//       };

//       userAudioRecognizer.current.canceled = (s, e) => {
//         console.log(`CANCELED: Reason=${e.reason}`);
//         if (e.reason === sdk.CancellationReason.Error) {
//           console.error(`CANCELED: ErrorDetails=${e.errorDetails}`);
//         }
//         userAudioRecognizer.current.stopContinuousRecognitionAsync();
//       };

//       userAudioRecognizer.current.sessionStopped = (s, e) => {
//         console.log('User audio session stopped.');
//         userAudioRecognizer.current.stopContinuousRecognitionAsync();
//       };

//       userAudioRecognizer.current.startContinuousRecognitionAsync();
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   const handleStopSharing = () => {
//     if (recognizer.current && isRecording) {
//       recognizer.current.stopContinuousRecognitionAsync();
//       userAudioRecognizer.current.stopContinuousRecognitionAsync();
//       setIsRecording(false);
//     }
//   };

//   const handleAnswerFromServer = (answer) => {
//     setCurrentAnswer(answer);
//     setQAHistory(prevHistory => {
//       const lastQuestionIndex = prevHistory.length - 1;

//       if (lastQuestionIndex >= 0) {
//         const updatedQA = [...prevHistory];
//         updatedQA[lastQuestionIndex].answer = answer;
//         return updatedQA;
//       }
//       return prevHistory;
//     });
//   };

//   useEffect(() => {
//     handleStartSharing();
//   }, []);

//   return (
//     <div style={{ display: 'flex', border: '1px solid black' }}>
//       <div style={{ flex: 1, width: '20%', border: '1px solid black', padding: '10px' }}>
//         <InterviewerSection question={currentQuestion} />
//       </div>
//       <div style={{ flex: 4, width: '80%', border: '1px solid black', padding: '10px' }}>
//         <SharedContent sharedStream={sharedContent} currentAnswer={currentAnswer} videoRef={videoRef} qaHistory={qaHistory} userResponse={userResponse} />
//       </div>
//     </div>
//   );
// };

// const InterviewerSection = ({ question }) => (
//   <div>
//     <h2>Interviewer Section</h2>
//     <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//       <h4>Current Question</h4>
//       <p>{question}</p>
//     </div>
//   </div>
// );

// const SharedContent = ({ sharedStream, videoRef, currentAnswer, qaHistory, userResponse }) => {
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
//       <video ref={videoRef} controls autoPlay style={{ width: '1px', height: '1px', visibility: 'hidden' }} />
//       <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//         <h4>Current Answer</h4>
//         <p>{currentAnswer}</p>
//       </div>
//       <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//         <h4>User Response</h4>
//         <p>{userResponse}</p>
//       </div>
//       <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
//         <h4>History</h4>
//         {qaHistory.map((qa, index) => (
//           <div key={index}>
//             <div style={{ marginBottom: '10px' }}>
//               <h4>Question</h4>
//               <p>{qa.question}</p>
//               <p>{qa.startTime.toLocaleTimeString()}</p>
//             </div>
//             <div style={{ marginBottom: '10px' }}>
//               <h4>Answer</h4>
//               <p>{qa.answer}</p>
//             </div>
            
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TabSharing;


// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// const socket = io('http://localhost:8000'); // Connect to your Socket.io server

// const TabSharing = () => {
//   const [sharedContent, setSharedContent] = useState(null);
//   const [qaHistory, setQAHistory] = useState([]); // Store question history
//   const [isRecording, setIsRecording] = useState(false);
//   const [isPaused, setIsPaused] = useState(false); // For managing the paused state
//   const [currentQuestion, setCurrentQuestion] = useState(''); // For managing the current question
//   const [currentAnswer, setCurrentAnswer] = useState(''); // For managing the progressive answer
//   const [userResponse, setUserResponse] = useState(''); // For managing the user's response

//   const videoRef = useRef(null);
//   const speechConfig = useRef(null);
//   const audioConfig = useRef(null);
//   const recognizer = useRef(null);
//   const recognitionRef = useRef(null); // For Web Speech API

//   useEffect(() => {
//     // Initialize Azure Speech SDK configurations
//     speechConfig.current = sdk.SpeechConfig.fromSubscription('ba35918e9cab49f2a983089f2f4a2fc0', 'southcentralus');
//     speechConfig.current.speechRecognitionLanguage = 'en-US';

//     // Socket.io event listeners
//     socket.on('answerFromServer', handleAnswerFromServer);

//     return () => {
//       socket.off('answerFromServer', handleAnswerFromServer);
//       handleStopSharing(); // Ensure to stop sharing when component unmounts
//     };
//   }, []);

//   useEffect(() => {
//     if (window.SpeechRecognition || window.webkitSpeechRecognition) {
//       recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//       recognitionRef.current.lang = 'en-US';
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = true;
      
//       recognitionRef.current.onresult = (event) => {
//         if (!isPaused) {
//           const transcript = Array.from(event.results)
//             .map(result => result[0].transcript)
//             .join('');
//           setUserResponse(transcript);
          
//           // Update QA history
//           setQAHistory(prevHistory => {
//             const lastQuestionIndex = prevHistory.length - 1;
//             if (lastQuestionIndex >= 0) {
//               const updatedQA = [...prevHistory];
//               updatedQA[lastQuestionIndex].userResponse = transcript;
//               return updatedQA;
//             }
//             return prevHistory;
//           });
//         }
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//       };

//       recognitionRef.current.onend = () => {
//         if (isRecording) {
//           recognitionRef.current.start(); // Restart recognition if recording
//         }
//       };
//     } else {
//       console.warn('Speech Recognition API not supported in this browser.');
//     }
//   }, [isRecording, isPaused]);

//   const handleStartSharing = async () => {
//     try {
//       // if (sharedContent) {
//       //   console.log('Already sharing. Skipping start.');
//       //   return;
//       // }

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
//         if (!isPaused) {
//           console.log(`RECOGNIZING: Text=${e.result.text}`);
//           setCurrentQuestion(e.result.text); // Update current question
//           setQAHistory(prevHistory => {
//             const lastQuestionIndex = prevHistory.length - 1;

//             if (lastQuestionIndex >= 0 && prevHistory[lastQuestionIndex].completionTime === null) {
//               const updatedQA = [...prevHistory];
//               updatedQA[lastQuestionIndex].question = e.result.text;
//               return updatedQA;
//             } else {
//               const newQuestion = {
//                 question: e.result.text,
//                 startTime: new Date(),
//                 completionTime: null,
//                 answer: '', // Initialize an empty answer field
//                 userResponse: '', // Initialize an empty user response field
//               };
//               return [...prevHistory, newQuestion];
//             }
//           });
//         }
//       };

//       recognizer.current.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           if (!isPaused) {
//             console.log(`RECOGNIZED: Text=${e.result.text}`);
//             setQAHistory(prevHistory => {
//               const updatedQA = [...prevHistory];
//               updatedQA[updatedQA.length - 1].question = e.result.text;
//               updatedQA[updatedQA.length - 1].completionTime = new Date();
//               return updatedQA;
//             });

//             socket.emit('questionToServer', { question: e.result.text, history: qaHistory }); // Send question to backend via Socket.io
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

//         setQAHistory(prevHistory => {
//           const lastQuestionIndex = prevHistory.length - 1;

//           if (lastQuestionIndex >= 0) {
//             const updatedQA = [...prevHistory];
//             updatedQA[lastQuestionIndex].completionTime = new Date();
//             return updatedQA;
//           }
//           return prevHistory;
//         });

//         recognizer.current.stopContinuousRecognitionAsync();
//       };

//       recognizer.current.startContinuousRecognitionAsync();
//       setIsRecording(true);

//       // Start recognizing user's audio with Web Speech API
//       if (recognitionRef.current) {
//         recognitionRef.current.start();
//       }
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   const handleStopSharing = () => {
//     if (recognizer.current && isRecording) {
//       recognizer.current.stopContinuousRecognitionAsync();
//       setIsRecording(false);
//     }

//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//   };

//   const handleAnswerFromServer = (answer) => {
//     setCurrentAnswer(answer);
//     setQAHistory(prevHistory => {
//       const lastQuestionIndex = prevHistory.length - 1;

//       if (lastQuestionIndex >= 0) {
//         const updatedQA = [...prevHistory];
//         updatedQA[lastQuestionIndex].answer = answer;
//         return updatedQA;
//       }
//       return prevHistory;
//     });
//   };

//   const handlePause = () => {
//     if (isPaused) {
//       // Resume sharing
//       handleStartSharing();
//       setIsPaused(false);
//     } else {
//       // Pause sharing
//       if (recognizer.current) {
//         recognizer.current.stopContinuousRecognitionAsync();
//       }
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//       setIsPaused(true);
//     }
//   };

//   const handleComplete = () => {
//     handleStopSharing();
//     // Navigate to another page
//     window.location.href = '/another-page'; // Replace '/another-page' with your actual target route
//   };

//   useEffect(() => {
//     if (!isPaused) {
//       handleStartSharing();
//     }

//     return () => {
//       handleStopSharing();
//     };
//   }, [isPaused]);

//   return (
//     <div style={{ display: 'flex', border: '1px solid black' }}>
//       <div style={{ flex: 1, width: '20%', border: '1px solid black', padding: '10px' }}>
//         <InterviewerSection question={currentQuestion} />
//         <button onClick={handlePause}>{isPaused ? 'Resume' : 'Pause'}</button>
//         <button onClick={handleComplete}>Complete</button>
//       </div>
//       <div style={{ flex: 4, width: '80%', border: '1px solid black', padding: '10px' }}>
//         <SharedContent 
//           sharedStream={sharedContent} 
//           currentAnswer={currentAnswer} 
//           videoRef={videoRef} 
//           qaHistory={qaHistory} 
//           userResponse={userResponse}
//         />
//       </div>
//     </div>
//   );
// };

// const InterviewerSection = ({ question }) => {
//   return (
//     <div>
//       <h2>Interviewer Section</h2>
//       <p>{question}</p>
//     </div>
//   );
// };

// const SharedContent = ({ sharedStream, currentAnswer, videoRef, qaHistory, userResponse }) => {
//   useEffect(() => {
//     if (videoRef.current && sharedStream) {
//       videoRef.current.srcObject = sharedStream;
//     }
//   }, [sharedStream]);

//   return (
//     <div>
//       <h2>Shared Content</h2>
//       <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
//       <div>
//         <h3>Answer</h3>
//         <p>{currentAnswer}</p>
//         {userResponse && <p>{userResponse}</p>}
//       </div>
//       <div>
//         <h3>QA History</h3>
//         {qaHistory.map((qa, index) => (
//           <div key={index}>
//             <p><strong>Question:</strong> {qa.question}</p>
//             <p><strong>Answer:</strong> {qa.answer}</p>
//             <p><strong>User Response:</strong> {qa.userResponse}</p>
//             <p><strong>Start Time:</strong> {qa.startTime?.toLocaleString()}</p>
//             <p><strong>Completion Time:</strong> {qa.completionTime?.toLocaleString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TabSharing;


// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:4000');

// const TabSharing = () => {
//   const [fromAyatNumber, setFromAyatNumber] = useState(1);
//   const [toAyatNumber, setToAyatNumber] = useState(1);
//   const [ayats, setAyats] = useState([]);
//   const [transcription, setTranscription] = useState('');
//   const [feedback, setFeedback] = useState([]);
//   const [interimTranscript, setInterimTranscript] = useState('');

//   // Store color-coded words
//   const [coloredAyat, setColoredAyat] = useState([]);

//   // Fetch Ayats based on the given range
//   const fetchAyats = () => {
//     fetch('http://localhost:4000/ayatRange', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ fromAyat: fromAyatNumber, toAyat: toAyatNumber })
//     })
//       .then(response => response.json())
//       .then(data => setAyats(data))
//       .catch(err => console.error('Error fetching Ayats:', err));
//   };

//   useEffect(() => {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = 'ar-SA';
//     recognition.continuous = true;
//     recognition.interimResults = true;

//     recognition.onresult = (event) => {
//       // Initialize an array for interim transcriptions
//       const interimTranscriptArray = Array.from(event.results)
//           .map(result => result[0].transcript);

//       // Update interim transcripts in state
//       setInterimTranscript(interimTranscriptArray.join(' '));

//       // Process each recognized word
//       Array.from(event.results).forEach(result => {
//           if (result.isFinal) {
//               const finalWord = result[0].transcript.trim();
//               // Update the main transcript state
//               setTranscription(finalWord);

//               // Send recognized word to the WebSocket for real-time feedback
//               socket.emit('transcription', { fromAyat: fromAyatNumber, toAyat: toAyatNumber, text: finalWord });
//               socket.on('comparisonResult', (feedback) => {
//                 console.log('Received feedback:', feedback);
//                 setFeedback(feedback);
//               });
//           }
//       });
//   };

//   //   recognition.onresult = async (event) => {
//   //     // Get the entire transcription from the event
//   //     const result = event.results[event.resultIndex][0].transcript;
  
//   //     // Convert result to Uthmani script
//   //     const uthmaniResult = await convertToUthmani(result);
//   //     console.log(uthmaniResult)
//   //     // Update the transcription display (if needed)
//   //     setTranscription(uthmaniResult);
  
//   //     // Split the result into individual words
//   //     const words = uthmaniResult.split(' ');
  
//   //     // Send each word individually to the backend
//   //     words.forEach((word) => {
//   //         socket.emit('transcription', { fromAyat: fromAyatNumber, toAyat: toAyatNumber, text: word });
//   //     });
//   // };
  
//   // Function to convert Arabic to Uthmani script (example using an API)
  
//     recognition.onerror = (event) => {
//       setFeedback({ error: `Error: ${event.error}` });
//     };

//     recognition.start();

//     // Listen for comparison result from server
   
    

//     return () => {
//       recognition.stop();
//       socket.off('comparisonResult');
//     };
//   }, [fromAyatNumber, toAyatNumber]);

//   async function convertToUthmani(text) {
//     try {
//         const response = await fetch('https://api.quran.com/api/v4/quran/verses/uthmani', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ text })
//         });
//         const data = await response.json();
//         return data.uthmani_text || text;  // Return Uthmani text or original if not found
//     } catch (error) {
//         console.error('Conversion to Uthmani failed', error);
//         return text;  // Fallback to original text
//     }
// }

//   return (
//     <div>
//       <h1>Read Ayat</h1>

//       {/* Inputs for selecting Ayat range */}
//       <label>
//         From Ayat Number:
//         <input
//           type="number"
//           value={fromAyatNumber}
//           onChange={(e) => setFromAyatNumber(Number(e.target.value))}
//         />
//       </label>

//       <label>
//         To Ayat Number:
//         <input
//           type="number"
//           value={toAyatNumber}
//           onChange={(e) => setToAyatNumber(Number(e.target.value))}
//         />
//       </label>

//       <button onClick={fetchAyats}>Show Ayat Range</button>

//       {/* Display Ayats */}
//       {ayats.length > 0 && (
//         <div>
//           {ayats.map((ayat, index) => (
//             <p key={index}>
//               <strong>Ayat {fromAyatNumber + index}:</strong>
//               <span>{ ayat}</span>
//             </p>
//           ))}
//           <p>Transcription: {transcription}</p>
//           <p>IntermeTrxt: {interimTranscript}</p>

//           {/* Display feedback if available */}
//           {feedback && feedback.map((item, index) => (
//   <div key={index} style={{ color: 'red', marginBottom: '20px' }}>
//     <h2>Ayat:</h2>
//     <p>{item.ayat}</p>

//     <h3>Feedback:</h3>
//     {item.feedback.error && <p>Error: {item.feedback.error}</p>}
    
//     {item.feedback.missedWords.length > 0 && (
//       <p><strong>Missing Words:</strong> {item.feedback.missedWords.join(', ')}</p>
//     )}
    
//     {item.feedback.incorrectWords.length > 0 && (
//       <p><strong>Incorrect Words:</strong> {item.feedback.incorrectWords.join(', ')}</p>
//     )}
    
//     <p><strong>Correct Words Count:</strong> {item.feedback.correctWords.length}</p>
//   </div>
// ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TabSharing;


import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Load your Stripe public key (use test key during development)
const stripePromise = loadStripe('pk_test_GEOuWHQH1uEUrjldwBVHQ1LO00d5F6ooC8');  // Replace with your actual public Stripe key

const TabSharing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Function to create the checkout session on your backend
  const createCheckoutSession = async () => {
    try {
      setIsLoading(true);

      // Call your backend to create a Stripe Checkout session
      const response = await fetch('http://localhost:5000/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1QQiLbA28rAD9R8QkXHBbzoD',  // Replace with your actual price ID
        }),
      });

      const data = await response.json();
      const { sessionId } = data;  // Assuming your backend returns sessionId

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe Checkout Error:', error);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error creating Checkout session:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <button
        disabled={isLoading}
        onClick={createCheckoutSession}
      >
        {isLoading ? 'Loading...' : 'Checkout with Stripe'}
      </button>
    </div>
  );
};

export default TabSharing;
