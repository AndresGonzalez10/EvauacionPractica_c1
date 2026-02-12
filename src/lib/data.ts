
import { query } from '@/lib/db';

const ITEMS_PER_PAGE = 5;
const RANKING_ITEMS_PER_PAGE = 10;

export async function getAttendanceReport(term: string, page: number) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const queryParams: (string | number)[] = [];
  let whereClause = 'WHERE 1=1';

  if (term) {
    whereClause += ` AND periodo = $1`;
    queryParams.push(term);
  }

  const sql = `
    SELECT * FROM vw_attendance_by_group
    ${whereClause}
    ORDER BY asistencia_promedio ASC
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
  `;

  const countSql = `SELECT COUNT(*) as total FROM vw_attendance_by_group ${whereClause}`;

  const [dataResult, countResult] = await Promise.all([
    query(sql, [...queryParams, ITEMS_PER_PAGE, offset]),
    query(countSql, queryParams) 
  ]);

  const totalItems = Number(countResult.rows[0].total);
  
  return {
    data: dataResult.rows,
    totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
    currentPage: page
  };
}

export async function getCoursePerformanceReport(term: string, page: number) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const queryParams: (string | number)[] = [];
  let whereClause = 'WHERE 1=1';

  if (term) {
    whereClause += ` AND periodo = $1`;
    queryParams.push(term);
  }

  const sql = `
    SELECT * FROM vw_course_performance
    ${whereClause}
    ORDER BY promedio_general DESC
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
  `;

  const countSql = `SELECT COUNT(*) as total FROM vw_course_performance ${whereClause}`;

  const [dataResult, countResult] = await Promise.all([
    query(sql, [...queryParams, ITEMS_PER_PAGE, offset]),
    query(countSql, queryParams)
  ]);

  const totalItems = Number(countResult.rows[0].total);

  return {
    data: dataResult.rows,
    totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
    currentPage: page
  };
}

export async function getStudentRanking(program: string, page: number) {
  const offset = (page - 1) * RANKING_ITEMS_PER_PAGE;
  const queryParams: (string | number)[] = [];
  let whereClause = 'WHERE 1=1';

  if (program) {
    whereClause += ` AND program = $1`;
    queryParams.push(program);
  }

  const sql = `
    SELECT * FROM vw_rank_students
    ${whereClause}
    ORDER BY ranking_posicion ASC
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
  `;

  const countSql = `SELECT COUNT(*) as total FROM vw_rank_students ${whereClause}`;

  const [dataResult, countResult] = await Promise.all([
    query(sql, [...queryParams, RANKING_ITEMS_PER_PAGE, offset]),
    query(countSql, queryParams)
  ]);

  const totalItems = Number(countResult.rows[0].total);

  return {
    data: dataResult.rows,
    totalPages: Math.ceil(totalItems / RANKING_ITEMS_PER_PAGE),
    currentPage: page
  };
}

export async function getStudentsAtRisk(searchTerm: string, page: number) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  
  const sql = `
    SELECT * FROM vw_students_at_risk
    WHERE nombre ILIKE $1 OR email ILIKE $1
    ORDER BY avg_grade ASC  
    LIMIT $2 OFFSET $3
  `;

  const countSql = `SELECT COUNT(*) as total FROM vw_students_at_risk WHERE nombre ILIKE $1 OR email ILIKE $1`;

  const [dataResult, countResult] = await Promise.all([
    query(sql, [`%${searchTerm}%`, ITEMS_PER_PAGE, offset]),
    query(countSql, [`%${searchTerm}%`])
  ]);

  const totalItems = Number(countResult.rows[0].total);

  return {
    data: dataResult.rows,
    totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
    currentPage: page
  };
}

export async function getTeacherLoadReport(term: string, page: number) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const queryParams: (string | number)[] = [];
  let whereClause = 'WHERE 1=1';

  if (term) {
    whereClause += ` AND periodo = $1`;
    queryParams.push(term);
  }

  const sql = `
    SELECT * FROM vw_teacher_load
    ${whereClause}
    ORDER BY total_alumnos DESC
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
  `;

  const countSql = `SELECT COUNT(*) as total FROM vw_teacher_load ${whereClause}`;

  const [dataResult, countResult] = await Promise.all([
    query(sql, [...queryParams, ITEMS_PER_PAGE, offset]),
    query(countSql, queryParams)
  ]);

  const totalItems = Number(countResult.rows[0].total);

  return {
    data: dataResult.rows,
    totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
    currentPage: page
  };
}

export async function getDistinctTerms(viewName: string) {
  const allowedViews = ['vw_attendance_by_group', 'vw_course_performance', 'vw_teacher_load'];
  if (!allowedViews.includes(viewName)) throw new Error("Invalid view name");

  const result = await query(`SELECT DISTINCT periodo FROM ${viewName} ORDER BY periodo DESC`);
  return result.rows;
}

export async function getDistinctPrograms() {
  const result = await query(`SELECT DISTINCT program FROM vw_rank_students ORDER BY program ASC`);
  return result.rows;
}