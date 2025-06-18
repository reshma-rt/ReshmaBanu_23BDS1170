import React, { useEffect, useState } from 'react';
import { getRegistrations, createRegistration } from '../api';

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState({ student: '', event: '' });

useEffect(() => {
  const fetchData = async () => {
    try {
      await fetchRegistrations();
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    }
  };

  fetchData();
}, []);


  const fetchRegistrations = async () => {
    const res = await getRegistrations();
    setRegistrations(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRegistration(form);
    fetchRegistrations();
    setForm({ student: '', event: '' });
  };

  return (
    <div>
      <h2>Registrations</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Student" value={form.student} onChange={e => setForm({...form, student: e.target.value})} />
        <input placeholder="Event" value={form.event} onChange={e => setForm({...form, event: e.target.value})} />
        <button type="submit">Register</button>
      </form>

      <ul>
        {registrations.map((reg, i) => (
          <li key={i}>{reg.student} registered for {reg.event}</li>
        ))}
      </ul>
    </div>
  );
}
