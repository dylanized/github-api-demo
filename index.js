// load deps
const express = require('express');

// load config
const config = require('./config');

// load github service
githubService = require('./github-service');

// instantiate api
const api = express();

// register followers endpoint and define async handler
api.get('/followers/:id', function (req, res) {
  // log status
  console.log(`Querying ${ req.params.id }...`);
  // get follower tree
  githubService.getFollowers(req.params.id)
  // then
  .then((followerTree) => {
    // log result
    console.log(followerTree);
    // and send it
    res.send(followerTree);
  })
  // or catch error
  .catch((err) => {
    // log it
    console.log(err);
    // and send it
    res.send(err);
  });
});

// launch app
api.listen(config.port, () => console.log(`API listening on port ${ config.port }`));
