import { getCoursePerformanceReport, getDistinctTerms } from '@/lib/data';
import { z } from 'zod';
import Link from 'next/link';

const filterSchema = z.object({
  term: z.string().optional(), 
  page: z.coerce.number().min(1).default(1),
});

export default async function CoursePerformancePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const params = filterSchema.parse(resolvedParams);
  const selectedTerm = params.term || '';
  const currentPage = params.page;

  const { data: courses, totalPages } = await getCoursePerformanceReport(selectedTerm, currentPage);
  const availableTerms = await getDistinctTerms('vw_course_performance');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Desempeño por Curso</h1>
          <p className="text-gray-600">Análisis de promedios y reprobados por materia</p>
        </div>
        <Link href="/" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-700">
          &larr; Volver
        </Link>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow-sm flex gap-4 items-center">
        <span className="font-semibold text-gray-700">Filtrar por Periodo:</span>
        <div className="flex gap-2">
          {availableTerms.map((t) => (
            <Link
              key={t.periodo}
              href={`/reports/courses?term=${t.periodo}`}
              className={`px-4 py-2 rounded border ${
                selectedTerm === t.periodo
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t.periodo}
            </Link>
          ))}
          {selectedTerm && (
            <Link href="/reports/courses" className="px-4 py-2 text-red-600 hover:underline">
              Borrar filtro
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-50 border-b border-blue-100">
            <tr>
              <th className="p-4 font-semibold text-blue-900">Curso</th>
              <th className="p-4 font-semibold text-blue-900">Periodo</th>
              <th className="p-4 font-semibold text-blue-900">Promedio General</th>
              <th className="p-4 font-semibold text-blue-900 text-center">Reprobados</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No hay datos.</td></tr>
            ) : (
              courses.map((c, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium">{c.curso}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 font-mono">
                      {c.periodo}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-800">
                    {Number(c.promedio_general).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    {c.total_reprobados > 0 ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                        {c.total_reprobados}
                      </span>
                    ) : (
                      <span className="text-green-500 font-bold">0</span>
                    )}
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
            <Link href={`/reports/courses?term=${selectedTerm}&page=${currentPage - 1}`} className="px-3 py-1 border rounded">Anterior</Link>
           )}
           {currentPage < totalPages && (
            <Link href={`/reports/courses?term=${selectedTerm}&page=${currentPage + 1}`} className="px-3 py-1 border rounded">Siguiente</Link>
           )}
        </div>
      </div>
    </div>
  );
}