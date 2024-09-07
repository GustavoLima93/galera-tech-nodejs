import { 
 selectDisciplinas,
 selectDisciplinasById,
 selectDisciplinasByNome,
 insertDisciplina,
 updateDisciplina,
 deleteDisciplina
} from '../dao/disciplina.dao.js';

export const getDisciplinas = async (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;

  const disciplinas = await selectDisciplinas(page, limit);

  response.status(200).json(disciplinas);
};

export const getDisciplinaById = async (request, response) => {
  const id = request.params.id;
  const disciplina = await selectDisciplinasById(id);
  response.status(200).json(disciplina);
};

// Retorna disciplinas por nome com paginação
export const getDisciplinasByNome = async (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  const nome = request.query.nome || '';

  const disciplinas = await selectDisciplinasByNome(nome, page, limit);

  response.status(200).json(disciplinas);
};

// Insere uma nova disciplina
export const postDisciplina = async (request, response) => {
  const disciplina = request.body;

  await insertDisciplina(disciplina);

  response.status(201).json(disciplina);
};

// Atualiza uma disciplina existente por ID
export const putDisciplina = async (request, response) => {
  const id = request.params.id;
  const disciplina = request.body;

  await updateDisciplina(id, disciplina);

  response.status(200).json(disciplina);
};

// Deleta uma disciplina por ID
export const deleteDisciplinaById = async (request, response) => {
  const id = request.params.id;

  await deleteDisciplina(id);

  response.status(200).json({ message: `Disciplina ${id} deletada com sucesso` });
};