import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

function App() {
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchValue();
  }, []);

  const fetchValue = async () => {
    try {
      const result = await backend.getValue();
      setValue(result);
    } catch (error) {
      console.error('Error fetching value:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await backend.setValue(inputValue);
      await fetchValue();
      setInputValue('');
    } catch (error) {
      console.error('Error setting value:', error);
    }
  };

  return (
    <div>
      <h1>Simple IC App</h1>
      <p>Stored Value: {value}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a value"
        />
        <button type="submit">Set Value</button>
      </form>
    </div>
  );
}

export default App;
