const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'himanshu',
  database: 'hms'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve portal pages
app.get('/patient-portal.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'patient-portal.html'));
});

app.get('/doctor-portal.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'doctor-portal.html'));
});

// Patient Endpoints
app.post('/api/patient/signup', (req, res) => {
  const { name, email, password, age } = req.body;
  
  db.query(
    'INSERT INTO patients (name, email, password, age) VALUES (?, ?, ?, ?)',
    [name, email, password, age],
    (err, result) => {
      if (err) {
        console.error('Signup error:', err);
        return res.status(400).json({ error: 'Registration failed' });
      }
      res.json({ success: true });
    }
  );
});

app.post('/api/patient/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query(
    'SELECT * FROM patients WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json({ success: true, user: results[0] });
    }
  );
});

// Doctor Endpoints
app.post('/api/doctor/signup', (req, res) => {
  const { name, email, password, license, specialization, other_specialization } = req.body;
  const finalSpecialization = specialization === 'other' ? other_specialization : specialization;
  
  db.query(
    'INSERT INTO doctors (name, email, password, license, specialization) VALUES (?, ?, ?, ?, ?)',
    [name, email, password, license, finalSpecialization],
    (err, result) => {
      if (err) {
        console.error('Signup error:', err);
        return res.status(400).json({ error: 'Registration failed' });
      }
      res.json({ success: true });
    }
  );
});

app.post('/api/doctor/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query(
    'SELECT * FROM doctors WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json({ success: true, user: results[0] });
    }
  );
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});  