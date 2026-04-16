# Cri's version of GSuite-Wrapper

Winging it till it works. Vamonos!

the previous structure of the Gsuite-Wrapper is: 
- .circleci
- .github
- .husky
- .nyc_ouput
- coverage
- docker
-- docker-compose.dev.yml
-- docker-compose.yml
-- Dockerfile

- lib
-- config
-- util
-- google-suite.js
-- gsuite-wrapper.js
-- middlewares.js
-- redis.js
-- run.js
-- server.js
-- WIP-import.js

- node_modules
- test

- .dockerignore
- .editorconfig
- .eslintrc.json
- .gitignore
- .hadolint.yaml
- .realeaserc
- .yamlint.yml
- aalllll.log
- CHANGELOG.md
- commitlint.config.js
- contributors.txt
- LICENSE.md
- note-APIscope
- package-lock.json
- package.json
- README.md


# Testing
Due to Google's propagation delay with an instance creation (e.g. of an account) I suggest testing individual CRUD operations instead of running them all together. 
This means avoid doing this: 
``` js
// WRONG TEST! 
npx mocha test/accounts.test.js 
```
and do this instead:
```js
// BETTER TESTING
npx mocha test/accounts.test.js --grep "Should add an account"
// wait...
npx mocha test/accounts.test.js --grep "Should get an account"
// wait...
npx mocha test/accounts.test.js --grep "Should delete an account"

```