import { Router } from 'express';

import { 
  getNotas,
  getNotasByAluno,
  getNotasByDisciplina,
  getNotasByProfessor,
  getNotaById,
  postNota,
  putNota,
  deleteNotaById
} from '../controllers/notas.controller.js';

const router = Router();

router.get('/notas', getNotas);
router.get('/notas/aluno', getNotasByAluno);
router.get('/notas/disciplina', getNotasByDisciplina);
router.get('/notas/professor', getNotasByProfessor);
router.get('/notas/:id', getNotaById);
router.post('/notas', postNota);
router.put('/notas/:id', putNota);
router.delete('/notas/:id', deleteNotaById);

export default router;
