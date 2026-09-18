import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * POST /api/admin/productos
 * Crea un nuevo producto
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

    // Validación básica
    if (!body.nombre || !body.precio) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre y precio' },
        { status: 400 }
      );
    }

    // Preparar datos para insertar
    const productoData = {
      nombre: body.nombre,
      slug: body.slug || body.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      descripcion_corta: body.descripcion_corta || null,
      descripcion_completa: body.descripcion_completa || null,
      marca_id: body.marca_id || null,
      precio: parseFloat(body.precio),
      porcentaje_descuento: body.porcentaje_descuento ? parseFloat(body.porcentaje_descuento) : null,
      url_imagen: body.url_imagen || null,
      categoria_id: body.categoria_id || null,
      genero_id: body.genero_id || null,
      stock: body.stock || 0,
      esta_disponible: body.esta_disponible !== undefined ? body.esta_disponible : true,
      es_nuevo: body.es_nuevo || false,
      es_activo: body.es_activo !== undefined ? body.es_activo : true,
      orden_ordenamiento: body.orden_ordenamiento || 0,
    };

    const { data, error } = await supabaseServer
      .from('productos')
      .insert(productoData)
      .select()
      .single();

    if (error) {
      console.error('Error al crear producto:', error);
      return NextResponse.json(
        { error: 'Error al crear producto: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/admin/productos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
