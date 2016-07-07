Package.describe({
  name: 'classcraft:edmodo-api',
  summary: "A Meteor library to interact with Edmodo API (ported from percolate:google-api)",
  version: '1.0.0',
  git: 'https://github.com/classcraft/edmodo-api'
});

Package.on_use(function (api, where) {
  if (api.versionsFrom) {
    api.versionsFrom('0.9.0');
    api.use(['http', 'livedata', 'mrt:q@1.0.1', 'accounts-base', 'underscore']);
  } else {
    api.use(['http', 'livedata', 'q', 'accounts-base', 'underscore']);
  }

  api.add_files(['utils.js', 'edmodo-api-async.js'], ['client', 'server']);
  api.add_files(['edmodo-api-methods.js'], ['server']);

  api.export('EdmodoApi', ['client', 'server']);
});