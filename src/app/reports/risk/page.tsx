import { query } from '@/lib/db';
import { z } from 'zod';
import Link from 'next/link';

// 1. Definimos el esquema de validación para los filtros (Zod)
const searchSchema = z.object({
  q: z.string().optional(), // Término de búsqueda (query)
  page: z.coerce.number().min(1).default(1), // Página actual (por defecto 1)
});

export default async function RiskReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 2. Validamos los parámetros de la URL con Zod
  const resolvedParams = await searchParams;
  const params = searchSchema.parse(resolvedParams);
  const searchTerm = params.q || '';
  const currentPage = params.page;
  const itemsPerPage = 5; // Mostrar 5 alumnos por página
  const offset = (currentPage - 1) * itemsPerPage;

  // 3. Construimos la consulta SQL dinámica
  // NOTA: Usamos ILIKE para búsqueda insensible a mayúsculas/minúsculas
  const sql = `
    SELECT * FROM vw_students_at_risk
    WHERE nombre ILIKE $1 OR email ILIKE $1
    ORDER BY avg_grade ASC  
    LIMIT $2 OFFSET $3
  `;

  // 4. Ejecutamos la consulta (Server-side)
  const result = await query(sql, [`%${searchTerm}%`, itemsPerPage, offset]);
  const students = result.rows;

  // Consulta extra para saber el total de páginas (para la paginación)
  const countResult = await query(
    `SELECT COUNT(*) as total FROM vw_students_at_risk WHERE nombre ILIKE $1 OR email ILIKE $1`,
    [`%${searchTerm}%`]
  );
  const totalItems = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Encabezado y Botón de Volver */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-700">Alumnos en Riesgo</h1>
          <p className="text-gray-600">Estudiantes con promedio &lt; 7.0 o asistencia &lt; 80%</p>
        </div>
        <Link href="/" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-700">
          &larr; Volver al Dashboard
        </Link>
      </div>

      {/* Barra de Búsqueda (Formulario GET) */}
      <form className="mb-6 flex gap-2">
        <input
          name="q"
          placeholder="Buscar por nombre o email..."
          defaultValue={searchTerm}
          className="flex-1 p-2 border border-gray-400 rounded shadow-sm"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Buscar
        </button>
        {searchTerm && (
          <Link href="/reports/risk" className="bg-gray-400 px-4 py-2 rounded flex items-center">
            Limpiar
          </Link>
        )}
      </form>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Estudiante</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Promedio</th>
              <th className="p-4 font-semibold text-gray-600">Asistencia</th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No se encontraron alumnos con esos criterios.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{student.nombre}</td>
                  <td className="p-4 text-gray-500">{student.email}</td>
                  <td className="p-4 font-bold text-red-600">
                    {Number(student.promedio_final).toFixed(1)}
                  </td>
                  <td className="p-4">
                    {/* Barra de progreso visual */}
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${student.porcentaje_asistencia < 0.8 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                        style={{ width: `${student.porcentaje_asistencia * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {(student.porcentaje_asistencia * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">
                      RIESGO ACADÉMICO
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Página {currentPage} de {totalPages || 1}
        </p>
        <div className="flex gap-2">
          {currentPage > 1 && (
            <Link
              href={`/reports/risk?page=${currentPage - 1}&q=${searchTerm}`}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Anterior
            </Link>
          )}
          {currentPage < totalPages && (
            <Link
              href={`/reports/risk?page=${currentPage + 1}&q=${searchTerm}`}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Siguiente
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}