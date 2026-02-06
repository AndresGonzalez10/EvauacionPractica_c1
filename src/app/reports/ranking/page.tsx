import { query } from '@/lib/db';
import { z } from 'zod';
import Link from 'next/link';

const filterSchema = z.object({
  program: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
});

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const params = filterSchema.parse(resolvedParams);
  
  const selectedProgram = params.program || '';
  const currentPage = params.page;
  const itemsPerPage = 10; 
  const offset = (currentPage - 1) * itemsPerPage;

  let sql = `
    SELECT * FROM vw_rank_students
    WHERE 1=1
  `;
  const queryParams: (string | number)[] = [];

  if (selectedProgram) {
    sql += ` AND program = $1`;
    queryParams.push(selectedProgram);
  }

  sql += ` ORDER BY ranking_posicion ASC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(itemsPerPage, offset);

  const result = await query(sql, queryParams);
  const students = result.rows;

  let countSql = `SELECT COUNT(*) as total FROM vw_rank_students WHERE 1=1`;
  const countParams: string[] = [];
  if (selectedProgram) {
    countSql += ` AND program = $1`;
    countParams.push(selectedProgram);
  }
  const countResult = await query(countSql, countParams);
  const totalItems = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const programsResult = await query(`SELECT DISTINCT program FROM vw_rank_students ORDER BY program ASC`);
  const availablePrograms = programsResult.rows;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-yellow-700 flex items-center gap-2">
            🏆 Ranking Estudiantil
          </h1>
          <p className="text-gray-600">Mejores promedios por programa académico</p>
        </div>
        <Link href="/" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-700">
          &larr; Volver
        </Link>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow-sm flex gap-4 items-center flex-wrap">
        <span className="font-semibold text-gray-700">Filtrar por Carrera:</span>
        <div className="flex gap-2 flex-wrap">
          {availablePrograms.map((p) => (
            <Link
              key={p.program}
              href={`/reports/ranking?program=${encodeURIComponent(p.program)}`}
              className={`px-4 py-2 rounded border transition-colors ${
                selectedProgram === p.program
                  ? 'bg-yellow-500 text-white border-yellow-600 shadow-md'
                  : 'bg-white text-gray-700 hover:bg-yellow-50'
              }`}
            >
              {p.program}
            </Link>
          ))}
          {selectedProgram && (
            <Link href="/reports/ranking" className="px-4 py-2 text-red-600 hover:underline">
              Ver Todos
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-yellow-50 border-b border-yellow-100">
            <tr>
              <th className="p-4 font-semibold text-yellow-900 w-20 text-center">#</th>
              <th className="p-4 font-semibold text-yellow-900">Estudiante</th>
              <th className="p-4 font-semibold text-yellow-900">Programa</th>
              <th className="p-4 font-semibold text-yellow-900">Periodo</th>
              <th className="p-4 font-semibold text-yellow-900 text-right">Promedio</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No hay datos.</td></tr>
            ) : (
              students.map((s, i) => {
                const rank = Number(s.ranking_posicion);
                let rankIcon = <span className="text-gray-500 font-mono">#{rank}</span>;
                let rowClass = "hover:bg-gray-50";

                if (rank === 1) {
                  rankIcon = <span className="text-2xl">🥇</span>;
                  rowClass = "bg-yellow-50 hover:bg-yellow-100";
                } else if (rank === 2) {
                  rankIcon = <span className="text-2xl">🥈</span>;
                } else if (rank === 3) {
                  rankIcon = <span className="text-2xl">🥉</span>;
                }

                return (
                  <tr key={i} className={`border-b border-gray-100 ${rowClass} transition-colors`}>
                    <td className="p-4 text-center font-bold">{rankIcon}</td>
                    <td className="p-4 font-medium text-gray-800">{s.nombre}</td>
                    <td className="p-4 text-sm text-gray-600">{s.program}</td>
                    <td className="p-4">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 font-mono">
                            {s.periodo}
                        </span>
                    </td>
                    <td className="p-4 text-right font-bold text-lg text-gray-800">
                      {Number(s.promedio).toFixed(2)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <p>Página {currentPage} de {totalPages || 1}</p>
        <div className="flex gap-2">
           {currentPage > 1 && (
            <Link href={`/reports/ranking?program=${selectedProgram}&page=${currentPage - 1}`} className="px-3 py-1 border rounded">Anterior</Link>
           )}
           {currentPage < totalPages && (
            <Link href={`/reports/ranking?program=${selectedProgram}&page=${currentPage + 1}`} className="px-3 py-1 border rounded">Siguiente</Link>
           )}
        </div>
      </div>
    </div>
  );
}