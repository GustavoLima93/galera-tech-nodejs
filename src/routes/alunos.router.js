import { Router } from 'express';

import { 
  getAlunos,
  getAlunosByNome,
  getAlunoById,
  postAluno,
  putAluno,
  deleteAlunoById
} from '../controllers/alunos.controller.js';

const router = Router();

// Rota para listar todos os alunos com paginação e trabalhos relacionados
router.get('/alunos', getAlunos);

// Rota para buscar alunos por nome com paginação e trabalhos relacionados
router.get('/alunos/nome', getAlunosByNome);

// Rota para buscar um aluno específico por ID com trabalhos relacionados
router.get('/alunos/:id', getAlunoById);

// Rota para criar um novo aluno
router.post('/alunos', postAluno);

// Rota para atualizar um aluno específico por ID
router.put('/alunos/:id', putAluno);

// Rota para deletar um aluno específico por ID
router.delete('/alunos/:id', deleteAlunoById);

export default router;
