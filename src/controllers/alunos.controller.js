import { 
  selectAlunos,
  selectAlunosByNome,
  selectAlunosById,
  insertAluno,
  updateAluno,
  deleteAluno
} from '../dao/alunos.dao.js';

// CRUD = Create, Read, Update, Delete

// Retorna todos os alunos com seus trabalhos relacionados, com paginação
export const getAlunos = async (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;

  const alunos = await selectAlunos(page, limit);

  response.status(200).json(alunos);
};

// Retorna alunos por nome com seus trabalhos relacionados, com paginação
export const getAlunosByNome = async (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  const nome = request.query.nome || '';

  const alunos = await selectAlunosByNome(nome, page, limit);

  response.status(200).json(alunos);
};

// Retorna um aluno específico por ID com seus trabalhos relacionados
export const getAlunoById = async (request, response) => {
  const id = request.params.id;
  const aluno = await selectAlunosById(id);

  response.status(200).json(aluno);
};

// Cria um novo aluno
export const postAluno = async (request, response) => {
  const aluno = request.body;

  await insertAluno(aluno);

  response.status(201).json(aluno); // Código 201 para criação bem-sucedida
};

// Atualiza um aluno existente por ID
export const putAluno = async (request, response) => { 
  const id = request.params.id;
  const aluno = request.body;

  await updateAluno(id, aluno);

  response.status(200).json(aluno);
};

// Deleta um aluno por ID
export const deleteAlunoById = async (request, response) => {
  const id = request.params.id;

  await deleteAluno(id);

  response.status(200).json({ message: `Aluno ${id} deletado com sucesso` });
};
