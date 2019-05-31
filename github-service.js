// load deps
const axios = require('axios');

// load config
const config = require('./config');

// bundle service
module.exports = {
  getFollowers: getFollowersPromise,
};

// define promise to get follower tree
function getFollowersPromise(user, level=0) {
  return new Promise(function(resolve, reject) {
    // instantiate tree
    const followerTree = {};
    // instantiate queue array
    const queue = [];
    // increment level
    level++;
    // query followers from api
    axios.get(`https://api.github.com/users/${ user }/followers`, {
      auth: config.auth,
    })
    // then
    .then(function (response) {
      // for each of the first 5 followers
      response.data.slice(0, config.maxFollowers).forEach((follower) => {
        // if level is less than or equal to the maxLevels setting
        if (level <= config.maxLevels) {
          // queue a promise to get the subtree, then mount a follower and their subtree
          queue.push(getFollowersPromise(follower.login, level).then((subtree) => { followerTree[follower.login] = subtree; }));
        }
        // else
        else {
          // mount an empty follower
          followerTree[follower.login] = null;
        }
      });
    })
    // or catch error
    .catch((error) => {
      // and throw it
      reject(error);
    })
    // then finally
    .then(() => {
      // run the queue
      Promise.all(queue).then(() => {
        // then return the tree
        resolve(followerTree);
      });
    });
  });
};
