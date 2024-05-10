import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function VideoCall() {
    const { roomId } = useParams();
    const containerRef = useRef(null);

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

        return () => {
            // Clean up Zego UI kit instance
            zc.destroy();
        };
    }, [roomId]);

    return (
        <div ref={containerRef}></div>
    );
}

export default VideoCall;
