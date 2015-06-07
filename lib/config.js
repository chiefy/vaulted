
module.exports = config;

function config(config_file) {
  var convict, conf, env;

  convict = require('convict');

  conf = convict({
    env: {
      doc: 'Application environment',
      format: ['prod', 'stage', 'dev', 'test'],
      default: 'dev',
      env: "NODE_ENV"
    },
    port: {
      doc: 'Port to run service',
      format: "integer",
      default: 3000,
      env: "PORT"
    },
    prefix: {
      doc: "API prefix / version",
      format: "string",
      default: "v1",
      env: "API_"
    }
  });

  env = conf.get('env');

  conf.loadFile('../config' + env + '.json');
  conf.validate();

  return conf;
}

