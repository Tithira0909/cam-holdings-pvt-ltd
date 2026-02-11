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

// Helper route to get all inquiries for admin list
app.get('/api/admin/inquiries', async (req, res) => {
  try {
    const inquiries = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(inquiries);
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
