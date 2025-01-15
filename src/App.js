import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import RealTime from './pages/RealTime/RealTime';
import Setting from './pages/RealTime/Setting';
import YouTubeVideo from './pages/Youtube/Youtube';
import VideoCall from './pages/Room/VideoCall';
import UserInputForm from './pages/Home/UserInputForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load your Stripe public key (replace with your actual public key)
const stripePromise = loadStripe('pk_test_GEOuWHQH1uEUrjldwBVHQ1LO00d5F6ooC8');

function App() {
    return (
        <Router>
            <Container>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <Elements stripe={stripePromise}>
                                <RealTime />
                            </Elements>
                        } 
                    />
                    <Route path="/setting" element={<Setting />} />
                    <Route path="/youtube" element={<YouTubeVideo />} />
                    <Route path="/Home" element={<UserInputForm />} />
                    <Route path="/videocall/:roomId" element={<VideoCall />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
