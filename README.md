Edmodo API
----------

A Meteor library to interact with Edmodo API (ported from percolate:google-api).

# Install

```
meteor add classcraft:edmodo-api
```

# Usage

To call the library, use the `get()` and `post()` functions:

```
EdmodoApi.get('/your/api/path', options[, callback]);
```

If `callback` is provided (client or server), the call will be made **asynchronously**.

Available methods: `EdmodoApi.get`, `EdmodoApi.post`, `EdmodoApi.patch`, `EdmodoApi.put`, `EdmodoApi.delete`

`EdmodoApi` is a Microsoft Graph OAuth authentication wrapper around [`HTTP`](http://docs.meteor.com/#/full/http), so it takes the same arguments. For example, to pass a JSON body in `EdmodoApi.post`, use:

````javascript
EdmodoApi.post('/your/api/path', { data: jsonBody });
````

On the client, if you do not provide a callback, the library will return a [Q promise](https://github.com/kriskowal/q). On the server, it will run **synchronously**.

If the user's access token has expired, it will transparently call the `msGraphExchangeRefreshToken` method to get a new refresh token. To call this method manually (e.g. from other Google API packages), use `Meteor.call('exchangeRefreshToken'[, userId])`. You should first check that that the user's token has actually expired, though, since this method won't.

# Tokens

If you are running client side or in a method call, the package will automatically use the OAuth access token of the current user, and use the refresh token to refresh it if it's out of date (saving to the database also).

If you are running from a context without a `Meteor.user()`, you can pass `{user: X}` in the `options` argument to achieve this behaviour.