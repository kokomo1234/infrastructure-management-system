-- Donner le rôle admin au premier utilisateur qui s'inscrit
-- (remplacer par votre email réel)
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users 
  ORDER BY created_at ASC 
  LIMIT 1
);