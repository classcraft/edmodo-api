EdmodoApi = {
  _host: 'https://api.edmodo.com',

  _callAndRefresh: function(method, path, options, callback) {
    var self = this;
    options = options || {};

    self._call(method, path, options,
      Meteor.bindEnvironment(function(error, result) {
        if (error && error.response && error.response.statusCode == 401) {
          return self._refresh(options.user, function(error) {
            if (error)
              return callback(error);

            if (options.user)
              options.user = Meteor.users.findOne(options.user._id);

            self._call(method, path, options, callback);
          });
        } else {
          callback(error, result);
        }
    }, 'Edmodo API callAndRefresh'));
  },

  _call: function(method, path, options, callback) {
    options = _.extend({}, options)
    var user = options.user || Meteor.user();
    delete options.user;

    if (user && user.services && user.services.edmodo &&
        user.services.edmodo.accessToken) {
      options.headers = options.headers || {};
      options.headers.Authorization = 'Bearer ' + user.services.edmodo.accessToken;

      HTTP.call(method, this._host + '/' + path, options, function(error, result) {
        callback(error, result && result.data);
      });
    } else {
      callback(new Meteor.Error(403, "Auth token not found." +
        "Connect your Edmodo account"));
    }
  },

  _refresh: function(user, callback) {
    Meteor.call('edmodoApiExchangeRefreshToken', user && user._id, function(error, result) {
      callback(error, result && result.access_token)
    });
  }
}

// setup HTTP verbs
httpVerbs = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
_.each(httpVerbs, function(verb) {
  EdmodoApi[verb.toLowerCase()] = wrapAsync(function(path, options, callback) {
    if (_.isFunction(options)) {
      callback = options;
      options = {};
    }

    return this._callAndRefresh(verb, path, options, callback);
  })
});
