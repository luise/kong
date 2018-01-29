const kelda = require('kelda');

const listenPort = 80;
const listenSSLPort = 443;

const adminListenPort = 8001;
const adminListenSSLPort = 8444;

class Kong {
  constructor(count, postgres) {
    this.postgres = postgres;
    this.kongEnv = {
      KONG_DATABASE: 'postgres',
      KONG_PROXY_LISTEN: `0.0.0.0:${listenPort}`,
      KONG_PROXY_LISTEN_SSL: `0.0.0.0:${listenSSLPort}`,
      KONG_ADMIN_LISTEN: `0.0.0.0:${adminListenPort}`,
      KONG_ADMIN_LISTEN_SSL: `0.0.0.0:${adminListenSSLPort}`,
      KONG_PG_HOST: postgres.getHostname(),
    };

    this.gateways = [];
    for (let i = 0; i < count; i += 1) {
      this.gateways.push(new kelda.Container('kong', 'kong',
        { env: this.kongEnv }));
    }

    kelda.allowTraffic(this.gateways, postgres, 5432);
  }

  // XXX: This is somewhat of a hack.  The first time that a postgres
  // database is used `kong migrations up` needs to be executed exactly once
  // (by exactly one node).  In a production deployment, this should probably
  // be done by a human, but for example deployments this is fine for now.
  enableMigrator() {
    this.migrator = new kelda.Container('migrator', 'kong', {
      command: ['sh', '-c', 'kong migrations up && tail -f /dev/null'],
      env: this.kongEnv,
    });

    kelda.allowTraffic(this.migrator, this.postgres, 5432);
  }

  deploy(deployment) {
    if (typeof this.migrator !== 'undefined') {
      this.migrator.deploy(deployment);
    }
    this.gateways.forEach(gateway => gateway.deploy(deployment));
  }

  exposePublic() {
    kelda.allowTraffic(kelda.publicInternet, this.gateways, listenPort);
    kelda.allowTraffic(kelda.publicInternet, this.gateways, listenSSLPort);
    kelda.allowTraffic(kelda.publicInternet, this.gateways, adminListenPort);
    kelda.allowTraffic(kelda.publicInternet, this.gateways,
      adminListenSSLPort);
  }
}

exports.Kong = Kong;
