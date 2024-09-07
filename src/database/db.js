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