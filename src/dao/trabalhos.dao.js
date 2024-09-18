import db from '../database/db.js';

// Seleciona todos os trabalhos com paginação e inclui os alunos relacionados
export const selectTrabalhos = async (page, limit) => { 
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT T.ID, T.Nome, T.Descricao, T.DisciplinaID, A.ID AS AlunoID, A.Nome AS AlunoNome 
    FROM Trabalhos T
    LEFT JOIN Alunos_Trabalhos TA ON T.ID = TA.TrabalhoID
    LEFT JOIN Alunos A ON TA.AlunoID = A.ID
    ORDER BY T.ID OFFSET ${Number(offset)} ROWS FETCH NEXT ${Number(limit)} ROWS ONLY
  `;
  
  // Mapeia os trabalhos com seus alunos relacionados
  const trabalhosMap = new Map();
  
  result.recordset.forEach(row => {
    const trabalho = trabalhosMap.get(row.ID) || {
      id: row.ID,
      nome: row.Nome,
      descricao: row.Descricao,
      disciplinaId: row.DisciplinaID,
      alunos: []
    };
    
    if (row.AlunoID) {
      trabalho.alunos.push({
        id: row.AlunoID,
        nome: row.AlunoNome
      });
    }
    
    trabalhosMap.set(row.ID, trabalho);
  });

  return Array.from(trabalhosMap.values());
};

// Seleciona trabalhos por nome com paginação e inclui os alunos relacionados
export const selectTrabalhosByNome = async (nome, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT T.ID, T.Nome, T.Descricao, T.DisciplinaID, A.ID AS AlunoID, A.Nome AS AlunoNome 
    FROM Trabalhos T
    LEFT JOIN Alunos_Trabalhos TA ON T.ID = TA.TrabalhoID
    LEFT JOIN Alunos A ON TA.AlunoID = A.ID
    WHERE UPPER(T.Nome) LIKE UPPER(${`%${nome}%`})
    ORDER BY T.ID OFFSET ${Number(offset)} ROWS FETCH NEXT ${Number(limit)} ROWS ONLY
  `;
  
  // Mapeia os trabalhos com seus alunos relacionados
  const trabalhosMap = new Map();
  
  result.recordset.forEach(row => {
    const trabalho = trabalhosMap.get(row.ID) || {
      id: row.ID,
      nome: row.Nome,
      descricao: row.Descricao,
      disciplinaId: row.DisciplinaID,
      alunos: []
    };
    
    if (row.AlunoID) {
      trabalho.alunos.push({
        id: row.AlunoID,
        nome: row.AlunoNome
      });
    }
    
    trabalhosMap.set(row.ID, trabalho);
  });

  return Array.from(trabalhosMap.values());
};

// Seleciona um trabalho por ID e inclui os alunos relacionados
export const selectTrabalhosById = async (id) => {
  const result = await db.query`
    SELECT T.ID, T.Nome, T.Descricao, T.DisciplinaID, A.ID AS AlunoID, A.Nome AS AlunoNome 
    FROM Trabalhos T
    LEFT JOIN Alunos_Trabalhos TA ON T.ID = TA.TrabalhoID
    LEFT JOIN Alunos A ON TA.AlunoID = A.ID
    WHERE T.ID = ${id}
  `;

  if (result.recordset.length === 0) {
    return null; // Trabalho não encontrado
  }

  const trabalho = {
    id: result.recordset[0].ID,
    nome: result.recordset[0].Nome,
    descricao: result.recordset[0].Descricao,
    disciplinaId: result.recordset[0].DisciplinaID,
    alunos: []
  };

  result.recordset.forEach(row => {
    if (row.AlunoID) {
      trabalho.alunos.push({
        id: row.AlunoID,
        nome: row.AlunoNome
      });
    }
  });

  return trabalho;
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
