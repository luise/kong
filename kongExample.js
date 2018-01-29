const kelda = require('kelda');
const kong = require('./kong.js');

const inf = kelda.baseInfrastructure();

const workerVMs = inf.machines.filter(machine => machine.role === 'Worker');

const postgres = new kelda.Container('postgres', 'postgres:9.5', {
  env: {
    POSTGRES_USER: 'kong',
    POSTGRES_DB: 'kong',
  },
});
postgres.deploy(inf);

const k = new kong.Kong(workerVMs.length, postgres);
k.enableMigrator();
k.exposePublic();
k.deploy(inf);
