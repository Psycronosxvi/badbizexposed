-- Seed Data for ComplaintHub

-- Insert categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
  ('HOA Complaints', 'hoa', 'Homeowners Association disputes and complaints', 'building'),
  ('Apartment Management', 'apartments', 'Apartment complex and property management issues', 'home'),
  ('Property Management', 'property-management', 'Property management company complaints', 'briefcase'),
  ('Tenant Harassment', 'tenant-harassment', 'Reports of tenant harassment and abuse', 'alert-triangle'),
  ('Landlord Disputes', 'landlord', 'Landlord-tenant disputes and issues', 'user-x'),
  ('Business Misconduct', 'business', 'General business misconduct reports', 'alert-circle')
ON CONFLICT (slug) DO NOTHING;

-- Insert all US states
INSERT INTO public.states (name, abbreviation) VALUES
  ('Alabama', 'AL'), ('Alaska', 'AK'), ('Arizona', 'AZ'), ('Arkansas', 'AR'),
  ('California', 'CA'), ('Colorado', 'CO'), ('Connecticut', 'CT'), ('Delaware', 'DE'),
  ('Florida', 'FL'), ('Georgia', 'GA'), ('Hawaii', 'HI'), ('Idaho', 'ID'),
  ('Illinois', 'IL'), ('Indiana', 'IN'), ('Iowa', 'IA'), ('Kansas', 'KS'),
  ('Kentucky', 'KY'), ('Louisiana', 'LA'), ('Maine', 'ME'), ('Maryland', 'MD'),
  ('Massachusetts', 'MA'), ('Michigan', 'MI'), ('Minnesota', 'MN'), ('Mississippi', 'MS'),
  ('Missouri', 'MO'), ('Montana', 'MT'), ('Nebraska', 'NE'), ('Nevada', 'NV'),
  ('New Hampshire', 'NH'), ('New Jersey', 'NJ'), ('New Mexico', 'NM'), ('New York', 'NY'),
  ('North Carolina', 'NC'), ('North Dakota', 'ND'), ('Ohio', 'OH'), ('Oklahoma', 'OK'),
  ('Oregon', 'OR'), ('Pennsylvania', 'PA'), ('Rhode Island', 'RI'), ('South Carolina', 'SC'),
  ('South Dakota', 'SD'), ('Tennessee', 'TN'), ('Texas', 'TX'), ('Utah', 'UT'),
  ('Vermont', 'VT'), ('Virginia', 'VA'), ('Washington', 'WA'), ('West Virginia', 'WV'),
  ('Wisconsin', 'WI'), ('Wyoming', 'WY')
ON CONFLICT (abbreviation) DO NOTHING;

-- Insert initial site statistics
INSERT INTO public.site_stats (stat_key, stat_value) VALUES
  ('registered_users', 47832),
  ('total_complaints', 128456),
  ('active_discussions', 8934),
  ('companies_listed', 15672)
ON CONFLICT (stat_key) DO NOTHING;

-- Insert scandal banners
INSERT INTO public.scandal_banners (title, description, link_type, is_active, priority) VALUES
  ('Las Vegas HOA Parking Fine Disputes Growing', 'Residents report unfair parking enforcement across multiple Las Vegas communities', 'category', true, 10),
  ('Property Management Delays Reported Across Arizona', 'Multiple property management companies face complaints about maintenance response times', 'category', true, 9),
  ('Tenants Reporting Communication Issues With Multiple HOAs', 'Growing trend of HOAs failing to respond to resident inquiries', 'category', true, 8),
  ('California Landlord Class Action Gaining Momentum', 'Tenants organizing over security deposit disputes', 'category', true, 7),
  ('Oregon Property Managers Under Investigation', 'State officials reviewing complaints against several property management firms', 'category', true, 6);
