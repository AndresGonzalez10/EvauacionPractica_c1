import { query } from '@/lib/db';
import { z } from 'zod';
import Link from 'next/link';

const filterSchema = z.object({
  term: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
});

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const params = filterSchema.parse(resolvedParams);
  
  const selectedTerm = params.term || '';
  const currentPage = params.page;
  const itemsPerPage = 5;
  const offset = (currentPage - 1) * itemsPerPage;

  // SQL Dinámico
  let sql = `
    SELECT * FROM vw_attendance_by_group
    WHERE 1=1
  `;
  const queryParams: (string | number)[] = [];

  if (selectedTerm) {
    sql += ` AND periodo = $1`;
    queryParams.push(selectedTerm);
  }

  // Ordenamos: Los que tienen MENOR asistencia aparecen primero (son los preocupantes)
  sql += ` ORDER BY asistencia_promedio ASC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(itemsPerPage, offset);

  const result = await query(sql, queryParams);
  const groups = result.rows;

  // Paginación
  let countSql = `SELECT COUNT(*) as total FROM vw_attendance_by_group WHERE 1=1`;
  const countParams: string[] = [];
  if (selectedTerm) {
    countSql += ` AND periodo = $1`;
    countParams.push(selectedTerm);
  }
  const countResult = await query(countSql, countParams);
  const totalItems = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Periodos disponibles
  const termsResult = await query(`SELECT DISTINCT periodo FROM vw_attendance_by_group ORDER BY periodo DESC`);
  const availableTerms = termsResult.rows;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Asistencia por Grupo</h1>
          <p className="text-gray-600">Porcentaje de asistencia promedio por materia y grupo</p>
        </div>
        <Link href="/" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-700">
          &larr; Volver
        </Link>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-white p-4 rounded shadow-sm flex gap-4 items-center">
        <span className="font-semibold text-gray-700">Periodo:</span>
        <div className="flex gap-2">
          {availableTerms.map((t) => (
            <Link
              key={t.periodo}
              href={`/reports/attendance?term=${t.periodo}`}
              className={`px-4 py-2 rounded border ${
                selectedTerm === t.periodo
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t.periodo}
            </Link>
          ))}
          {selectedTerm && (
            <Link href="/reports/attendance" className="px-4 py-2 text-red-600 hover:underline">
              Borrar filtro
            </Link>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-purple-50 border-b border-purple-100">
            <tr>
              <th className="p-4 font-semibold text-purple-900">Curso</th>
              <th className="p-4 font-semibold text-purple-900">Periodo</th>
              <th className="p-4 font-semibold text-purple-900">Asistencia Promedio</th>
              <th className="p-4 font-semibold text-purple-900">Estado</th>
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No hay datos.</td></tr>
            ) : (
              groups.map((g, i) => {
                const percentage = Number(g.asistencia_promedio);
                let colorClass = 'bg-green-500';
                if (percentage < 80) colorClass = 'bg-red-500';
                else if (percentage < 90) colorClass = 'bg-yellow-500';

                return (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium">{g.curso}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 font-mono">
                        {g.periodo}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold w-12">{percentage.toFixed(1)}%</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 max-w-[150px]">
                          <div 
                            className={`h-2.5 rounded-full ${colorClass}`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {percentage < 80 ? (
                        <span className="text-red-600 text-sm font-bold">Crítico</span>
                      ) : percentage < 90 ? (
                        <span className="text-yellow-600 text-sm font-bold">Regular</span>
                      ) : (
                        <span className="text-green-600 text-sm font-bold">Excelente</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <p>Página {currentPage} de {totalPages || 1}</p>
        <div className="flex gap-2">
           {currentPage > 1 && (
            <Link href={`/reports/attendance?term=${selectedTerm}&page=${currentPage - 1}`} className="px-3 py-1 border rounded">Anterior</Link>
           )}
           {currentPage < totalPages && (
            <Link href={`/reports/attendance?term=${selectedTerm}&page=${currentPage + 1}`} className="px-3 py-1 border rounded">Siguiente</Link>
           )}
        </div>
      </div>
    </div>
  );
}