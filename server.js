import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { query } from './server/db.js';

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
    // Note: Use '?' for parameters. db.js handles it for both MySQL and SQLite (better-sqlite3 supports ?)
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

    // Fetch created property
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

    // Check if property exists
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

    // Handle gallery images (Append new ones)
    if (req.files['gallery']) {
      for (const file of req.files['gallery']) {
        const imageUrl = `/uploads/${file.filename}`;
        await query(
          'INSERT INTO property_images (property_id, image_url) VALUES (?, ?)',
          [id, imageUrl]
        );
      }
    }

    // Note: Deleting specific gallery images isn't implemented in this simple PUT.
    // Usually that would be a separate endpoint or a more complex update logic.

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


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
