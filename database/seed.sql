-- Properties
INSERT INTO properties (title, slug, location, price, type, status, description, image) VALUES
('The Sovereign Estate', 'the-sovereign-estate', 'Colombo 07, Sri Lanka', 'LKR 450,000,000', 'House', 'Active', 'A luxurious estate in the heart of Colombo.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'),
('Azure Heights Penthouse', 'azure-heights-penthouse', 'Bambalapitiya, Colombo 04', 'LKR 125,000,000', 'Apartment', 'Active', 'Stunning penthouse with ocean views.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'),
('Emerald Grove Plots', 'emerald-grove-plots', 'Athurugiriya, Malabe', 'LKR 2,500,000 per perch', 'Land', 'Active', 'Prime land for residential development.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200');

-- Services
INSERT INTO services (title, slug, short_desc, description, cover_image, icon, sort_order, status) VALUES
('Property Development', 'property-development', 'We specialize in the development of premium residential and commercial properties.', 'Full-scale property development services including site acquisition, design, planning, and construction management.', NULL, 'Building', 1, 'active'),
('Property Management', 'property-management', 'Comprehensive management services for your real estate assets.', 'Our team ensures that your project is completed on time, within budget, and to the highest quality through single-point accountability.', NULL, 'Settings', 2, 'active'),
('Consultancy Services', 'consultancy-services', 'Professional advice to guide you through the real estate process.', 'We offer professional advice to guide you through the real estate process from start to finish, ensuring investment growth.', NULL, 'Users', 3, 'active');

-- Projects (Linked to Services)
INSERT INTO projects (title, category, location, year, description, image, service_id) VALUES
('The Zenith Residence', 'Architecture', 'Colombo 03', '2023', 'A 42-story architectural marvel redefining the Colombo skyline with sustainable design.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200', 1),
('Nuera Gated Community', 'Urban Planning', 'Battaramulla', '2022', 'Boutique residential enclave focused on privacy, security, and tropical modernism.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200', 1),
('Ocean View Condominiums', 'Construction', 'Negombo', '2021', 'Premier seaside luxury living with high-durability coastal construction materials.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200', 1),
('The Heritage Pavilion', 'Restoration', 'Kandy', '2020', 'Sensitive restoration of a colonial-era manor into a modern boutique luxury hotel.', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=1200', 3);
