import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { query } from './server/db.js';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Routes

// --- SERVICES ---

// --- SETTINGS ---

app.get('/api/settings', (req, res) => {
  const settingsPath = path.join(__dirname, 'database/settings.json');
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.json({});
    }
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', (req, res) => {
  const settingsPath = path.join(__dirname, 'database/settings.json');
  try {
    let currentSettings = {};
    if (fs.existsSync(settingsPath)) {
      currentSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    const updatedSettings = { ...currentSettings, ...req.body };
    fs.writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 2), 'utf8');
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.put('/api/admin/change-password', (req, res) => {
  // Mocking password change for now as auth is hardcoded in frontend
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }

  if (currentPassword !== 'admin123') { // Based on the mock auth in App.tsx/Login.tsx
     return res.status(401).json({ error: 'Incorrect current password' });
  }

  // Normally we would hash and update the DB here
  res.json({ message: 'Password changed successfully' });
});

// --- SERVICES ---

// GET public services (active, sorted)
app.get('/api/services', async (req, res) => {
  try {
    const services = await query("SELECT * FROM services WHERE status = 'active' ORDER BY sort_order ASC");
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET service detail (public)
app.get('/api/services/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const services = await query("SELECT * FROM services WHERE slug = ? AND status = 'active'", [slug]);

    if (!services || services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(services[0]);
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// GET admin services list
app.get('/api/admin/services', async (req, res) => {
  try {
    const services = await query('SELECT * FROM services ORDER BY sort_order ASC, created_at DESC');
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET admin single service
app.get('/api/admin/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const services = await query('SELECT * FROM services WHERE id = ?', [id]);
    if (!services || services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(services[0]);
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// POST create service
app.post('/api/admin/services', upload.single('cover_image'), async (req, res) => {
  try {
    const { title, slug, short_desc, description, icon, sort_order, status } = req.body;

    // Validation
    if (!title || !slug || !status) {
      return res.status(400).json({ error: 'Title, slug, and status are required.' });
    }

    let coverImageUrl = null;
    if (req.file) {
      coverImageUrl = `/uploads/${req.file.filename}`;
    }

    const result = await query(
      'INSERT INTO services (title, slug, short_desc, description, cover_image, icon, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, short_desc, description, coverImageUrl, icon, sort_order || 0, status]
    );

    const newService = await query('SELECT * FROM services WHERE id = ?', [result.insertId]);
    res.status(201).json(newService[0]);

  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ error: 'Failed to create service: ' + err.message });
  }
});

// PUT update service
app.put('/api/admin/services/:id', upload.single('cover_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, short_desc, description, icon, sort_order, status } = req.body;

    const existing = await query('SELECT * FROM services WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    let coverImageUrl = existing[0].cover_image;
    if (req.file) {
      coverImageUrl = `/uploads/${req.file.filename}`;
    }

    await query(
      'UPDATE services SET title = ?, slug = ?, short_desc = ?, description = ?, cover_image = ?, icon = ?, sort_order = ?, status = ? WHERE id = ?',
      [title, slug, short_desc, description, coverImageUrl, icon, sort_order, status, id]
    );

    const updatedService = await query('SELECT * FROM services WHERE id = ?', [id]);
    res.json(updatedService[0]);

  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE service
app.delete('/api/admin/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM services WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});


// --- PROPERTIES ---

// GET all properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET property by ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const properties = await query('SELECT * FROM properties WHERE id = ?', [id]);

    if (!properties || properties.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = properties[0];

    // Fetch gallery images
    const images = await query('SELECT * FROM property_images WHERE property_id = ?', [id]);
    property.gallery = images.map(img => img.image_url);

    res.json(property);
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// POST new property
app.post('/api/properties', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
  try {
    const { title, slug, location, price, type, status, description } = req.body;

    // Handle main image
    let mainImageUrl = null;
    if (req.files['image']) {
      mainImageUrl = `/uploads/${req.files['image'][0].filename}`;
    }

    // Insert property
    const result = await query(
      'INSERT INTO properties (title, slug, location, price, type, status, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, location, price, type, status || 'Active', description, mainImageUrl]
    );

    const propertyId = result.insertId;

    // Handle gallery images
    if (req.files['gallery']) {
      for (const file of req.files['gallery']) {
        const imageUrl = `/uploads/${file.filename}`;
        await query(
          'INSERT INTO property_images (property_id, image_url) VALUES (?, ?)',
          [propertyId, imageUrl]
        );
      }
    }

    const newProperty = await query('SELECT * FROM properties WHERE id = ?', [propertyId]);
    res.status(201).json(newProperty[0]);

  } catch (error) {
    console.error('Error saving property:', error);
    res.status(500).json({ error: 'Failed to save property: ' + error.message });
  }
});

// PUT update property
app.put('/api/properties/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, location, price, type, status, description } = req.body;

    const existing = await query('SELECT * FROM properties WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    let mainImageUrl = existing[0].image;
    if (req.files['image']) {
      mainImageUrl = `/uploads/${req.files['image'][0].filename}`;
    }

    await query(
      'UPDATE properties SET title = ?, slug = ?, location = ?, price = ?, type = ?, status = ?, description = ?, image = ? WHERE id = ?',
      [title, slug, location, price, type, status, description, mainImageUrl, id]
    );

    if (req.files['gallery']) {
      for (const file of req.files['gallery']) {
        const imageUrl = `/uploads/${file.filename}`;
        await query(
          'INSERT INTO property_images (property_id, image_url) VALUES (?, ?)',
          [id, imageUrl]
        );
      }
    }

    const updatedProperty = await query('SELECT * FROM properties WHERE id = ?', [id]);
    res.json(updatedProperty[0]);

  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// DELETE property
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM properties WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
       return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// --- PROJECTS ---

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST new project
app.post('/api/projects', upload.single('image'), async (req, res) => {
  try {
    const { title, location, category, budget, status, description } = req.body;

    let mainImageUrl = null;
    if (req.file) {
      mainImageUrl = `/uploads/${req.file.filename}`;
    }

    const result = await query(
      'INSERT INTO projects (title, location, category, budget, status, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, location, category, budget, status || 'Active', description, mainImageUrl]
    );

    const newProject = await query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(newProject[0]);
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

// PUT update project
app.put('/api/projects/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, category, budget, status, description } = req.body;

    const existing = await query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let mainImageUrl = existing[0].image;
    if (req.file) {
      mainImageUrl = `/uploads/${req.file.filename}`;
    }

    await query(
      'UPDATE projects SET title = ?, location = ?, category = ?, budget = ?, status = ?, description = ?, image = ? WHERE id = ?',
      [title, location, category, budget, status, description, mainImageUrl, id]
    );

    const updatedProject = await query('SELECT * FROM projects WHERE id = ?', [id]);
    res.json(updatedProject[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM projects WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
       return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// GET project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await query('SELECT * FROM projects WHERE id = ?', [id]);

    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(projects[0]);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});


// --- INQUIRIES ---

// POST new inquiry (public)
app.post('/api/inquiries', async (req, res) => {
  try {
    const { full_name, email, phone, subject, service, message } = req.body;

    // Basic validation
    if (!full_name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    await query(
      'INSERT INTO inquiries (full_name, email, phone, subject, service, message) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, phone, subject, service, message]
    );

    res.status(201).json({ message: 'Inquiry submitted successfully.' });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
});

// GET admin inquiries list
app.get('/api/admin/inquiries', async (req, res) => {
  try {
    const inquiries = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// GET admin inquiry details + replies
app.get('/api/admin/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const inquiries = await query('SELECT * FROM inquiries WHERE id = ?', [id]);
    if (!inquiries || inquiries.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    const inquiry = inquiries[0];

    const replies = await query('SELECT * FROM inquiry_replies WHERE inquiry_id = ? ORDER BY sent_at ASC', [id]);
    inquiry.replies = replies;

    res.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry details:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry details' });
  }
});

// POST admin reply
app.post('/api/admin/inquiries/:id/reply', async (req, res) => {
  const { id } = req.params;
  const { subject, message, admin_user } = req.body;

  try {
    const inquiries = await query('SELECT * FROM inquiries WHERE id = ?', [id]);
    if (!inquiries || inquiries.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    const inquiry = inquiries[0];
    const customerEmail = inquiry.email;

    // Send Email
    let deliveryStatus = 'sent';
    let errorMessage = null;
    let messageId = null;

    try {
      const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        replyTo: process.env.FROM_EMAIL,
        to: customerEmail,
        subject: subject,
        text: message,
      });
      messageId = info.messageId;
      console.log('Email sent: %s', info.messageId);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      deliveryStatus = 'failed';
      errorMessage = emailError.message;
    }

    // Save Reply
    await query(
      'INSERT INTO inquiry_replies (inquiry_id, admin_user, reply_subject, reply_message, sent_to_email, delivery_status, error_message, message_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, admin_user || 'Admin', subject, message, customerEmail, deliveryStatus, errorMessage, messageId]
    );

    // Update Inquiry Status
    if (deliveryStatus === 'sent') {
      await query("UPDATE inquiries SET status = 'replied' WHERE id = ?", [id]);
    }

    res.json({ message: 'Reply processed', deliveryStatus });

  } catch (error) {
    console.error('Error replying to inquiry:', error);
    res.status(500).json({ error: 'Failed to reply to inquiry' });
  }
});

// PUT update inquiry status
app.put('/api/admin/inquiries/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await query("UPDATE inquiries SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
