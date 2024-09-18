---
presentation:
  width: 1500
  height: 900
  theme: night.css
---



# Node JS, sua primeira API

## Instalar plugin REST Client

- Pasta projeto http, contem todas as chamadas http disponíveis 

## Arquitetura projeto explicada

### 1. **server.js**

- Esse é o arquivo principal que inicializa o servidor Express. Ele geralmente faz o seguinte:

- Configura o ExpressJS (instancia o app).
- Define middlewares globais, como body parsers (para lidar com requisições JSON ou URL-encoded).
- Importa as rotas a partir da pasta `routes`.
- Escuta em uma porta específica para começar a aceitar requisições HTTP.

- Exemplo básico do `server.js`:

```js
import express from 'express';

import router from './src/routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(3001, function c() {
  console.log('Server is running on port 3001');
});


```

### 2. **Pasta `routes`**

- Aqui ficam os arquivos que definem as rotas da aplicação, ou seja, os endpoints que respondem às requisições HTTP. Essas rotas geralmente chamam métodos do controller.

- Exemplo de um arquivo `routes/alunos.router.js`:

```js

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

```

- Aqui, estamos criando rotas e vinculando as ações ao `alunosController`.

### 3. **Pasta `controller`**

- O controller contém a lógica para processar as requisições e determinar o que deve acontecer. Ele coordena entre as rotas e a camada DAO (acesso aos dados).

Exemplo de um arquivo `controller/alunos.controller.js`:

```js
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

```

- O controller chama o DAO para manipular os dados e retorna as respostas para as rotas.

### 4. **Pasta `dao`**

- DAO (Data Access Object) é a camada que interage diretamente com o banco de dados. Ela contém a lógica de acesso e manipulação dos dados. O DAO geralmente faz consultas, inserções, atualizações e deleções no banco de dados.

- Exemplo de um arquivo `dao/alunos.dao.js`:

```js
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

```

- O DAO pode interagir com o banco de dados diretamente ou por meio de uma biblioteca, como o `sequelize` ou `mongoose`, mas nesse caso estamos utilizando o driver do mssql.

### 5. **Pasta `database`**

- Essa pasta contém a configuração e a conexão com o banco de dados. Dependendo do que você estiver usando (MySQL, MongoDB, MSSQL, etc.), ela contém os scripts de conexão e configuração da base de dados.

Exemplo de um arquivo `database/db.js`:

```js
import sql from 'mssql';

const config = {
  user: "", // Database username
  password: "", // Database password
  server: "", // Server IP address
  database: "", // Database name
  options: {
    encrypt: false, 
  },
}

const db = sql.connect(config, (error) => {
  if (error) {
    throw error;
  }

  console.log('Conectado ao banco de dados');
});

export default db;

```
<!-- slide -->

<!-- slide -->

## < O que é Back e Front end ?>

![back & front](./assets/img/relogio.png)

<!-- slide -->

## < Front end />

- O front end é a parte visível e interativa de um aplicativo ou website com a qual os usuários interagem diretamente.

  - HTML: Estrutura do conteúdo
  - CSS: Estilização e layout
  - JavaScript: Interatividade e dinamicidade

<!-- slide -->

## < Back end />

- O back end é a parte do aplicativo ou website que gerencia a lógica de negócios, interações com banco de dados, autenticação, e processamento de dados.

  - Servidor: Máquina ou ambiente que executa o software de back end.
  - Banco de Dados: Armazena dados necessários para o aplicativo.
  - APIs: Pontos de interação entre front end e back end.

<!-- slide -->

## < NodeJS ?>

- Node.js é um ambiente de execução JavaScript do lado do servidor, baseado no motor V8 do Google Chrome. Ele permite que você execute código JavaScript no servidor, fora do navegador.

<!-- slide -->

## < APIs />

- Definição: API é uma interface que permite a comunicação entre diferentes softwares.

- Tipos: Incluem APIs Web, de bibliotecas e de sistemas operacionais.

- Exemplos: Usadas em serviços de mapas, redes sociais e pagamentos online.

- Benefícios: Promovem reutilização de funcionalidades, interoperabilidade e escalabilidade.

<!-- slide -->

## < HTTP />

- Definição: HTTP é o protocolo de comunicação para a web.

- Métodos: Inclui métodos como GET, POST, PUT e DELETE.

- Formato de Dados: Usa texto para transmitir dados entre cliente e servidor.

- Benefícios: Simplicidade, extensibilidade e compatibilidade com a web.

<!-- slide -->

## < Comunicação Client & Servidor />

- ![client & servidor](./assets/img/cliente-servidor.png)

<!-- slide -->

## < Métodos HTTP />

- GET: Recupera dados do servidor.

- POST: Envia dados ao servidor para processamento.

- PUT: Atualiza dados existentes no servidor.

- DELETE: Remove dados do servidor.

<!-- slide -->

## < Requisição HTTP />

- Método HTTP: Indica a ação desejada pelo cliente, como GET, POST, PUT, DELETE, entre outros.
  
- URL: Uniform Resource Locator, especifica o recurso alvo da requisição.
  
- Headers da Requisição: Campos chave-valor que passam informações adicionais sobre a requisição, como Content-Type e Authorization.
  
- Corpo da Requisição: (Opcional) Contém os dados enviados pelo cliente ao servidor, geralmente usado em métodos POST e PUT.
  
- Status da Resposta: Código numérico que indica o resultado da requisição, como 200 (OK), 404 (Not Found), 500 (Internal Server Error).
  
- Headers da Resposta: Campos chave-valor que fornecem informações sobre a resposta, como Content-Length e Set-Cookie.
  
<!-- slide -->

## < JSON />

- JSON (Javascript Object Notation) é um formato leve de troca de dados.

- Usa chave-valor em notação de objeto.

- Amplamente suportado em várias linguagens.

- Comum em APIs para transmitir dados.

<!-- slide -->

## < Instalação e configuração do NVM />

- Nvm é é um gerenciador de versões para o NODEJS
  
- É possível ser instalado em Windows, Linux e MacOS

<!-- slide -->

## < Bibliotecas e frameworks />

- Bibliotecas:

  - Conjunto de funções e rotinas reutilizáveis.
  - Oferecem funcionalidades específicas para facilitar o desenvolvimento.
  - São integradas ao código conforme a necessidade.

- Frameworks:

  - Estrutura de suporte para desenvolvimento de software.
  - Define a arquitetura e fluxo de trabalho do projeto.
  - Fornece uma base sólida com convenções, ferramentas e componentes pré-definidos.

<!-- slide -->

## < Express />

- Express é um framework minimalista e flexível para criar aplicativos web com Node.js. Ele oferece um conjunto robusto de funcionalidades tanto para aplicativos web quanto móveis.

- Com diversos métodos utilitários HTTP e middleware disponíveis, você pode criar uma API robusta de forma rápida e fácil.

<!-- slide -->

## < Express Routes />

- O roteamento no Express é a forma como um aplicativo responde a solicitações dos clientes para determinados endereços (URIs) usando métodos HTTP específicos (como GET, POST, etc.).

- Cada rota no Express pode ter uma ou mais funções que são executadas quando essa rota é acessada.

<!-- slide -->

## < Estrutura Básica de uma Função de Middleware />

- O método HTTP ao qual a função de middleware é aplicada.
  
- O caminho (rota) ao qual a função de middleware é aplicada.
  
- A função de middleware.
  
- Argumento de callback para a função de middleware, geralmente chamado de next.
  
- Argumento de resposta HTTP, chamado de res.
  
- Argumento de solicitação HTTP, chamado de req.
