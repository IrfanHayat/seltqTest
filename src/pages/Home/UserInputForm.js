import React, { useCallback, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserInputForm() {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoin = useCallback(() => {
        console.log('roomId', roomId);
        navigate(`/videocall/${roomId}`); // Use / before videocall
    }, [roomId, navigate]); // Include roomId and navigate in the dependency array

    return (
        <div>
            <TextField
                label="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                fullWidth
            />
            <Button variant="contained" onClick={handleJoin}>Join</Button>
        </div>
    );
}

export default UserInputForm;
