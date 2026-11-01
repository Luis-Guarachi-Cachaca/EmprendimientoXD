import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * POST /api/admin/marcas
 * Crea una nueva marca
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'SUPABASE_SECRET_KEY no está configurado' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';

    // Validación básica
    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre de la marca es requerido' },
        { status: 400 }
      );
    }

    const slug = generateSlug(nombre);
    if (!slug) {
      return NextResponse.json(
        { error: 'El nombre de la marca no es válido' },
        { status: 400 }
      );
    }

    // La nueva marca va al final de la lista
    const { data: ultima } = await supabaseServer
      .from('marcas')
      .select('orden_ordenamiento')
      .order('orden_ordenamiento', { ascending: false })
      .limit(1);

    const siguienteOrden = (ultima?.[0]?.orden_ordenamiento ?? 0) + 1;

    const { data, error } = await supabaseServer
      .from('marcas')
      .insert({
        nombre,
        slug,
        orden_ordenamiento: siguienteOrden,
        es_activo: true,
      })
      .select()
      .single();

    if (error) {
      // 23505 = valor duplicado (ya existe una marca con ese slug)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe una marca con ese nombre' },
          { status: 409 }
        );
      }

      console.error('Error al crear marca:', error);
      return NextResponse.json(
        { error: 'Error al crear marca: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/admin/marcas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}