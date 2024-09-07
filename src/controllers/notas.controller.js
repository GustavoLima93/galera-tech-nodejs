import { 
  selectNotas,
  selectNotasByAluno,
  selectNotasByDisciplina,
  selectNotasByProfessor,
  selectNotaById,
  insertNota,
  updateNota,
  deleteNota
} from '../dao/notas.dao.js';

//CRUD = Create, Read, Update, Delete

export const getNotas = async (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;

  const notas = await selectNotas(page, limit);

  response.status(200).json(notas);
};

export const getNotasByAluno = async (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  const alunoId = request.query.alunoId;

  if (!alunoId) {
    return response.status(400).json({ message: 'Parâmetro alunoId é obrigatório' });
  }

  const notas = await selectNotasByAluno(alunoId, page, limit);

  response.status(200).json(notas);
};

export const getNotasByDisciplina = async (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  const disciplinaId = request.query.disciplinaId;

  if (!disciplinaId) {
    return response.status(400).json({ message: 'Parâmetro disciplinaId é obrigatório' });
  }

  const notas = await selectNotasByDisciplina(disciplinaId, page, limit);

  response.status(200).json(notas);
};

export const getNotasByProfessor = async (request, response) => {
  const page = request.query.page || 1;
  const limit = request.query.limit || 10;
  const professorId = request.query.professorId;

  if (!professorId) {
    return response.status(400).json({ message: 'Parâmetro professorId é obrigatório' });
  }

  const notas = await selectNotasByProfessor(professorId, page, limit);

  response.status(200).json(notas);
};

export const getNotaById = async (request, response) => {
  const id = request.params.id;
  const nota = await selectNotaById(id);

  if (!nota) {
    return response.status(404).json({ message: `Nota com ID ${id} não encontrada` });
  }

  response.status(200).json(nota);
};

export const postNota = async (request, response) => {
  const nota = request.body;

  if (!nota.alunoId || !nota.disciplinaId || !nota.professorId || !nota.bimestre || !nota.nota) {
    return response.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  await insertNota(nota);

  response.status(201).json(nota);
};

export const putNota = async (request, response) => { 
  const id = request.params.id;
  const nota = request.body;

  if (!nota.alunoId || !nota.disciplinaId || !nota.professorId || !nota.bimestre || !nota.nota) {
    return response.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  await updateNota(id, nota);

  response.status(200).json(nota);
};

export const deleteNotaById = async (request, response) => {
  const id = request.params.id;

  const nota = await selectNotaById(id);
  if (!nota) {
    return response.status(404).json({ message: `Nota com ID ${id} não encontrada` });
  }

  await deleteNota(id);

  response.status(200).json({ message: `Nota ${id} deletada com sucesso` });
};
