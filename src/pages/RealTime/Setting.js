import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const [verbosity, setVerbosity] = useState('concise');
  const [scrollSetting, setScrollSetting] = useState('Manual');
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Settings</h1>
      <div>
        <label>Verbosity: </label>
        <button onClick={() => setVerbosity('concise')} className={verbosity === 'concise' ? 'active' : ''}>Concise</button>
        <button onClick={() => setVerbosity('verbose')} className={verbosity === 'verbose' ? 'active' : ''}>Verbose</button>
      </div>
      <div>
        <label>Response Scroll Setting: </label>
        <button onClick={() => setScrollSetting('Manual')} className={scrollSetting === 'Manual' ? 'active' : ''}>Manual</button>
        <button onClick={() => setScrollSetting('AutoScroll')} className={scrollSetting === 'AutoScroll' ? 'active' : ''}>AutoScroll</button>
      </div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={() => window.close()}>Cancel</button>
      </div>
    </div>
  );
};

export default SettingsPage;
