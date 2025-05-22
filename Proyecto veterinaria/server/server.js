import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Role-based Authorization Middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// In-memory data storage
let appointments = [];
let medicalRecords = [];
let vaccinations = [];
let users = [
  {
    id: 1,
    email: 'admin@vetsalud.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: 2,
    email: 'vet@vetsalud.com',
    name: 'Dr. María Rodríguez',
    role: 'veterinarian',
    password: 'vet123'
  },
  {
    id: 3,
    email: 'cliente@vetsalud.com',
    name: 'Ana Gómez',
    role: 'client',
    password: '1234'
  }
];
let notifications = [];

// Auth Routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

// Appointments Routes
app.get('/api/appointments', authenticateToken, (req, res) => {
  if (req.user.role === 'client') {
    const clientAppointments = appointments.filter(a => a.ownerId === req.user.id);
    res.json(clientAppointments);
  } else {
    res.json(appointments);
  }
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  const newAppointment = { id: Date.now(), ...req.body };
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.put('/api/appointments/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = appointments.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  appointments[index] = { ...appointments[index], ...req.body };
  res.json(appointments[index]);
});

app.delete('/api/appointments/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  appointments = appointments.filter(a => a.id !== id);
  res.status(204).send();
});

// Medical Records Routes
app.get('/api/medical-records', authenticateToken, (req, res) => {
  if (req.user.role === 'client') {
    const clientRecords = medicalRecords.filter(r => r.ownerId === req.user.id);
    res.json(clientRecords);
  } else {
    res.json(medicalRecords);
  }
});

app.post('/api/medical-records', authenticateToken, authorize(['admin', 'veterinarian']), (req, res) => {
  const newRecord = { id: Date.now(), ...req.body };
  medicalRecords.push(newRecord);
  res.status(201).json(newRecord);
});

app.put('/api/medical-records/:id', authenticateToken, authorize(['admin', 'veterinarian']), (req, res) => {
  const id = parseInt(req.params.id);
  const index = medicalRecords.findIndex(r => r.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Medical record not found' });
  }

  medicalRecords[index] = { ...medicalRecords[index], ...req.body };
  res.json(medicalRecords[index]);
});

app.delete('/api/medical-records/:id', authenticateToken, authorize(['admin', 'veterinarian']), (req, res) => {
  const id = parseInt(req.params.id);
  medicalRecords = medicalRecords.filter(r => r.id !== id);
  res.status(204).send();
});

// Vaccinations Routes
app.get('/api/vaccinations', authenticateToken, (req, res) => {
  if (req.user.role === 'client') {
    const clientVaccinations = vaccinations.filter(v => v.ownerId === req.user.id);
    res.json(clientVaccinations);
  } else {
    res.json(vaccinations);
  }
});

app.post('/api/vaccinations', authenticateToken, authorize(['admin', 'veterinarian']), (req, res) => {
  const newVaccination = { id: Date.now(), ...req.body };
  vaccinations.push(newVaccination);
  res.status(201).json(newVaccination);
});

app.put('/api/vaccinations/:id', authenticateToken, authorize(['admin', 'veterinarian']), (req, res) => {
  const id = parseInt(req.params.id);
  const index = vaccinations.findIndex(v => v.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Vaccination record not found' });
  }

  vaccinations[index] = { ...vaccinations[index], ...req.body };
  res.json(vaccinations[index]);
});

app.delete('/api/vaccinations/:id', authenticateToken, authorize(['admin', 'veterinarian']), (req, res) => {
  const id = parseInt(req.params.id);
  vaccinations = vaccinations.filter(v => v.id !== id);
  res.status(204).send();
});

// Users Routes
app.get('/api/users', authenticateToken, authorize(['admin']), (req, res) => {
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json(safeUsers);
});

app.put('/api/users/:id', authenticateToken, authorize(['admin']), (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[index] = { ...users[index], ...req.body };
  const { password, ...safeUser } = users[index];
  res.json(safeUser);
});

// Notifications Routes
app.get('/api/notifications', authenticateToken, (req, res) => {
  if (req.user.role === 'client') {
    const clientNotifications = notifications.filter(n => n.userId === req.user.id);
    res.json(clientNotifications);
  } else {
    res.json(notifications);
  }
});

app.post('/api/notifications', authenticateToken, (req, res) => {
  const newNotification = { id: Date.now(), ...req.body };
  notifications.push(newNotification);
  res.status(201).json(newNotification);
});

app.put('/api/notifications/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = notifications.findIndex(n => n.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notifications[index] = { ...notifications[index], ...req.body };
  res.json(notifications[index]);
});

app.delete('/api/notifications/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  notifications = notifications.filter(n => n.id !== id);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});