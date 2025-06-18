import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Make sure this file is created

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', location: '', date: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
    fetchStudents();
  }, [search, filterDate]);

  const fetchEvents = async () => {
    try {
      const params = {};
      if (search) params.name = search;
      if (filterDate) params.date = filterDate;
      const res = await axios.get('http://localhost:8000/events', { params });
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get('http://localhost:8000/registrations');
      setRegistrations(res.data);
    } catch (err) {
      console.error("Error fetching registrations", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:8000/students');
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students", err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/events/${editingId}`, form);
        alert("Event updated successfully");
      } else {
        await axios.post("http://localhost:8000/events", form);
        alert("Event created successfully");
      }
      setForm({ name: '', description: '', location: '', date: '' });
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      alert("Operation failed");
      console.error(err.response?.data || err.message);
    }
  };

  const handleEdit = (event) => {
    setForm({
      name: event.name,
      description: event.description,
      location: event.location,
      date: event.date,
    });
    setEditingId(event._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/events/${id}`);
      alert("Event deleted");
      fetchEvents();
    } catch {
      alert("Delete failed");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/import-events", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus(response.data.message);
      fetchEvents();
    } catch (err) {
      setUploadStatus("Failed to import events.");
      console.error(err);
    }
  };

  const exportToCSV = () => {
    if (!events.length) return;
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Event Name,Description,Location,Date", ...events.map(ev => `${ev.name},${ev.description},${ev.location},${ev.date}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "events.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const upcomingEvents = events.filter(ev => new Date(ev.date) >= new Date());

  return (
    <div className="admin-dashboard">
      <h2>📊 Admin Dashboard</h2>

      <div className="stats-summary">
        <p><strong>Total Events:</strong> {events.length}</p>
        <p><strong>Total Students:</strong> {students.length}</p>
        <p><strong>Total Registrations:</strong> {registrations.length}</p>
        <p><strong>Upcoming Events:</strong> {upcomingEvents.length}</p>
      </div>

      <div className="filter-group">
        <input
          type="text"
          placeholder="Filter by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
      </div>

      <h3>{editingId ? "Edit Event" : "Add Event"}</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Event Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />
        <button onClick={handleSubmit}>{editingId ? "Update" : "Add"}</button>
      </div>

      <h3>📤 Import Events</h3>
      <input type="file" accept=".csv,.json" onChange={handleFileUpload} />
      {uploadStatus && <p>{uploadStatus}</p>}

      <h3>📥 Export Events</h3>
      <button className="export-btn" onClick={exportToCSV}>Export Events to CSV</button>

      <h3>All Events</h3>
      <div className="event-grid">
        {events.map(event => (
          <div key={event._id} className="event-card">
            <h4>{event.name}</h4>
            <p>{event.description}</p>
            <p>{event.date}</p>
            <p>{event.location}</p>
            <button onClick={() => handleEdit(event)}>Edit</button>
            <button onClick={() => handleDelete(event._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
