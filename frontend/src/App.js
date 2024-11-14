import React, { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/profile`, {
            headers: {
                'Authorization': `Bearer YOUR_TOKEN_HERE` // Token hier einsetzen
            }
        })
        .then(response => response.json())
        .then(data => setMessage(data.message))
        .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Welcome to the Frontend</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
