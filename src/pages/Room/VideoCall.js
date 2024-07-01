import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function VideoCall() {
    const { roomId } = useParams();
    const containerRef = useRef(null);
    const audioStreamRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const appID = 177507006;
        const serverScreatId = 'dbf22027663c3c8e8b22ae024d893cac';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverScreatId, roomId, Date.now().toString(), "Irfan hayat");
        const zc = ZegoUIKitPrebuilt.create(kitToken);
        
        zc.joinRoom({
            container: containerRef.current,
            sharedLinks:[{
              name:'Copy link',
              url:`${process.env.REACT_APP_API_URL}videocall/${roomId}`
            }],
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall
            },
            showScreenSharingButton: false
        });

        // Initialize SpeechRecognition
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = event => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            console.log(transcript);
        };

        navigator.mediaDevices.getDisplayMedia({ video: true ,audio: true })
            .then(stream => {
                // Save the audio stream reference
                audioStreamRef.current = stream;
                console.log('Audio stream:', audioStreamRef.current);
                if (recognitionRef.current) {
                    recognitionRef.current.start();
                } else {
                    console.error('SpeechRecognition not initialized.');
                }
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
            });
        
        return () => {
            // Clean up Zego UI kit instance
            zc.destroy();
            // Stop SpeechRecognition
            
            if (recognitionRef.current && recognitionRef.current.state === 'listening') {
                recognitionRef.current.stop();
            }
        };
    }, [roomId]);

    return (
        <div ref={containerRef}></div>
    );
}

export default VideoCall;
