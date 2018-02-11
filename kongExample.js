const kelda = require('kelda');
const kong = require('./kong.js');

const inf = kelda.baseInfrastructure();

const postgres = new kelda.Container({
  name: 'postgres',
  image: 'postgres:9.5',
  env: {
    POSTGRES_USER: 'kong',
    POSTGRES_DB: 'kong',
  },
});
postgres.deploy(inf);

const k = new kong.Kong(inf.workers.length, postgres);
k.enableMigrator();
k.exposePublic();
k.deploy(inf);
