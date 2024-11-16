import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        birthdate: '',
    });
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/api/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
                });
                const data = await response.json();
                if (response.ok) {
                    setFormData({
                        name: data.name || '',
                        bio: data.bio || '',
                        birthdate: data.birthdate || '',
                    });
                } else {
                    setMessage(data.error || 'Fehler beim Laden des Profils');
                }
            } catch (error) {
                console.log(error);
                setMessage('Fehler beim Abrufen des Profils');
            }
        };
        // Call async method.
        fetchProfile();
    }, [userId]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setMessage(response.ok ? 'Profil erfolgreich aktualisiert' : data.error);
        } catch (error) {
        console.log(error);

            setMessage('Fehler beim Speichern des Profils');
        }
  };


    return (
        <div>
        <h3>Profil bearbeiten</h3>
        {message && <p>{message}</p>}

        <form onSubmit={handleSaveProfile}>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
          <label>
            Bio:
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
            />
          </label>
          <div>
          <label>
            Geburtsdatum:
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate ? new Date(formData.birthdate).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
              rows="3"
            />
          </label>
          </div>
        </div>

        <button type="submit">Profil speichern</button>
      </form>
    </div>
    );
};

export default UserProfile;