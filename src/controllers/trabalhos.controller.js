import { 
  selectTrabalhos,
  selectTrabalhosByNome,
  selectTrabalhosById,
  insertTrabalho,
  updateTrabalho,
  deleteTrabalho
} from '../dao/trabalhos.dao.js';

// CRUD = Create, Read, Update, Delete

// Retorna todos os trabalhos com paginação
export const getTrabalhos = async (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;

  const trabalhos = await selectTrabalhos(page, limit);

  response.status(200).json(trabalhos);
};

// Retorna trabalhos por nome com paginação
export const getTrabalhosByNome = async (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  const nome = request.query.nome || '';

  const trabalhos = await selectTrabalhosByNome(nome, page, limit);

  response.status(201).json(trabalhos);
};

// Retorna um trabalho por ID
export const getTrabalhoById = async (request, response) => {
  const id = request.params.id;
  const trabalho = await selectTrabalhosById(id);

  response.status(200).json(trabalho);
};

// Cria um novo trabalho
export const postTrabalho = async (request, response) => {
  const trabalho = request.body;

  await insertTrabalho(trabalho);

  response.status(200).json(trabalho);
};

// Atualiza um trabalho por ID
export const putTrabalho = async (request, response) => {
  const id = request.params.id;
  const trabalho = request.body;

  await updateTrabalho(id, trabalho);

  response.status(200).json(trabalho);
};

// Deleta um trabalho por ID
export const deleteTrabalhoById = async (request, response) => {
  const id = request.params.id;

  await deleteTrabalho(id);

  response.status(200).json({ message: `Trabalho ${id} deletado com sucesso` });
};
