import React, { useCallback, useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserInputForm() {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoin = useCallback(() => {
        console.log('roomId', roomId);
        navigate(`/videocall/${roomId}`); // Use / before videocall
    }, [roomId, navigate]); // Include roomId and navigate in the dependency array

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item style={{ maxWidth: 400, padding: '16px', textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Seltq Test
                </Typography>
                <TextField
                    label="Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="medium"
                    style={{ marginBottom: '16px' }} // Add margin bottom to the input field
                />
                <Button variant="contained" onClick={handleJoin} size="medium" fullWidth>
                    Join
                </Button>
            </Grid>
        </div>
    );
}

export default UserInputForm;
