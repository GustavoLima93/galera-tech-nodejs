import db from '../database/db.js';

// Seleciona todos os trabalhos com paginação e inclui os alunos relacionados
export const selectTrabalhos = async (page, limit) => { 
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT T.ID, T.Nome, T.Descricao, T.DisciplinaID, A.ID AS AlunoID, A.Nome AS AlunoNome 
    FROM Trabalhos T
    INNER JOIN Alunos_Trabalhos TA ON T.ID = TA.TrabalhoID
    INNER JOIN Alunos A ON TA.AlunoID = A.ID
    ORDER BY T.ID OFFSET ${Number(offset)} ROWS FETCH NEXT ${Number(limit)} ROWS ONLY
  `;
  
  return result.recordset;
};

// Seleciona trabalhos por nome com paginação e inclui os alunos relacionados
export const selectTrabalhosByNome = async (nome, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT T.ID, T.Nome, T.Descricao, T.DisciplinaID, A.ID AS AlunoID, A.Nome AS AlunoNome 
    FROM Trabalhos T
    INNER JOIN Alunos_Trabalhos TA ON T.ID = TA.TrabalhoID
    INNER JOIN Alunos A ON TA.AlunoID = A.ID
    WHERE UPPER(T.Nome) LIKE UPPER(${`%${nome}%`})
    ORDER BY T.ID OFFSET ${Number(offset)} ROWS FETCH NEXT ${Number(limit)} ROWS ONLY
  `;
  
  return result.recordset;
};

// Seleciona um trabalho por ID e inclui os alunos relacionados
export const selectTrabalhosById = async (id) => {
  const result = await db.query`
    SELECT T.ID, T.Nome, T.Descricao, T.DisciplinaID, A.ID AS AlunoID, A.Nome AS AlunoNome 
    FROM Trabalhos T
    INNER JOIN Alunos_Trabalhos TA ON T.ID = TA.TrabalhoID
    INNER JOIN Alunos A ON TA.AlunoID = A.ID
    WHERE T.ID = ${id}
  `;
  
  return result.recordset;
};

// Insere um novo trabalho
export const insertTrabalho = async (trabalho) => {
  const result = await db.query`
    INSERT INTO Trabalhos (Nome, Descricao, DisciplinaID) 
    VALUES (${trabalho.nome}, ${trabalho.descricao}, ${trabalho.disciplinaId})
  `;
  
  return result.recordset;
};

// Atualiza um trabalho por ID
export const updateTrabalho = async (id, trabalho) => {
  const result = await db.query`
    UPDATE Trabalhos 
    SET Nome = ${trabalho.nome}, Descricao = ${trabalho.descricao}, DisciplinaID = ${trabalho.disciplinaId}
    WHERE ID = ${id}
  `;
  
  return result.recordset;
};

// Deleta um trabalho por ID
export const deleteTrabalho = async (id) => {
  const result = await db.query`
    DELETE FROM Trabalhos WHERE ID = ${id}
  `;
  
  return result.recordset;
};
