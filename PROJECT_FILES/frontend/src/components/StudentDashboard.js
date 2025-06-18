import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentDashboard.css';


function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchEvents();
  }, [search, filterDate]);

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  async function fetchEvents() {
    try {
      const params = {};
      if (search) params.name = search;
      if (filterDate) params.date = filterDate;

      const res = await axios.get('http://localhost:8000/events', { params });
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events', err);
    }
  }

  async function fetchRegisteredEvents() {
    const email = localStorage.getItem("email");
    console.log("📥 Fetching registrations for:", email);

    if (!email) {
      console.warn("❌ No email found in localStorage.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8000/registrations/${email}`);
      console.log("✅ Registrations fetched:", res.data);
      setRegisteredEvents(res.data);
    } catch (err) {
      console.error("❌ Error fetching registered events:", err);
    }
  }

  async function registerForEvent(eventName) {
    if (!email || !eventName) {
      alert("Missing email or event name. Aborting.");
      return;
    }

    const payload = {
      email: email,
      event_name: eventName,
      registration_date: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await axios.post("http://localhost:8000/register", payload);
      alert(res.data.message);
      fetchRegisteredEvents();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      alert("Registration failed: " + msg);
    }
  }

  const isRegistered = (eventName) =>
    registeredEvents.some(reg => reg.event_name === eventName);

  const exportToCSV = () => {
    if (!registeredEvents.length) return;
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Event Name,Registration Date", ...registeredEvents.map(ev => `${ev.event_name},${ev.registration_date}`)]
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registered_events.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
<div className="student-dashboard">
  <h2>Student Dashboard</h2>

  <div className="filter-bar">
    <input
      type="text"
      placeholder="Search event name"
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
    <input
      type="date"
      value={filterDate}
      onChange={e => setFilterDate(e.target.value)}
    />
  </div>

  <h3>Available Events</h3>
  {events.length === 0 ? (
    <p>No events found.</p>
  ) : (
    <div className="event-grid">
      {events.map(ev => {
        const alreadyRegistered = isRegistered(ev.name);
        return (
          <div className="event-card" key={ev._id}>
            <h4>{ev.name}</h4>
            <p>{ev.date} | {ev.location}</p>
            <button
              onClick={() => registerForEvent(ev.name)}
              disabled={alreadyRegistered}
            >
              {alreadyRegistered ? "Registered" : "Register"}
            </button>
          </div>
        );
      })}
    </div>
  )}

  <h3>Registered Events</h3>
  {registeredEvents.length === 0 ? (
    <p>You have no registrations.</p>
  ) : (
    <>
      <button className="export-btn" onClick={exportToCSV}>Export to CSV</button>
      <ul className="registered-list">
        {registeredEvents.map(ev => (
          <li key={ev._id}>
            <strong>{ev.event_name}</strong><br />
            {ev.registration_date}
          </li>
        ))}
      </ul>
    </>
  )}
</div>

  );
}

export default StudentDashboard;
