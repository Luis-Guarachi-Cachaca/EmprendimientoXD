import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * PUT /api/admin/productos/[id]
 * Actualiza un producto existente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'SUPABASE_SECRET_KEY no está configurado' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { id } = await params;

    // Validación básica
    if (!id) {
      return NextResponse.json(
        { error: 'ID de producto requerido' },
        { status: 400 }
      );
    }

    // Preparar datos para actualizar
    const productoData: any = {};

    if (body.nombre !== undefined) productoData.nombre = body.nombre;
    if (body.slug !== undefined) productoData.slug = body.slug;
    if (body.descripcion_corta !== undefined) productoData.descripcion_corta = body.descripcion_corta;
    if (body.descripcion_completa !== undefined) productoData.descripcion_completa = body.descripcion_completa;
    if (body.marca_id !== undefined) productoData.marca_id = body.marca_id;
    if (body.precio !== undefined) productoData.precio = parseFloat(body.precio);
    if (body.porcentaje_descuento !== undefined) {
      productoData.porcentaje_descuento = body.porcentaje_descuento ? parseFloat(body.porcentaje_descuento) : null;
    }
    if (body.url_imagen !== undefined) productoData.url_imagen = body.url_imagen;
    if (body.categoria_id !== undefined) productoData.categoria_id = body.categoria_id;
    if (body.genero_id !== undefined) productoData.genero_id = body.genero_id;
    if (body.stock !== undefined) productoData.stock = body.stock;
    if (body.esta_disponible !== undefined) productoData.esta_disponible = body.esta_disponible;
    if (body.es_nuevo !== undefined) productoData.es_nuevo = body.es_nuevo;
    if (body.es_activo !== undefined) productoData.es_activo = body.es_activo;
    if (body.orden_ordenamiento !== undefined) productoData.orden_ordenamiento = body.orden_ordenamiento;
    if (body.contenido !== undefined) productoData.contenido = body.contenido ? parseFloat(body.contenido) : null;
    if (body.unidad_medida !== undefined) productoData.unidad_medida = body.unidad_medida;

    const { data, error } = await supabaseServer
      .from('productos')
      .update(productoData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar producto:', error);
      return NextResponse.json(
        { error: 'Error al actualizar producto: ' + error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en PUT /api/admin/productos/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/productos/[id]
 * Elimina un producto
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'SUPABASE_SECRET_KEY no está configurado' },
        { status: 500 }
      );
    }

    const { id } = await params;

    // Validación básica
    if (!id) {
      return NextResponse.json(
        { error: 'ID de producto requerido' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar producto:', error);
      return NextResponse.json(
        { error: 'Error al eliminar producto: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en DELETE /api/admin/productos/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
