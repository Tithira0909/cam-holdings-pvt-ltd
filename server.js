import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

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

const DB_FILE = path.join(__dirname, 'server/db.json');

// Helper to read DB
const readDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    return [];
  }
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper to write DB
const writeDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Routes

// GET all properties
app.get('/api/properties', (req, res) => {
  const properties = readDb();
  res.json(properties);
});

// POST new property
app.post('/api/properties', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), (req, res) => {
  try {
    const properties = readDb();
    const newProperty = req.body;

    // Process files
    if (req.files['image']) {
      newProperty.image = `/uploads/${req.files['image'][0].filename}`;
    }

    if (req.files['gallery']) {
      newProperty.gallery = req.files['gallery'].map(file => `/uploads/${file.filename}`);
    } else {
      newProperty.gallery = [];
    }

    // Add ID
    newProperty.id = Date.now().toString(); // Simple ID generation

    // Parse numeric fields if needed (price is string in prompt, but maybe cleaner as number? Prompt says "VARCHAR for price to match frontend formatting")
    // Keep as string as requested.

    properties.push(newProperty);
    writeDb(properties);

    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error saving property:', error);
    res.status(500).json({ error: 'Failed to save property' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
