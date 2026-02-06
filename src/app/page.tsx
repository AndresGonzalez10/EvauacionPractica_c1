import Link from 'next/link';
import { query } from '../lib/db';

export default async function Home() {

  const riskResult = await query('SELECT COUNT(*) as total FROM vw_students_at_risk');
  const riskCount = riskResult.rows[0].total;

  const perfResult = await query('SELECT AVG(promedio_general) as promedio FROM vw_course_performance');
  const avgSchool = Number(perfResult.rows[0].promedio).toFixed(2);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">
        Panel de Coordinación Académica
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="text-gray-500 text-sm uppercase">Alumnos en Riesgo</h3>
          <p className="text-4xl font-bold text-gray-800">{riskCount}</p>
          <p className="text-xs text-gray-400 mt-2">Promedio &lt; 7.0 o Asistencia &lt; 80%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm uppercase">Promedio General Escuela</h3>
          <p className="text-4xl font-bold text-gray-800">{avgSchool}</p>
          <p className="text-xs text-gray-400 mt-2">Basado en rendimiento de cursos</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-700">Reportes Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <ReportCard 
          title="Alumnos en Riesgo" 
          desc="Listado detallado para intervención inmediata."
          link="/reports/risk"
          color="bg-red-50 hover:bg-red-100"
        />

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Desempeño por Curso</h2>
          <p className="text-gray-600 text-sm mb-4">
            Promedios y tasa de reprobación por materia y periodo.
          </p>
          <Link
            href="/reports/courses"
            className="text-blue-600 font-medium hover:underline text-sm flex items-center gap-1"
          >
            Ver reporte &rarr;
          </Link>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="text-xl font-bold text-purple-800 mb-2">Asistencia</h2>
          <p className="text-gray-600 text-sm mb-4">
            Reporte de asistencia promedio por grupos y materias.
          </p>
          <Link
            href="/reports/attendance"
            className="text-purple-600 font-medium hover:underline text-sm flex items-center gap-1"
          >
            Ver reporte &rarr;
          </Link>
        </div>
        <ReportCard 
          title="Carga Docente" 
          desc="Grupos y alumnos por profesor."
          link="/reports/teachers"
          color="bg-green-50 hover:bg-green-100"
        />

        <ReportCard 
          title="Ranking Estudiantil" 
          desc="Mejores promedios por programa."
          link="/reports/ranking"
          color="bg-yellow-50 hover:bg-yellow-100"
        />
        
      </div>
    </main>
  );
}

function ReportCard({ title, desc, link, color }: { title: string, desc: string, link: string, color: string }) {
  return (
    <Link href={link} className={`block p-6 rounded-lg border border-gray-200 transition-all ${color}`}>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
      <span className="inline-block mt-4 text-blue-600 text-sm font-medium">Ver reporte &rarr;</span>
    </Link>
  );
}