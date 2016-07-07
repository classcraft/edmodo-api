Meteor.methods({
  edmodoApiExchangeRefreshToken: function(userId) {
    this.unblock();

    if (this.connection) {
      if (this.userId) {
        userId = this.userId;
      } else {
        throw new Meteor.Error(403, "Must be signed in to use Edmodo API.");
      }
    }

    var user;
    if (userId && Meteor.isServer) {
      user = Meteor.users.findOne({_id: userId});
    } else {
      user = Meteor.user();
    }

    var config = Accounts.loginServiceConfiguration.findOne({service: "edmodo"});
    if (! config)
      throw new Meteor.Error(500, "Edmodo service not configured.");

    if (! user.services || ! user.services.edmodo || ! user.services.edmodo.refreshToken)
      throw new Meteor.Error(500, "Refresh token not found.");

    try {
      var result = Meteor.http.call("POST",
        "https://api.edmodo.com/oauth/token",
        {
          params: {
            'client_id': config.clientId,
            'client_secret': config.clientSecret,
            'refresh_token': user.services.edmodo.refreshToken,
            'grant_type': 'refresh_token',
            'redirect_uri': config.redirectURI
          }
      });
    } catch (e) {
      var code = e.response ? e.response.statusCode : 500;
      throw new Meteor.Error(code, 'Unable to exchange Edmodo refresh token.', e.response)
    }

    if (result.statusCode === 200) {
      Meteor.users.update(user._id, {
        '$set': {
          'services.edmodo.accessToken': result.data.access_token,
          'services.edmodo.refreshToken': result.data.refresh_token,
          'services.edmodo.expiresAt': (+new Date) + (1000 * result.data.expires_in),
        }
      });

      return result.data;
    } else {
      throw new Meteor.Error(result.statusCode, 'Unable to exchange Edmodo refresh token.', result);
    }
  }
});