-- Créer un utilisateur admin par défaut (pour le premier compte créé)
-- Cette fonction sera exécutée automatiquement lors de la première connexion

-- Insérer quelques données de base pour les tests
INSERT INTO public.sites (name, code, address, city, province, postal_code, description) VALUES
('Site Principal', 'SP001', '123 Rue Principale', 'Montréal', 'QC', 'H1A 1A1', 'Site principal de l''entreprise'),
('Centre de données', 'CD002', '456 Av. Technology', 'Laval', 'QC', 'H7T 2R1', 'Centre de données principal'),
('Station de télécommunications', 'ST003', '789 Boul. Communications', 'Longueuil', 'QC', 'J4K 3K3', 'Station de télécommunications');

INSERT INTO public.equipment (site_id, name, type, manufacturer, model, serial_number, location, status) VALUES
((SELECT id FROM public.sites WHERE code = 'SP001'), 'Onduleur Principal 1', 'ups', 'APC', 'Smart-UPS RT 5000', 'SN001234', 'Salle électrique A', 'active'),
((SELECT id FROM public.sites WHERE code = 'SP001'), 'Redresseur DC 1', 'rectifier', 'Emerson', 'NetSure 501', 'SN001235', 'Salle électrique A', 'active'),
((SELECT id FROM public.sites WHERE code = 'CD002'), 'Système DC Principal', 'dc_system', 'Vertiv', 'NetSure 8000', 'SN001236', 'Salle batterie', 'active'),
((SELECT id FROM public.sites WHERE code = 'ST003'), 'Inverseur Signal', 'inverter', 'Schneider', 'Galaxy VM', 'SN001237', 'Salle technique', 'active');

INSERT INTO public.contractors (name, company, phone, email, specialties, status) VALUES
('Jean Dupont', 'Électrique Pro Inc.', '514-555-0101', 'jean@electriquepro.com', ARRAY['electrical', 'ups'], 'active'),
('Marie Tremblay', 'Service Technique Laval', '450-555-0102', 'marie@servicetechnique.com', ARRAY['maintenance', 'mechanical'], 'active'),
('Pierre Gagnon', 'Réparations Express', '438-555-0103', 'pierre@reparations.com', ARRAY['dc_system', 'battery'], 'active');