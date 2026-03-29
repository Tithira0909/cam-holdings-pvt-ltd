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
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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


// --- ANALYTICS SETTINGS ---

app.get('/api/settings/analytics', (req, res) => {
  const settingsPath = path.join(__dirname, 'database/settings.json');
  try {
    if (fs.existsSync(settingsPath)) {
      const data = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      res.json({
        google_analytics_tag: data.google_analytics_tag || '',
        facebook_pixel_tag: data.facebook_pixel_tag || ''
      });
    } else {
      res.json({});
    }
  } catch (error) {
    console.error('Error reading analytics settings:', error);
    res.status(500).json({ error: 'Failed to fetch analytics settings' });
  }
});

app.put('/api/settings/analytics', (req, res) => {
  const settingsPath = path.join(__dirname, 'database/settings.json');
  try {
    let currentSettings = {};
    if (fs.existsSync(settingsPath)) {
      currentSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    const updatedSettings = {
        ...currentSettings,
        google_analytics_tag: req.body.google_analytics_tag,
        facebook_pixel_tag: req.body.facebook_pixel_tag
    };
    fs.writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 2), 'utf8');
    res.json({
        google_analytics_tag: updatedSettings.google_analytics_tag,
        facebook_pixel_tag: updatedSettings.facebook_pixel_tag
    });
  } catch (error) {
    console.error('Error updating analytics settings:', error);
    res.status(500).json({ error: 'Failed to update analytics settings' });
  }
});

// --- SITE SETTINGS ---

app.get('/api/settings/site', async (req, res) => {
  const settingsPath = path.join(__dirname, 'database/settings.json');
  try {
    let data = {};
    if (fs.existsSync(settingsPath)) {
      data = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }

    // Attempt to merge from DB
    try {
        await query('CREATE TABLE IF NOT EXISTS settings (setting_key VARCHAR(255) PRIMARY KEY, setting_value TEXT)');
        const dbSettings = await query('SELECT * FROM settings');
        if (dbSettings && Array.isArray(dbSettings)) {
            dbSettings.forEach(s => {
                if (s.setting_key === 'hero_image') {
                    data.hero_image_url = s.setting_value;
                }
            });
        }
    } catch(dbErr) { }

    res.json({
      site_name: data.site_name || '',
      contact_email: data.contact_email || '',
      contact_phone: data.contact_phone || '',
      address: data.address || '',
      hero_image_url: data.hero_image_url || null,
      hero_image: data.hero_image_url || null // Map alias for frontend
    });
  } catch (error) {
    console.error('Error reading site settings:', error);
    res.status(500).json({ error: 'Failed to fetch site settings' });
  }
});

app.put('/api/settings/site', (req, res) => {
  const settingsPath = path.join(__dirname, 'database/settings.json');
  try {
    let currentSettings = {};
    if (fs.existsSync(settingsPath)) {
      currentSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    const updatedSettings = {
        ...currentSettings,
        site_name: req.body.site_name,
        contact_email: req.body.contact_email,
        contact_phone: req.body.contact_phone,
        address: req.body.address,
        hero_image_url: req.body.hero_image_url !== undefined ? req.body.hero_image_url : currentSettings.hero_image_url
    };
    fs.writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 2), 'utf8');
    res.json({
        site_name: updatedSettings.site_name,
        contact_email: updatedSettings.contact_email,
        contact_phone: updatedSettings.contact_phone,
        address: updatedSettings.address,
        hero_image_url: updatedSettings.hero_image_url || null
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

app.post('/api/settings/site/hero', upload.single('hero_image'), async (req, res) => {
  const settingsPath = path.join(__dirname, 'database/settings.json');
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No hero image file provided', success: false });
    }

    const heroUrl = `/uploads/${req.file.filename}`;

    // Update settings.json as fallback
    let currentSettings = {};
    if (fs.existsSync(settingsPath)) {
      currentSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    const updatedSettings = {
        ...currentSettings,
        hero_image_url: heroUrl
    };
    fs.writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 2), 'utf8');

    // Also persist in DB as per requirement
    try {
        await query('CREATE TABLE IF NOT EXISTS settings (setting_key VARCHAR(255) PRIMARY KEY, setting_value TEXT)');
        await query('DELETE FROM settings WHERE setting_key = "hero_image"');
        await query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', ['hero_image', heroUrl]);
    } catch(dbErr) {
        console.error('Failed to save to DB settings table, continuing with JSON:', dbErr);
    }

    res.json({
        success: true,
        hero_image: heroUrl
    });
  } catch (error) {
    console.error('Error uploading hero image:', error);
    res.status(500).json({ error: 'Failed to upload hero image', success: false });
  }
});

// DELETE endpoint to remove hero image
app.delete('/api/settings/site/hero', async (req, res) => {
  const settingsPath = path.join(__dirname, 'database/settings.json');
  try {
    let currentSettings = {};
    if (fs.existsSync(settingsPath)) {
      currentSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    const updatedSettings = {
        ...currentSettings,
        hero_image_url: null
    };
    fs.writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 2), 'utf8');

    try {
        await query('DELETE FROM settings WHERE setting_key = "hero_image"');
    } catch(dbErr) { }

    res.json({ success: true, message: 'Hero image removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove hero image', success: false });
  }
});


// --- ROLES SETTINGS ---

app.get('/api/settings/roles', async (req, res) => {
  try {
    const roles = await query('SELECT * FROM roles ORDER BY createdAt DESC');

    // Parse custom_modules which is stored as string/JSON
    const formattedRoles = roles.map(role => {
      let customModules = [];
      try {
        if (role.custom_modules) {
          customModules = JSON.parse(role.custom_modules);
        }
      } catch (e) {
        console.error('Failed to parse custom modules for role', role.id);
      }
      return {
        ...role,
        custom_modules: customModules,
        access_level: role.access_level === 'Custom' ? customModules : role.access_level
      };
    });

    res.json(formattedRoles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

app.post('/api/settings/roles', async (req, res) => {
  try {
    const { role_name, access_type, custom_modules, status } = req.body;

    if (!role_name || !access_type) {
      return res.status(400).json({ error: 'Role name and access type are required' });
    }

    const customModulesStr = Array.isArray(custom_modules) ? JSON.stringify(custom_modules) : '[]';

    const result = await query(
      'INSERT INTO roles (role_name, access_level, custom_modules, status, users_count) VALUES (?, ?, ?, ?, ?)',
      [role_name, access_type, customModulesStr, status || 'Active', 0]
    );

    const newRole = await query('SELECT * FROM roles WHERE id = ?', [result.insertId]);
    res.status(201).json(newRole[0]);
  } catch (err) {
    console.error('Error creating role:', err);
    res.status(500).json({ error: 'Failed to create role: ' + err.message });
  }
});

app.put('/api/settings/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, access_type, custom_modules, status } = req.body;

    if (!role_name || !access_type) {
      return res.status(400).json({ error: 'Role name and access type are required' });
    }

    const customModulesStr = Array.isArray(custom_modules) ? JSON.stringify(custom_modules) : '[]';

    await query(
      'UPDATE roles SET role_name = ?, access_level = ?, custom_modules = ?, status = ? WHERE id = ?',
      [role_name, access_type, customModulesStr, status, id]
    );

    const updatedRole = await query('SELECT * FROM roles WHERE id = ?', [id]);
    res.json(updatedRole[0]);
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

app.delete('/api/settings/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM roles WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    console.error('Error deleting role:', err);
    res.status(500).json({ error: 'Failed to delete role' });
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
    const services = await query('SELECT * FROM services ORDER BY sort_order ASC, createdAt DESC');
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

// --- Admin Property Gallery Images Management ---

// GET images for a land
app.get('/api/admin/lands/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const images = await query('SELECT * FROM land_images WHERE land_id = ? ORDER BY id ASC', [id]);
    res.json(images);
  } catch (err) {
    console.error('Error fetching land images:', err);
    res.status(500).json({ error: 'Failed to fetch land images' });
  }
});

// POST multiple images for a land
app.post('/api/admin/lands/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const insertedImages = [];
    for (const file of req.files) {
      const imageUrl = `/uploads/${file.filename}`;
      const result = await query(
        'INSERT INTO land_images (land_id, image_url) VALUES (?, ?)',
        [id, imageUrl]
      );
      insertedImages.push({ id: result.insertId, land_id: id, image_url: imageUrl });
    }

    res.status(201).json(insertedImages);
  } catch (err) {
    console.error('Error uploading land images:', err);
    res.status(500).json({ error: 'Failed to upload land images' });
  }
});

// DELETE a specific image
app.delete('/api/admin/lands/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const result = await query('DELETE FROM land_images WHERE id = ?', [imageId]);

    // Note: To be fully complete, you might want to also delete the physical file from the /uploads folder using fs.unlinkSync.
    // For now we just remove the DB record.

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting land image:', err);
    res.status(500).json({ error: 'Failed to delete land image' });
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

// Helper to parse JSON strings from DB safely
const safeParseJSON = (data, fallback = []) => {
  if (!data) return fallback;
  if (typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
};


// GET images for a house
app.get('/api/admin/houses/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const images = await query('SELECT * FROM house_images WHERE house_id = ? ORDER BY id ASC', [id]);
    res.json(images);
  } catch (err) {
    console.error('Error fetching house images:', err);
    res.status(500).json({ error: 'Failed to fetch house images' });
  }
});

// POST multiple images for a house
app.post('/api/admin/houses/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const insertedImages = [];
    for (const file of req.files) {
      const imageUrl = `/uploads/${file.filename}`;
      const result = await query(
        'INSERT INTO house_images (house_id, image_url) VALUES (?, ?)',
        [id, imageUrl]
      );
      insertedImages.push({ id: result.insertId, house_id: id, image_url: imageUrl });
    }

    res.status(201).json(insertedImages);
  } catch (err) {
    console.error('Error uploading house images:', err);
    res.status(500).json({ error: 'Failed to upload house images' });
  }
});

// DELETE a specific image
app.delete('/api/admin/houses/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const result = await query('DELETE FROM house_images WHERE id = ?', [imageId]);

    // Note: To be fully complete, you might want to also delete the physical file from the /uploads folder using fs.unlinkSync.
    // For now we just remove the DB record.

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting house image:', err);
    res.status(500).json({ error: 'Failed to delete house image' });
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


// GET all lands
app.get('/api/lands', async (req, res) => {
  try {
    const { type } = req.query;
    let sql = 'SELECT * FROM lands';
    let params = [];

    if (type) {
      const types = type.split(',').map(t => t.trim());
      const placeholders = types.map(() => '?').join(',');
      sql += ` WHERE type IN (${placeholders})`;
      params = types;
    }

    sql += ' ORDER BY sortOrder ASC, createdAt DESC';

    const lands = await query(sql, params);

    // Parse JSON fields
    const parsedLands = lands.map(p => ({
      ...p,
      amenities: safeParseJSON(p.amenities),
      locationHighlights: safeParseJSON(p.locationHighlights),
      floorPlans: safeParseJSON(p.floorPlans),
      brochureFiles: safeParseJSON(p.brochureFiles),
      travelHighlights: safeParseJSON(p.travelHighlights),
      relatedLands: safeParseJSON(p.relatedLands),
      isFeatured: !!p.isFeatured,
      isSoldOut: !!p.isSoldOut,
    }));

    res.json(parsedLands);
  } catch (err) {
    console.error('Error fetching lands:', err);
    res.status(500).json({ error: 'Failed to fetch lands' });
  }
});

// GET land by ID
app.get('/api/lands/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let lands;

    // Check if identifier is a number (id) or a string (slug)
    if (!isNaN(identifier)) {
        lands = await query('SELECT * FROM lands WHERE id = ?', [identifier]);
    } else {
        lands = await query('SELECT * FROM lands WHERE slug = ?', [identifier]);
    }

    if (!lands || lands.length === 0) {
      return res.status(404).json({ error: 'Land not found' });
    }

    const land = lands[0];

    // Fetch gallery images
    const images = await query('SELECT * FROM land_images WHERE land_id = ? ORDER BY id ASC', [land.id]);
    land.images = images.map(img => ({ id: img.id, image_url: img.image_url }));

    // Parse JSON fields
    land.amenities = safeParseJSON(land.amenities);
    land.locationHighlights = safeParseJSON(land.locationHighlights);
    land.floorPlans = safeParseJSON(land.floorPlans);
    land.brochureFiles = safeParseJSON(land.brochureFiles);
    land.travelHighlights = safeParseJSON(land.travelHighlights);
    land.relatedLands = safeParseJSON(land.relatedLands);
    land.isFeatured = !!land.isFeatured;
    land.isSoldOut = !!land.isSoldOut;

    res.json(land);
  } catch (err) {
    console.error('Error fetching land:', err);
    res.status(500).json({ error: 'Failed to fetch land' });
  }
});

// Helper to stringify JSON
const safeStringifyJSON = (data) => {
  if (!data) return null;
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data);
  } catch (e) {
    return null;
  }
};

// POST new land
app.post('/api/lands', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'logoImage', maxCount: 1 },
    { name: 'blockPlanImage', maxCount: 1 },
    { name: 'roadMapImage', maxCount: 1 },
    { name: 'locationMapImage', maxCount: 1 },
    { name: 'brochureFile', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('--- POST /api/lands ---');
    console.log('req.body:', req.body);
    console.log('req.files exists:', !!req.files);

    const {
      title, slug, location, price, type, status, description,
      category, district, city, locationLabel, priceLabel, bedrooms, bathrooms, videoUrl, projectPhilosophy, locationHighlights,
      isFeatured, isSoldOut, hotlineNumber, sortOrder,
      shortDescription, fullDescription,
      amenities, floorPlans, brochureFiles,
      projectStatusLabel, travelHighlights, inquiryEmail, relatedLands, metaTitle, metaDescription, ogImage, whatsappNumber
    } = req.body;

    // Backend validation for required fields
    if (!title || !location || !price || !type) {
      return res.status(400).json({ error: 'Missing required fields: title, location, price, and type are required.' });
    }

    // Handle main image
    let mainImageUrl = null;
    if (req.files['image']) {
      mainImageUrl = `/uploads/${req.files['image'][0].filename}`;
    }
    let logoImageUrl = null;
    if (req.files['logoImage']) {
      logoImageUrl = `/uploads/${req.files['logoImage'][0].filename}`;
    }
    let blockPlanImageUrl = null;
    if (req.files['blockPlanImage']) {
      blockPlanImageUrl = `/uploads/${req.files['blockPlanImage'][0].filename}`;
    }
    let roadMapImageUrl = null;
    if (req.files['roadMapImage']) {
      roadMapImageUrl = `/uploads/${req.files['roadMapImage'][0].filename}`;
    }
    let locationMapImageUrl = null;
    if (req.files['locationMapImage']) {
      locationMapImageUrl = `/uploads/${req.files['locationMapImage'][0].filename}`;
    }

    const amenitiesStr = typeof amenities === 'string' ? amenities : safeStringifyJSON(amenities);
    const locationHighlightsStr = typeof locationHighlights === 'string' ? locationHighlights : safeStringifyJSON(locationHighlights);
    const floorPlansStr = typeof floorPlans === 'string' ? floorPlans : safeStringifyJSON(floorPlans);
    const brochureFilesStr = typeof brochureFiles === 'string' ? brochureFiles : safeStringifyJSON(brochureFiles);
    const travelHighlightsStr = typeof travelHighlights === 'string' ? travelHighlights : safeStringifyJSON(travelHighlights);
    const relatedLandsStr = typeof relatedLands === 'string' ? relatedLands : safeStringifyJSON(relatedLands);

    const params = [
        title ?? null,
        slug ?? null,
        location ?? null,
        price ?? null,
        type ?? null,
        status || 'Active',
        description ?? null,
        mainImageUrl ?? null,
        category ?? null,
        district ?? null,
        city ?? null,
        locationLabel ?? null,
        priceLabel ?? null,
        bedrooms ?? null,
        bathrooms ?? null,
        videoUrl ?? null,
        projectPhilosophy ?? null,
        locationHighlightsStr ?? null,
        isFeatured === 'true' || isFeatured === true ? 1 : 0,
        isSoldOut === 'true' || isSoldOut === true ? 1 : 0,
        hotlineNumber ?? null,
        sortOrder || 0,
        shortDescription ?? null,
        fullDescription ?? null,
        amenitiesStr ?? null,
        floorPlansStr ?? null,
        brochureFilesStr ?? null,
        logoImageUrl ?? null,
        blockPlanImageUrl ?? null,
        roadMapImageUrl ?? null,
        locationMapImageUrl ?? null,
        projectStatusLabel ?? null,
        travelHighlightsStr ?? null,
        inquiryEmail ?? null,
        relatedLandsStr ?? null,
        metaTitle ?? null,
        metaDescription ?? null,
        ogImage ?? null,
        whatsappNumber ?? null
    ];

    console.log('SQL Params:', params);

    console.log('Inserting land. Params length:', params.length);

    // Ensure no arrays are passed directly to prevent mysql2 from expanding them
    const safeParams = params.map(p => Array.isArray(p) ? JSON.stringify(p) : p);

    // Insert land
    const result = await query(
      `INSERT INTO lands (
        title, slug, location, price, type, status, description, image,
        category, district, city, locationLabel, priceLabel, bedrooms, bathrooms, videoUrl, projectPhilosophy, locationHighlights,
        isFeatured, isSoldOut, hotlineNumber, sortOrder,
        shortDescription, fullDescription, amenities, floorPlans, brochureFiles,
        logoImage, blockPlanImage, roadMapImage, locationMapImage, projectStatusLabel, travelHighlights, inquiryEmail, relatedLands, metaTitle, metaDescription, ogImage, whatsappNumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      safeParams
    );

    const landId = result.insertId;

    // Handle gallery images
    if (req.files['gallery']) {
      for (const file of req.files['gallery']) {
        const imageUrl = `/uploads/${file.filename}`;
        await query(
          'INSERT INTO land_images (land_id, image_url) VALUES (?, ?)',
          [landId, imageUrl]
        );
      }
    }

    const newLand = await query('SELECT * FROM lands WHERE id = ?', [landId]);
    res.status(201).json(newLand[0]);

  } catch (error) {
    console.error('Error saving land:', error);
    res.status(500).json({ error: 'Failed to save land: ' + error.message });
  }
});

// PUT update land
app.put('/api/lands/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'logoImage', maxCount: 1 },
    { name: 'blockPlanImage', maxCount: 1 },
    { name: 'roadMapImage', maxCount: 1 },
    { name: 'locationMapImage', maxCount: 1 },
    { name: 'brochureFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`--- PUT /api/lands/${id} ---`);
    console.log('req.body:', req.body);
    console.log('req.files exists:', !!req.files);

    const {
      title, slug, location, price, type, status, description,
      category, district, city, locationLabel, priceLabel, bedrooms, bathrooms, videoUrl, projectPhilosophy, locationHighlights,
      isFeatured, isSoldOut, hotlineNumber, sortOrder,
      shortDescription, fullDescription,
      amenities, floorPlans, brochureFiles,
      projectStatusLabel, travelHighlights, inquiryEmail, relatedLands, metaTitle, metaDescription, ogImage, whatsappNumber
    } = req.body;

    // Backend validation for required fields
    if (!title || !location || !price || !type) {
      return res.status(400).json({ error: 'Missing required fields: title, location, price, and type are required.' });
    }

    const existing = await query('SELECT * FROM lands WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Land not found' });
    }

    let mainImageUrl = existing[0].image;
    if (req.files['image']) {
      mainImageUrl = `/uploads/${req.files['image'][0].filename}`;
    }
    let logoImageUrl = existing[0].logoImage;
    if (req.files['logoImage']) {
      logoImageUrl = `/uploads/${req.files['logoImage'][0].filename}`;
    }
    let blockPlanImageUrl = existing[0].blockPlanImage;
    if (req.files['blockPlanImage']) {
      blockPlanImageUrl = `/uploads/${req.files['blockPlanImage'][0].filename}`;
    }
    let roadMapImageUrl = existing[0].roadMapImage;
    if (req.files['roadMapImage']) {
      roadMapImageUrl = `/uploads/${req.files['roadMapImage'][0].filename}`;
    }
    let locationMapImageUrl = existing[0].locationMapImage;
    if (req.files['locationMapImage']) {
      locationMapImageUrl = `/uploads/${req.files['locationMapImage'][0].filename}`;
    }

    const amenitiesStr = typeof amenities === 'string' ? amenities : safeStringifyJSON(amenities);
    const locationHighlightsStr = typeof locationHighlights === 'string' ? locationHighlights : safeStringifyJSON(locationHighlights);
    const floorPlansStr = typeof floorPlans === 'string' ? floorPlans : safeStringifyJSON(floorPlans);
    const brochureFilesStr = typeof brochureFiles === 'string' ? brochureFiles : safeStringifyJSON(brochureFiles);
    const travelHighlightsStr = typeof travelHighlights === 'string' ? travelHighlights : safeStringifyJSON(travelHighlights);
    const relatedLandsStr = typeof relatedLands === 'string' ? relatedLands : safeStringifyJSON(relatedLands);

    const params = [
        title ?? null,
        slug ?? null,
        location ?? null,
        price ?? null,
        type ?? null,
        status || 'Active',
        description ?? null,
        mainImageUrl ?? null,
        category ?? null,
        district ?? null,
        city ?? null,
        locationLabel ?? null,
        priceLabel ?? null,
        bedrooms ?? null,
        bathrooms ?? null,
        videoUrl ?? null,
        projectPhilosophy ?? null,
        locationHighlightsStr ?? null,
        isFeatured === 'true' || isFeatured === true ? 1 : 0,
        isSoldOut === 'true' || isSoldOut === true ? 1 : 0,
        hotlineNumber ?? null,
        sortOrder || 0,
        shortDescription ?? null,
        fullDescription ?? null,
        amenitiesStr ?? null,
        floorPlansStr ?? null,
        brochureFilesStr ?? null,
        logoImageUrl ?? null,
        blockPlanImageUrl ?? null,
        roadMapImageUrl ?? null,
        locationMapImageUrl ?? null,
        projectStatusLabel ?? null,
        travelHighlightsStr ?? null,
        inquiryEmail ?? null,
        relatedLandsStr ?? null,
        metaTitle ?? null,
        metaDescription ?? null,
        ogImage ?? null,
        whatsappNumber ?? null,
        id
    ];

    console.log('SQL Params:', params);

    // Ensure no arrays are passed directly to prevent mysql2 from expanding them
    const safeParams = params.map(p => Array.isArray(p) ? JSON.stringify(p) : p);

    await query(
      `UPDATE lands SET
        title = ?, slug = ?, location = ?, price = ?, type = ?, status = ?, description = ?, image = ?,
        category = ?, district = ?, city = ?, locationLabel = ?, priceLabel = ?, bedrooms = ?, bathrooms = ?,
        videoUrl = ?, projectPhilosophy = ?, locationHighlights = ?,
        isFeatured = ?, isSoldOut = ?, hotlineNumber = ?, sortOrder = ?,
        shortDescription = ?, fullDescription = ?, amenities = ?, floorPlans = ?, brochureFiles = ?,
        logoImage = ?, blockPlanImage = ?, roadMapImage = ?, locationMapImage = ?, projectStatusLabel = ?, travelHighlights = ?, inquiryEmail = ?, relatedLands = ?, metaTitle = ?, metaDescription = ?, ogImage = ?, whatsappNumber = ?
      WHERE id = ?`,
      safeParams
    );

    if (req.files['gallery']) {
      for (const file of req.files['gallery']) {
        const imageUrl = `/uploads/${file.filename}`;
        await query(
          'INSERT INTO land_images (land_id, image_url) VALUES (?, ?)',
          [id, imageUrl]
        );
      }
    }

    const updatedLand = await query('SELECT * FROM lands WHERE id = ?', [id]);
    res.json(updatedLand[0]);

  } catch (error) {
    console.error('Error updating land:', error);
    res.status(500).json({ error: 'Failed to update land' });
  }
});

// DELETE land
app.delete('/api/lands/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM lands WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
       return res.status(404).json({ error: 'Land not found' });
    }

    res.json({ message: 'Land deleted successfully' });
  } catch (error) {
    console.error('Error deleting land:', error);
    res.status(500).json({ error: 'Failed to delete land' });
  }
});


// GET all houses
app.get('/api/houses', async (req, res) => {
  try {
    const { type } = req.query;
    let sql = 'SELECT * FROM houses';
    let params = [];

    if (type) {
      const types = type.split(',').map(t => t.trim());
      const placeholders = types.map(() => '?').join(',');
      sql += ` WHERE type IN (${placeholders})`;
      params = types;
    }

    sql += ' ORDER BY sortOrder ASC, createdAt DESC';

    const houses = await query(sql, params);

    // Parse JSON fields
    const parsedHouses = houses.map(p => ({
      ...p,
      amenities: safeParseJSON(p.amenities),
      locationHighlights: safeParseJSON(p.locationHighlights),
      floorPlans: safeParseJSON(p.floorPlans),
      brochureFiles: safeParseJSON(p.brochureFiles),
      travelHighlights: safeParseJSON(p.travelHighlights),
      relatedLands: safeParseJSON(p.relatedLands),
      isFeatured: !!p.isFeatured,
      isSoldOut: !!p.isSoldOut,
    }));

    res.json(parsedHouses);
  } catch (err) {
    console.error('Error fetching houses:', err);
    res.status(500).json({ error: 'Failed to fetch houses' });
  }
});

// GET house by ID
app.get('/api/houses/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let houses;

    // Check if identifier is a number (id) or a string (slug)
    if (!isNaN(identifier)) {
        houses = await query('SELECT * FROM houses WHERE id = ?', [identifier]);
    } else {
        houses = await query('SELECT * FROM houses WHERE slug = ?', [identifier]);
    }

    if (!houses || houses.length === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    const house = houses[0];

    // Fetch gallery images
    const images = await query('SELECT * FROM house_images WHERE house_id = ? ORDER BY id ASC', [house.id]);
    house.images = images.map(img => ({ id: img.id, image_url: img.image_url }));

    // Parse JSON fields
    house.amenities = safeParseJSON(house.amenities);
    house.locationHighlights = safeParseJSON(house.locationHighlights);
    house.floorPlans = safeParseJSON(house.floorPlans);
    house.brochureFiles = safeParseJSON(house.brochureFiles);
    house.travelHighlights = safeParseJSON(house.travelHighlights);
    house.relatedLands = safeParseJSON(house.relatedLands);
    house.isFeatured = !!house.isFeatured;
    house.isSoldOut = !!house.isSoldOut;

    res.json(house);
  } catch (err) {
    console.error('Error fetching house:', err);
    res.status(500).json({ error: 'Failed to fetch house' });
  }
});

// POST new house
app.post('/api/houses', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'logoImage', maxCount: 1 },
    { name: 'blockPlanImage', maxCount: 1 },
    { name: 'roadMapImage', maxCount: 1 },
    { name: 'locationMapImage', maxCount: 1 },
    { name: 'brochureFile', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('--- POST /api/houses ---');
    console.log('req.body:', req.body);
    console.log('req.files exists:', !!req.files);

    const {
      title, slug, location, price, type, status, description,
      category, district, city, locationLabel, priceLabel, bedrooms, bathrooms, videoUrl, projectPhilosophy, locationHighlights,
      isFeatured, isSoldOut, hotlineNumber, sortOrder,
      shortDescription, fullDescription,
      amenities, floorPlans, brochureFiles,
      projectStatusLabel, travelHighlights, inquiryEmail, relatedLands, metaTitle, metaDescription, ogImage, whatsappNumber
    } = req.body;

    // Backend validation for required fields
    if (!title || !location || !price || !type) {
      return res.status(400).json({ error: 'Missing required fields: title, location, price, and type are required.' });
    }

    // Handle main image
    let mainImageUrl = null;
    if (req.files['image']) {
      mainImageUrl = `/uploads/${req.files['image'][0].filename}`;
    }
    let logoImageUrl = null;
    if (req.files['logoImage']) {
      logoImageUrl = `/uploads/${req.files['logoImage'][0].filename}`;
    }
    let blockPlanImageUrl = null;
    if (req.files['blockPlanImage']) {
      blockPlanImageUrl = `/uploads/${req.files['blockPlanImage'][0].filename}`;
    }
    let roadMapImageUrl = null;
    if (req.files['roadMapImage']) {
      roadMapImageUrl = `/uploads/${req.files['roadMapImage'][0].filename}`;
    }
    let locationMapImageUrl = null;
    if (req.files['locationMapImage']) {
      locationMapImageUrl = `/uploads/${req.files['locationMapImage'][0].filename}`;
    }

    const amenitiesStr = typeof amenities === 'string' ? amenities : safeStringifyJSON(amenities);
    const locationHighlightsStr = typeof locationHighlights === 'string' ? locationHighlights : safeStringifyJSON(locationHighlights);
    const floorPlansStr = typeof floorPlans === 'string' ? floorPlans : safeStringifyJSON(floorPlans);
    const brochureFilesStr = typeof brochureFiles === 'string' ? brochureFiles : safeStringifyJSON(brochureFiles);
    const travelHighlightsStr = typeof travelHighlights === 'string' ? travelHighlights : safeStringifyJSON(travelHighlights);
    const relatedLandsStr = typeof relatedLands === 'string' ? relatedLands : safeStringifyJSON(relatedLands);

    const params = [
        title ?? null,
        slug ?? null,
        location ?? null,
        price ?? null,
        type ?? null,
        status || 'Active',
        description ?? null,
        mainImageUrl ?? null,
        category ?? null,
        district ?? null,
        city ?? null,
        locationLabel ?? null,
        priceLabel ?? null,
        bedrooms ?? null,
        bathrooms ?? null,
        videoUrl ?? null,
        projectPhilosophy ?? null,
        locationHighlightsStr ?? null,
        isFeatured === 'true' || isFeatured === true ? 1 : 0,
        isSoldOut === 'true' || isSoldOut === true ? 1 : 0,
        hotlineNumber ?? null,
        sortOrder || 0,
        shortDescription ?? null,
        fullDescription ?? null,
        amenitiesStr ?? null,
        floorPlansStr ?? null,
        brochureFilesStr ?? null,
        logoImageUrl ?? null,
        blockPlanImageUrl ?? null,
        roadMapImageUrl ?? null,
        locationMapImageUrl ?? null,
        projectStatusLabel ?? null,
        travelHighlightsStr ?? null,
        inquiryEmail ?? null,
        relatedLandsStr ?? null,
        metaTitle ?? null,
        metaDescription ?? null,
        ogImage ?? null,
        whatsappNumber ?? null
    ];

    console.log('SQL Params:', params);

    const insertQuery = `
      INSERT INTO houses (
        title, slug, location, price,
        type, status, description, image,
        category, district, city, locationLabel,
        priceLabel, bedrooms, bathrooms, videoUrl,
        projectPhilosophy, locationHighlights, isFeatured, isSoldOut,
        hotlineNumber, sortOrder, shortDescription, fullDescription,
        amenities, floorPlans, brochureFiles, logoImage,
        blockPlanImage, roadMapImage, locationMapImage, projectStatusLabel,
        travelHighlights, inquiryEmail, relatedLands, metaTitle,
        metaDescription, ogImage, whatsappNumber
      ) VALUES (
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?
      )
    `;

    console.log('Inserting house. Number of columns: 39');
    console.log('Params length:', params.length);

    // Ensure no arrays are passed directly to prevent mysql2 from expanding them
    const safeParams = params.map(p => Array.isArray(p) ? JSON.stringify(p) : p);

    // Insert house
    const result = await query(insertQuery, safeParams);

    const houseId = result.insertId;

    // Handle gallery images
    if (req.files['gallery']) {
      for (const file of req.files['gallery']) {
        const imageUrl = `/uploads/${file.filename}`;
        await query(
          'INSERT INTO house_images (house_id, image_url) VALUES (?, ?)',
          [houseId, imageUrl]
        );
      }
    }

    const newHouse = await query('SELECT * FROM houses WHERE id = ?', [houseId]);
    res.status(201).json(newHouse[0]);

  } catch (error) {
    console.error('Error saving house:', error);
    res.status(500).json({ error: 'Failed to save house: ' + error.message });
  }
});

// PUT update house
app.put('/api/houses/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'logoImage', maxCount: 1 },
    { name: 'blockPlanImage', maxCount: 1 },
    { name: 'roadMapImage', maxCount: 1 },
    { name: 'locationMapImage', maxCount: 1 },
    { name: 'brochureFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`--- PUT /api/houses/${id} ---`);
    console.log('req.body:', req.body);
    console.log('req.files exists:', !!req.files);

    const {
      title, slug, location, price, type, status, description,
      category, district, city, locationLabel, priceLabel, bedrooms, bathrooms, videoUrl, projectPhilosophy, locationHighlights,
      isFeatured, isSoldOut, hotlineNumber, sortOrder,
      shortDescription, fullDescription,
      amenities, floorPlans, brochureFiles,
      projectStatusLabel, travelHighlights, inquiryEmail, relatedLands, metaTitle, metaDescription, ogImage, whatsappNumber
    } = req.body;

    // Backend validation for required fields
    if (!title || !location || !price || !type) {
      return res.status(400).json({ error: 'Missing required fields: title, location, price, and type are required.' });
    }

    const existing = await query('SELECT * FROM houses WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'House not found' });
    }

    let mainImageUrl = existing[0].image;
    if (req.files['image']) {
      mainImageUrl = `/uploads/${req.files['image'][0].filename}`;
    }
    let logoImageUrl = existing[0].logoImage;
    if (req.files['logoImage']) {
      logoImageUrl = `/uploads/${req.files['logoImage'][0].filename}`;
    }
    let blockPlanImageUrl = existing[0].blockPlanImage;
    if (req.files['blockPlanImage']) {
      blockPlanImageUrl = `/uploads/${req.files['blockPlanImage'][0].filename}`;
    }
    let roadMapImageUrl = existing[0].roadMapImage;
    if (req.files['roadMapImage']) {
      roadMapImageUrl = `/uploads/${req.files['roadMapImage'][0].filename}`;
    }
    let locationMapImageUrl = existing[0].locationMapImage;
    if (req.files['locationMapImage']) {
      locationMapImageUrl = `/uploads/${req.files['locationMapImage'][0].filename}`;
    }

    const amenitiesStr = typeof amenities === 'string' ? amenities : safeStringifyJSON(amenities);
    const locationHighlightsStr = typeof locationHighlights === 'string' ? locationHighlights : safeStringifyJSON(locationHighlights);
    const floorPlansStr = typeof floorPlans === 'string' ? floorPlans : safeStringifyJSON(floorPlans);
    const brochureFilesStr = typeof brochureFiles === 'string' ? brochureFiles : safeStringifyJSON(brochureFiles);
    const travelHighlightsStr = typeof travelHighlights === 'string' ? travelHighlights : safeStringifyJSON(travelHighlights);
    const relatedLandsStr = typeof relatedLands === 'string' ? relatedLands : safeStringifyJSON(relatedLands);

    const params = [
        title ?? null,
        slug ?? null,
        location ?? null,
        price ?? null,
        type ?? null,
        status || 'Active',
        description ?? null,
        mainImageUrl ?? null,
        category ?? null,
        district ?? null,
        city ?? null,
        locationLabel ?? null,
        priceLabel ?? null,
        bedrooms ?? null,
        bathrooms ?? null,
        videoUrl ?? null,
        projectPhilosophy ?? null,
        locationHighlightsStr ?? null,
        isFeatured === 'true' || isFeatured === true ? 1 : 0,
        isSoldOut === 'true' || isSoldOut === true ? 1 : 0,
        hotlineNumber ?? null,
        sortOrder || 0,
        shortDescription ?? null,
        fullDescription ?? null,
        amenitiesStr ?? null,
        floorPlansStr ?? null,
        brochureFilesStr ?? null,
        logoImageUrl ?? null,
        blockPlanImageUrl ?? null,
        roadMapImageUrl ?? null,
        locationMapImageUrl ?? null,
        projectStatusLabel ?? null,
        travelHighlightsStr ?? null,
        inquiryEmail ?? null,
        relatedLandsStr ?? null,
        metaTitle ?? null,
        metaDescription ?? null,
        ogImage ?? null,
        whatsappNumber ?? null,
        id
    ];

    console.log('SQL Params:', params);

    // Ensure no arrays are passed directly to prevent mysql2 from expanding them
    const safeParams = params.map(p => Array.isArray(p) ? JSON.stringify(p) : p);

    await query(
      `UPDATE houses SET
        title = ?, slug = ?, location = ?, price = ?, type = ?, status = ?, description = ?, image = ?,
        category = ?, district = ?, city = ?, locationLabel = ?, priceLabel = ?, bedrooms = ?, bathrooms = ?,
        videoUrl = ?, projectPhilosophy = ?, locationHighlights = ?,
        isFeatured = ?, isSoldOut = ?, hotlineNumber = ?, sortOrder = ?,
        shortDescription = ?, fullDescription = ?, amenities = ?, floorPlans = ?, brochureFiles = ?,
        logoImage = ?, blockPlanImage = ?, roadMapImage = ?, locationMapImage = ?, projectStatusLabel = ?, travelHighlights = ?, inquiryEmail = ?, relatedLands = ?, metaTitle = ?, metaDescription = ?, ogImage = ?, whatsappNumber = ?
      WHERE id = ?`,
      safeParams
    );

    if (req.files['gallery']) {
      for (const file of req.files['gallery']) {
        const imageUrl = `/uploads/${file.filename}`;
        await query(
          'INSERT INTO house_images (house_id, image_url) VALUES (?, ?)',
          [id, imageUrl]
        );
      }
    }

    const updatedHouse = await query('SELECT * FROM houses WHERE id = ?', [id]);
    res.json(updatedHouse[0]);

  } catch (error) {
    console.error('Error updating house:', error);
    res.status(500).json({ error: 'Failed to update house' });
  }
});

// DELETE house
app.delete('/api/houses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM houses WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
       return res.status(404).json({ error: 'House not found' });
    }

    res.json({ message: 'House deleted successfully' });
  } catch (error) {
    console.error('Error deleting house:', error);
    res.status(500).json({ error: 'Failed to delete house' });
  }
});

// --- PROJECTS ---

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await query('SELECT * FROM projects ORDER BY createdAt DESC');
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
app.get('/api/projects/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let projects;
    if (!isNaN(identifier)) {
        projects = await query('SELECT * FROM projects WHERE id = ?', [identifier]);
    } else {
        projects = await query('SELECT * FROM projects WHERE id = ?', [identifier]); // No slug in projects table yet, fallback to id
    }

    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projects[0];
    project.images = []; // Mock images array for now since there's no project_images table

    res.json(project);
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
    const inquiries = await query('SELECT * FROM inquiries ORDER BY createdAt DESC');
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

// --- EMAIL SETTINGS ---

app.get('/api/settings/email', async (req, res) => {
  try {
    const configs = await query('SELECT id, mailer, host, port, username, encryption, from_address, from_name, status, createdAt FROM email_settings WHERE status = "Active" LIMIT 1');
    if (!configs || configs.length === 0) {
      return res.status(404).json({ error: 'No active email configuration found' });
    }
    res.json(configs[0]);
  } catch (err) {
    console.error('Error fetching active email settings:', err);
    res.status(500).json({ error: 'Failed to fetch active email settings' });
  }
});

app.get('/api/settings/email/all', async (req, res) => {
  try {
    const configs = await query('SELECT id, mailer, host, port, username, encryption, from_address, from_name, status, createdAt FROM email_settings ORDER BY createdAt DESC');
    res.json(configs);
  } catch (err) {
    console.error('Error fetching email settings:', err);
    res.status(500).json({ error: 'Failed to fetch email settings' });
  }
});

app.post('/api/settings/email', async (req, res) => {
  try {
    const { mailer, host, port, username, password, encryption, from_address, from_name, status } = req.body;

    // If setting as Active, deactivate others first
    if (status === 'Active') {
      await query('UPDATE email_settings SET status = "Inactive"');
    }

    const result = await query(
      'INSERT INTO email_settings (mailer, host, port, username, password, encryption, from_address, from_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [mailer || 'smtp', host, port, username, password, encryption || 'none', from_address, from_name, status || 'Inactive']
    );

    const newConfig = await query('SELECT id, mailer, host, port, username, encryption, from_address, from_name, status, createdAt FROM email_settings WHERE id = ?', [result.insertId]);
    res.status(201).json(newConfig[0]);
  } catch (err) {
    console.error('Error adding email setting:', err);
    res.status(500).json({ error: 'Failed to add email setting' });
  }
});

app.put('/api/settings/email/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mailer, host, port, username, password, encryption, from_address, from_name, status } = req.body;

    if (status === 'Active') {
      await query('UPDATE email_settings SET status = "Inactive" WHERE id != ?', [id]);
    }

    let updateQuery;
    let params;

    if (password && password.trim() !== '') {
        updateQuery = 'UPDATE email_settings SET mailer = ?, host = ?, port = ?, username = ?, password = ?, encryption = ?, from_address = ?, from_name = ?, status = ? WHERE id = ?';
        params = [mailer || 'smtp', host, port, username, password, encryption || 'none', from_address, from_name, status || 'Inactive', id];
    } else {
        updateQuery = 'UPDATE email_settings SET mailer = ?, host = ?, port = ?, username = ?, encryption = ?, from_address = ?, from_name = ?, status = ? WHERE id = ?';
        params = [mailer || 'smtp', host, port, username, encryption || 'none', from_address, from_name, status || 'Inactive', id];
    }

    await query(updateQuery, params);

    const updatedConfig = await query('SELECT id, mailer, host, port, username, encryption, from_address, from_name, status, createdAt FROM email_settings WHERE id = ?', [id]);
    res.json(updatedConfig[0]);
  } catch (err) {
    console.error('Error updating email setting:', err);
    res.status(500).json({ error: 'Failed to update email setting' });
  }
});

app.patch('/api/settings/email/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;

    await query('UPDATE email_settings SET status = "Inactive"');
    await query('UPDATE email_settings SET status = "Active" WHERE id = ?', [id]);

    res.json({ message: 'Configuration activated successfully' });
  } catch (err) {
    console.error('Error activating email setting:', err);
    res.status(500).json({ error: 'Failed to activate email setting' });
  }
});

app.delete('/api/settings/email/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM email_settings WHERE id = ?', [id]);
    res.json({ message: 'Configuration deleted successfully' });
  } catch (err) {
    console.error('Error deleting email setting:', err);
    res.status(500).json({ error: 'Failed to delete email setting' });
  }
});

// --- INQUIRY REPLY (EMAIL) ---

app.post('/api/inquiries/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    // 1. Fetch inquiry
    const inquiries = await query('SELECT * FROM inquiries WHERE id = ?', [id]);
    if (!inquiries || inquiries.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    const inquiry = inquiries[0];

    // 2. Fetch active email config
    const emailConfigs = await query('SELECT * FROM email_settings WHERE status = "Active" LIMIT 1');
    if (!emailConfigs || emailConfigs.length === 0) {
      return res.status(400).json({ error: 'No active email configuration found. Please configure Email Settings first.' });
    }
    const config = emailConfigs[0];

    // 3. Setup Nodemailer transporter
    let secure = false;
    if (config.encryption === 'ssl' || config.encryption === 'tls') {
       // Typically port 465 is secure=true, 587 is secure=false (uses STARTTLS)
       secure = config.port === 465;
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: secure,
      auth: {
        user: config.username,
        pass: config.password
      },
      tls: {
          rejectUnauthorized: false // Often needed for custom/local setups
      }
    });

    // 4. Send email
    const mailOptions = {
      from: `"${config.from_name}" <${config.from_address}>`,
      to: inquiry.email,
      subject: subject,
      text: message, // Can also add html: message
      html: message.replace(/\n/g, '<br>')
    };

    await transporter.sendMail(mailOptions);

    // 5. Update inquiry status
    const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // format for SQLite/MySQL
    await query(
      'UPDATE inquiries SET status = ?, reply_subject = ?, reply_message = ?, replied_at = ? WHERE id = ?',
      ['Replied', subject, message, now, id]
    );

    const updatedInquiry = await query('SELECT * FROM inquiries WHERE id = ?', [id]);

    res.json({ message: 'Reply sent successfully', inquiry: updatedInquiry[0] });

  } catch (error) {
    console.error('Failed to send reply:', error);
    res.status(500).json({ error: 'Failed to send reply: ' + error.message });
  }
});
