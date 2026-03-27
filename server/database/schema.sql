CREATE TABLE IF NOT EXISTS lands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  price VARCHAR(255) NOT NULL,
  type ENUM('Land', 'House', 'Apartment') NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  description TEXT,
  image VARCHAR(255),
  category VARCHAR(255),
  district VARCHAR(255),
  city VARCHAR(255),
  locationLabel VARCHAR(255),
  priceLabel VARCHAR(255),
  bedrooms INT,
  bathrooms INT,
  videoUrl VARCHAR(255),
  projectPhilosophy TEXT,
  locationHighlights TEXT,
  isFeatured BOOLEAN DEFAULT FALSE,
  isSoldOut BOOLEAN DEFAULT FALSE,
  hotlineNumber VARCHAR(50),
  sortOrder INT DEFAULT 0,
  shortDescription TEXT,
  fullDescription TEXT,
  amenities TEXT,
  floorPlans TEXT,
  brochureFiles TEXT,
  logoImage VARCHAR(255),
  blockPlanImage VARCHAR(255),
  roadMapImage VARCHAR(255),
  locationMapImage VARCHAR(255),
  projectStatusLabel VARCHAR(100),
  travelHighlights TEXT,
  inquiryEmail VARCHAR(255),
  relatedLands TEXT,
  metaTitle VARCHAR(255),
  metaDescription TEXT,
  ogImage VARCHAR(255),
  whatsappNumber VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS houses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  price VARCHAR(255) NOT NULL,
  type ENUM('Land', 'House', 'Apartment') NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  description TEXT,
  image VARCHAR(255),
  category VARCHAR(255),
  district VARCHAR(255),
  city VARCHAR(255),
  locationLabel VARCHAR(255),
  priceLabel VARCHAR(255),
  bedrooms INT,
  bathrooms INT,
  videoUrl VARCHAR(255),
  projectPhilosophy TEXT,
  locationHighlights TEXT,
  isFeatured BOOLEAN DEFAULT FALSE,
  isSoldOut BOOLEAN DEFAULT FALSE,
  hotlineNumber VARCHAR(50),
  sortOrder INT DEFAULT 0,
  shortDescription TEXT,
  fullDescription TEXT,
  amenities TEXT,
  floorPlans TEXT,
  brochureFiles TEXT,
  logoImage VARCHAR(255),
  blockPlanImage VARCHAR(255),
  roadMapImage VARCHAR(255),
  locationMapImage VARCHAR(255),
  projectStatusLabel VARCHAR(100),
  travelHighlights TEXT,
  inquiryEmail VARCHAR(255),
  relatedLands TEXT,
  metaTitle VARCHAR(255),
  metaDescription TEXT,
  ogImage VARCHAR(255),
  whatsappNumber VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  short_desc VARCHAR(255),
  description TEXT,
  cover_image VARCHAR(255),
  icon VARCHAR(100),
  sort_order INT DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  year VARCHAR(4),
  description TEXT,
  image VARCHAR(255),
  service_id INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS land_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  land_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (land_id) REFERENCES lands(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS house_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  house_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  service VARCHAR(255),
  message TEXT,
  status ENUM('new', 'replied', 'closed') DEFAULT 'new',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiry_replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inquiry_id INT NOT NULL,
  admin_user VARCHAR(255),
  reply_subject VARCHAR(255),
  reply_message TEXT,
  sent_to_email VARCHAR(255),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivery_status VARCHAR(50),
  error_message TEXT,
  message_id VARCHAR(255),
  FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mailer VARCHAR(50) DEFAULT 'smtp',
  host VARCHAR(255) NOT NULL,
  port INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  encryption VARCHAR(50) DEFAULT 'none',
  from_address VARCHAR(255) NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Inactive',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
