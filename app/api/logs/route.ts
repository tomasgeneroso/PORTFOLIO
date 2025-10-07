import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint para recibir logs del cliente
 * POST /api/logs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { logs } = body;

    if (!logs || !Array.isArray(logs)) {
      return NextResponse.json(
        { error: 'Invalid logs format' },
        { status: 400 }
      );
    }

    // Aquí puedes guardar los logs en la base de datos
    // Por ahora solo los imprimimos en el servidor
    console.log('[SERVER LOGS]', {
      timestamp: new Date().toISOString(),
      count: logs.length,
      logs: logs,
    });

    // TODO: Guardar en MongoDB si es necesario
    // await saveLogsToDatabase(logs);

    return NextResponse.json({ success: true, received: logs.length });
  } catch (error) {
    console.error('Error processing logs:', error);
    return NextResponse.json(
      { error: 'Failed to process logs' },
      { status: 500 }
    );
  }
}
