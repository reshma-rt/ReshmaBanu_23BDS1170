import React, { useEffect, useState } from 'react';
import { getEvents, createEvent } from '../api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', description: '' });

useEffect(() => {
  const fetchData = async () => {
    try {
      await fetchEvents(); 
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  fetchData();
}, []);

  const fetchEvents = async () => {
    const res = await getEvents();
    setEvents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvent(form);
    fetchEvents();
    setForm({ name: '', date: '', description: '' });
  };

  return (
    <div>
      <h2>Events</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <button type="submit">Add Event</button>
      </form>

      <ul>
        {events.map((event, i) => (
          <li key={i}>{event.name} - {event.date} - {event.description}</li>
        ))}
      </ul>
    </div>
  );
}
