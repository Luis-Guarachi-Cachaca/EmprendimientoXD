import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase con permisos service_role (solo servidor)
 * 
 * IMPORTANTE: Este cliente solo debe usarse en el servidor (API routes, Server Actions)
 * NUNCA en componentes del cliente, porque expone la clave service_role.
 * 
 * La clave service_role se obtiene de:
 * Supabase Dashboard → Project Settings → API → service_role key
 * 
 * Variable de entorno requerida: SUPABASE_SECRET_KEY (sin NEXT_PUBLIC_)
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL no está definido');
}

export const supabaseServer = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
