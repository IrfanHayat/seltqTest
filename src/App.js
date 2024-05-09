import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import UserInputForm from './pages/Home/UserInputForm';
import VideoCall from './pages/Room/VideoCall';

function App() {
    return (
        <Router>
            <Container>
                <Routes>
                    <Route path='/' element={<UserInputForm />} />   
                    <Route path='/videocall/:roomId' element={<VideoCall />} />   
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
