import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function ShareComponent({ onClose }) {
  const [emails, setEmails] = useState([{ email: '', read: false, write: false }]);
  const { id } = useParams();
  const handleAddEmail = () => {
    setEmails([...emails, { email: '', read: false, write: false }]);
  };

  const handleChange = (index, field, value) => {
    const newEmails = [...emails];
    newEmails[index][field] = value;
    setEmails(newEmails);
  };
  const Sharefiles = async () => {
    console.log(emails);
    onClose();
    if(emails.length>0){
       const {data} = await axios.post('/sharefile', {emails: emails, id: id });
       if(data.err){
         console.log(resp.data.err);
       }
       else{
         console.log("Shared Successfully");
       }
    }
  };
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      zIndex: 1000,
      border: '1px solid #ccc',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
    }}>
      <div>
        <button onClick={onClose} style={{ float: 'right' }}>X</button>
        <div style={{ clear: 'both' }}></div>
      </div>
      <div>
        {emails.map((email, index) => (
          <div key={index}>
            <input
              type="email"
              value={email.email}
              onChange={e => handleChange(index, 'email', e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={email.read}
                onChange={e => handleChange(index, 'read', e.target.checked)}
              />
              Read
            </label>
            <label>
              <input
                type="checkbox"
                checked={email.write}
                onChange={e => handleChange(index, 'write', e.target.checked)}
              />
              Write
            </label>
          </div>
        ))}
        <button onClick={handleAddEmail}>+</button>
        <button onClick={Sharefiles}> Done </button>
      </div>
    </div>
  );
}

export default ShareComponent;