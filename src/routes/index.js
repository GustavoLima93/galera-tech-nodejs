import { Router } from 'express';

import professoresRouter from './professores.router.js';
import disciplinaRouter from './disciplina.router.js';
import trabalhosRouter from './trabalhos.router.js';
import alunosRouter from './alunos.router.js';
import notasRouter from './notas.router.js';

const router = Router();

router.use(professoresRouter);
router.use(disciplinaRouter);
router.use(trabalhosRouter);
router.use(alunosRouter);
router.use(notasRouter);

export default router;