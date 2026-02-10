-- Properties
INSERT INTO properties (id, title, location, price, type, image, beds, baths, sqft, featured) VALUES
(1, 'The Sovereign Estate', 'Colombo 07, Sri Lanka', 'LKR 450,000,000', 'House', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200', 6, 5, 8500, TRUE),
(2, 'Azure Heights Penthouse', 'Bambalapitiya, Colombo 04', 'LKR 125,000,000', 'Apartment', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200', 3, 3, 2400, TRUE),
(3, 'Emerald Grove Plots', 'Athurugiriya, Malabe', 'LKR 2,500,000 per perch', 'Land', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200', NULL, NULL, NULL, FALSE),
(4, 'Minimalist Sanctuary', 'Rajagiriya, Sri Jayawardenepura', 'LKR 85,000,000', 'House', 'https://images.unsplash.com/photo-1600607687940-467f4b637779?auto=format&fit=crop&q=80&w=1200', 4, 4, 3200, TRUE),
(5, 'Marine Drive Residences', 'Colombo 03', 'LKR 75,000,000', 'Apartment', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200', 2, 2, 1800, FALSE),
(6, 'Heritage Villa', 'Kandy, Central Province', 'LKR 110,000,000', 'House', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=1200', 5, 4, 5500, FALSE);

-- Floor Plans
INSERT INTO floor_plans (property_id, label, image) VALUES
(1, 'Ground Floor', 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1200'),
(1, 'First Floor', 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&q=80&w=1200'),
(2, 'Unit Layout', 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&q=80&w=1200'),
(4, 'Main Level', 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1200');

-- Projects
INSERT INTO projects (title, category, image, description, location, year) VALUES
('The Zenith Residence', 'Architecture', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200', 'A 42-story architectural marvel redefining the Colombo skyline with sustainable design.', 'Colombo 03', '2023'),
('Nuera Gated Community', 'Urban Planning', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200', 'Boutique residential enclave focused on privacy, security, and tropical modernism.', 'Battaramulla', '2022'),
('Ocean View Condominiums', 'Construction', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200', 'Premier seaside luxury living with high-durability coastal construction materials.', 'Negombo', '2021'),
('The Heritage Pavilion', 'Restoration', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=1200', 'Sensitive restoration of a colonial-era manor into a modern boutique luxury hotel.', 'Kandy', '2020');
