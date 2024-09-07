import { Router } from 'express';

import { 
  getTrabalhos,
  getTrabalhosByNome,
  getTrabalhoById,
  postTrabalho,
  putTrabalho,
  deleteTrabalhoById
} from '../controllers/trabalhos.controller.js';

const router = Router();

// Rota para listar todos os trabalhos com paginação
router.get('/trabalhos', getTrabalhos);

// Rota para buscar trabalhos por nome com paginação
router.get('/trabalhos/nome', getTrabalhosByNome);

// Rota para buscar um trabalho específico por ID
router.get('/trabalhos/:id', getTrabalhoById);

// Rota para criar um novo trabalho
router.post('/trabalhos', postTrabalho);

// Rota para atualizar um trabalho específico por ID
router.put('/trabalhos/:id', putTrabalho);

// Rota para deletar um trabalho específico por ID
router.delete('/trabalhos/:id', deleteTrabalhoById);

export default router;
