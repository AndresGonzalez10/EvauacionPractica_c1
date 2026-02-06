import { query } from '@/lib/db';
import { z } from 'zod';
import Link from 'next/link';

const filterSchema = z.object({
  term: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
});

export default async function TeacherLoadPage({
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


  let sql = `
    SELECT * FROM vw_teacher_load
    WHERE 1=1
  `;
  const queryParams: (string | number)[] = [];

  if (selectedTerm) {
    sql += ` AND periodo = $1`;
    queryParams.push(selectedTerm);
  }


  sql += ` ORDER BY total_alumnos DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(itemsPerPage, offset);


  const result = await query(sql, queryParams);
  const teachers = result.rows;

  let countSql = `SELECT COUNT(*) as total FROM vw_teacher_load WHERE 1=1`;
  const countParams: string[] = [];
  if (selectedTerm) {
    countSql += ` AND periodo = $1`;
    countParams.push(selectedTerm);
  }
  const countResult = await query(countSql, countParams);
  const totalItems = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalItems / itemsPerPage);


  const termsResult = await query(`SELECT DISTINCT periodo FROM vw_teacher_load ORDER BY periodo DESC`);
  const availableTerms = termsResult.rows;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Carga Docente</h1>
          <p className="text-gray-600">Grupos y total de alumnos por profesor</p>
        </div>
        <Link href="/" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-700">
          &larr; Volver
        </Link>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow-sm flex gap-4 items-center">
        <span className="font-semibold text-gray-700">Periodo:</span>
        <div className="flex gap-2">
          {availableTerms.map((t) => (
            <Link
              key={t.periodo}
              href={`/reports/teachers?term=${t.periodo}`}
              className={`px-4 py-2 rounded border ${
                selectedTerm === t.periodo
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t.periodo}
            </Link>
          ))}
          {selectedTerm && (
            <Link href="/reports/teachers" className="px-4 py-2 text-red-600 hover:underline">
              Borrar filtro
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-green-50 border-b border-green-100">
            <tr>
              <th className="p-4 font-semibold text-green-900">Docente</th>
              <th className="p-4 font-semibold text-green-900">Periodo</th>
              <th className="p-4 font-semibold text-green-900 text-center">Grupos</th>
              <th className="p-4 font-semibold text-green-900 text-center">Total Alumnos</th>
              <th className="p-4 font-semibold text-green-900 text-right">Promedio Asignado</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No hay datos.</td></tr>
            ) : (
              teachers.map((t, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium">{t.docente}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 font-mono">
                      {t.periodo}
                    </span>
                  </td>
                  <td className="p-4 text-center text-lg">{t.total_grupos}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-bold text-sm ${
                      t.total_alumnos > 30 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {t.total_alumnos}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-gray-700">
                    {Number(t.promedio_docente).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <p>Página {currentPage} de {totalPages || 1}</p>
        <div className="flex gap-2">
           {currentPage > 1 && (
            <Link href={`/reports/teachers?term=${selectedTerm}&page=${currentPage - 1}`} className="px-3 py-1 border rounded">Anterior</Link>
           )}
           {currentPage < totalPages && (
            <Link href={`/reports/teachers?term=${selectedTerm}&page=${currentPage + 1}`} className="px-3 py-1 border rounded">Siguiente</Link>
           )}
        </div>
      </div>
    </div>
  );
}