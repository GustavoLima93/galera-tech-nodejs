import db from '../database/db.js';

export const selectDisciplinas = async (page, limit) => { 
  const offset = (page - 1) * limit;
  const result = await db.query`SELECT * FROM Disciplinas ORDER BY ID OFFSET ${Number(offset)} ROWS
    FETCH NEXT ${Number(limit)} ROWS ONLY`;
  
  return result.recordset;
};


export const selectDisciplinasById = async (id) => {
  const result = await db.query`SELECT * FROM Disciplinas WHERE ID = ${id}`;
  return result.recordset[0];
};

// Seleciona disciplinas por nome (com busca aproximada e paginação)
export const selectDisciplinasByNome = async (nome, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT * FROM Disciplinas WHERE UPPER(Nome) 
    LIKE UPPER(${`%${nome}%`}) ORDER BY ID OFFSET ${Number(offset)} ROWS
    FETCH NEXT ${Number(limit)} ROWS ONLY`;
  
  return result.recordset;
};

// Insere uma nova disciplina
export const insertDisciplina = async (disciplina) => {
  const result = await db.query`
    INSERT INTO Disciplinas (Nome, ProfessorID) 
    VALUES (${disciplina.nome}, ${disciplina.professorId})
  `;
  
  return result.recordset;
};

// Atualiza uma disciplina por ID
export const updateDisciplina = async (id, disciplina) => {
  const result = await db.query`
    UPDATE Disciplinas 
    SET Nome = ${disciplina.nome}, ProfessorID = ${disciplina.professorId} 
    WHERE ID = ${id}
  `;
  
  return result.recordset;
};

// Deleta uma disciplina por ID
export const deleteDisciplina = async (id) => {
  const result = await db.query`
    DELETE FROM Disciplinas WHERE ID = ${id}
  `;
  return result.recordset;
};