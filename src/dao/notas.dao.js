import db from '../database/db.js';

// Seleciona todas as notas com informações detalhadas sobre aluno, disciplina e professor, com paginação
export const selectNotas = async (page, limit) => { 
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT N.ID, N.AlunoID, N.DisciplinaID, N.ProfessorID, N.Bimestre, N.Nota,
           A.Nome AS AlunoNome, D.Nome AS DisciplinaNome, P.Nome AS ProfessorNome
    FROM Notas N
    INNER JOIN Alunos A ON N.AlunoID = A.ID
    INNER JOIN Disciplinas D ON N.DisciplinaID = D.ID
    INNER JOIN Professores P ON N.ProfessorID = P.ID
    ORDER BY N.ID
    OFFSET ${Number(offset)} ROWS
    FETCH NEXT ${Number(limit)} ROWS ONLY
  `;
  
  return result.recordset;
};

// Seleciona notas por aluno com informações detalhadas, com paginação
export const selectNotasByAluno = async (alunoId, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT N.ID, N.AlunoID, N.DisciplinaID, N.ProfessorID, N.Bimestre, N.Nota,
           A.Nome AS AlunoNome, D.Nome AS DisciplinaNome, P.Nome AS ProfessorNome
    FROM Notas N
    INNER JOIN Alunos A ON N.AlunoID = A.ID
    INNER JOIN Disciplinas D ON N.DisciplinaID = D.ID
    INNER JOIN Professores P ON N.ProfessorID = P.ID
    WHERE N.AlunoID = ${alunoId}
    ORDER BY N.ID
    OFFSET ${Number(offset)} ROWS
    FETCH NEXT ${Number(limit)} ROWS ONLY
  `;
  
  return result.recordset;
};

// Seleciona notas por disciplina com informações detalhadas, com paginação
export const selectNotasByDisciplina = async (disciplinaId, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT N.ID, N.AlunoID, N.DisciplinaID, N.ProfessorID, N.Bimestre, N.Nota,
           A.Nome AS AlunoNome, D.Nome AS DisciplinaNome, P.Nome AS ProfessorNome
    FROM Notas N
    INNER JOIN Alunos A ON N.AlunoID = A.ID
    INNER JOIN Disciplinas D ON N.DisciplinaID = D.ID
    INNER JOIN Professores P ON N.ProfessorID = P.ID
    WHERE N.DisciplinaID = ${disciplinaId}
    ORDER BY N.ID
    OFFSET ${Number(offset)} ROWS
    FETCH NEXT ${Number(limit)} ROWS ONLY
  `;
  
  return result.recordset;
};

// Seleciona notas por professor com informações detalhadas, com paginação
export const selectNotasByProfessor = async (professorId, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT N.ID, N.AlunoID, N.DisciplinaID, N.ProfessorID, N.Bimestre, N.Nota,
           A.Nome AS AlunoNome, D.Nome AS DisciplinaNome, P.Nome AS ProfessorNome
    FROM Notas N
    INNER JOIN Alunos A ON N.AlunoID = A.ID
    INNER JOIN Disciplinas D ON N.DisciplinaID = D.ID
    INNER JOIN Professores P ON N.ProfessorID = P.ID
    WHERE N.ProfessorID = ${professorId}
    ORDER BY N.ID
    OFFSET ${Number(offset)} ROWS
    FETCH NEXT ${Number(limit)} ROWS ONLY
  `;
  
  return result.recordset;
};

// Seleciona uma nota específica por ID com informações detalhadas
export const selectNotaById = async (id) => {
  const result = await db.query`
    SELECT N.ID, N.AlunoID, N.DisciplinaID, N.ProfessorID, N.Bimestre, N.Nota,
           A.Nome AS AlunoNome, D.Nome AS DisciplinaNome, P.Nome AS ProfessorNome
    FROM Notas N
    INNER JOIN Alunos A ON N.AlunoID = A.ID
    INNER JOIN Disciplinas D ON N.DisciplinaID = D.ID
    INNER JOIN Professores P ON N.ProfessorID = P.ID
    WHERE N.ID = ${id}
  `;
  
  return result.recordset[0];
};

// Insere uma nova nota
export const insertNota = async (nota) => {
  const result = await db.query`
    INSERT INTO Notas (AlunoID, DisciplinaID, ProfessorID, Bimestre, Nota)
    VALUES (${nota.alunoId}, ${nota.disciplinaId}, ${nota.professorId}, ${nota.bimestre}, ${nota.nota})
  `;
  
  return result.recordset;
};

// Atualiza uma nota existente por ID
export const updateNota = async (id, nota) => {
  const result = await db.query`
    UPDATE Notas
    SET AlunoID = ${nota.alunoId}, DisciplinaID = ${nota.disciplinaId}, ProfessorID = ${nota.professorId}, Bimestre = ${nota.bimestre}, Nota = ${nota.nota}
    WHERE ID = ${id}
  `;
  
  return result.recordset;
};

// Deleta uma nota por ID
export const deleteNota = async (id) => {
  const result = await db.query`
    DELETE FROM Notas WHERE ID = ${id}
  `;
  
  return result.recordset;
};
