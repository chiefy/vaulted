var
  convict = require('convict'),

  conf = convict({
    env: {
      doc: 'Application environment',
      format: ['prod', 'stage', 'dev', 'test'],
      default: 'dev',
      env: "NODE_ENV"
    }
  }),

  env = conf.get('env');

conf.loadFile('./' + env + '.json');
conf.validate();

module.exports = conf;
