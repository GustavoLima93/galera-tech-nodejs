import db from '../database/db.js';

// Seleciona todos os alunos com seus trabalhos relacionados, usando paginação
export const selectAlunos = async (page, limit) => {
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT A.ID, A.Nome, A.Email, T.ID AS TrabalhoID, T.Nome AS TrabalhoNome 
    FROM Alunos A
    LEFT JOIN Alunos_Trabalhos TA ON A.ID = TA.AlunoID
    LEFT JOIN Trabalhos T ON TA.TrabalhoID = T.ID
    ORDER BY A.ID OFFSET ${Number(offset)} ROWS 
    FETCH NEXT ${Number(limit)} ROWS ONLY`;

  // Transformar o resultado em uma estrutura de alunos com seus trabalhos
  const alunosMap = new Map();
  
  result.recordset.forEach(row => {
    const aluno = alunosMap.get(row.ID) || {
      id: row.ID,
      nome: row.Nome,
      email: row.Email,
      trabalhos: []
    };
    
    if (row.TrabalhoID) {
      aluno.trabalhos.push({
        id: row.TrabalhoID,
        nome: row.TrabalhoNome
      });
    }
    
    alunosMap.set(row.ID, aluno);
  });

  return Array.from(alunosMap.values());
};

// Seleciona alunos por nome e seus trabalhos relacionados, usando paginação
export const selectAlunosByNome = async (nome, page, limit) => {
  const offset = (page - 1) * limit;
  const result = await db.query`
    SELECT A.ID, A.Nome, A.Email, T.ID AS TrabalhoID, T.Nome AS TrabalhoNome 
    FROM Alunos A
    LEFT JOIN Alunos_Trabalhos TA ON A.ID = TA.AlunoID
    LEFT JOIN Trabalhos T ON TA.TrabalhoID = T.ID
    WHERE UPPER(A.Nome) LIKE UPPER(${`%${nome}%`})
    ORDER BY A.ID OFFSET ${Number(offset)} ROWS 
    FETCH NEXT ${Number(limit)} ROWS ONLY`;

  // Transformar o resultado em uma estrutura de alunos com seus trabalhos
  const alunosMap = new Map();
  
  result.recordset.forEach(row => {
    const aluno = alunosMap.get(row.ID) || {
      id: row.ID,
      nome: row.Nome,
      email: row.Email,
      trabalhos: []
    };
    
    if (row.TrabalhoID) {
      aluno.trabalhos.push({
        id: row.TrabalhoID,
        nome: row.TrabalhoNome
      });
    }
    
    alunosMap.set(row.ID, aluno);
  });

  return Array.from(alunosMap.values());
};

// Seleciona um aluno por ID e seus trabalhos relacionados
export const selectAlunosById = async (id) => {
  const result = await db.query`
    SELECT A.ID, A.Nome, A.Email, T.ID AS TrabalhoID, T.Nome AS TrabalhoNome 
    FROM Alunos A
    LEFT JOIN Alunos_Trabalhos TA ON A.ID = TA.AlunoID
    LEFT JOIN Trabalhos T ON TA.TrabalhoID = T.ID
    WHERE A.ID = ${id}`;

  if (result.recordset.length === 0) {
    return null; // Aluno não encontrado
  }

  const aluno = {
    id: result.recordset[0].ID,
    nome: result.recordset[0].Nome,
    email: result.recordset[0].Email,
    trabalhos: []
  };

  result.recordset.forEach(row => {
    if (row.TrabalhoID) {
      aluno.trabalhos.push({
        id: row.TrabalhoID,
        nome: row.TrabalhoNome
      });
    }
  });

  return aluno;
};

// Insere um novo aluno
export const insertAluno = async (aluno) => {
  const result = await db.query`
    INSERT INTO Alunos (ID, Nome, Email) VALUES (${aluno.nome}, ${aluno.email})
  `;
  return result.recordset;
};

// Atualiza um aluno existente
export const updateAluno = async (id, aluno) => {
  const result = await db.query`
    UPDATE Alunos SET Nome = ${aluno.nome}, Email = ${aluno.email} WHERE ID = ${id}
  `;

  return result.recordset;
};

// Deleta um aluno por ID
export const deleteAluno = async (id) => {
  const result = await db.query`
    DELETE FROM Alunos WHERE ID = ${id}
  `;

  return result.recordset;
};
