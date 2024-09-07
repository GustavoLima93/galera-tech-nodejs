import { Router } from 'express';

import { 
  getDisciplinas,
  getDisciplinaById,
  getDisciplinasByNome,
  postDisciplina,
  putDisciplina,
  deleteDisciplinaById
} from '../controllers/disciplinas.controller.js';

const router = Router();

// Rota para obter todas as disciplinas com paginação
router.get('/disciplinas', getDisciplinas);

// Rota para obter disciplinas por nome com paginação
router.get('/disciplinas/nome', getDisciplinasByNome);

// Rota para obter uma disciplina por ID
router.get('/disciplinas/:id', getDisciplinaById);

// Rota para inserir uma nova disciplina
router.post('/disciplinas', postDisciplina);

// Rota para atualizar uma disciplina existente
router.put('/disciplinas/:id', putDisciplina);

// Rota para deletar uma disciplina por ID
router.delete('/disciplinas/:id', deleteDisciplinaById);

export default router;
