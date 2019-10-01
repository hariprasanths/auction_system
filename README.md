# Auction System

A real time auction-system built using socket programming 

### Tech

* [node.js]
* [Express]
* [React]
* [Webpack]
* [Sequelize]
* [jQuery] 

### Usage

PPL Finals requires [Node.js](https://nodejs.org/) v6.11.5 LTS to run.

Install the dependencies and devDependencies and start the server.

Install [sequelize-cli] , the [Sequelize] Command Line Interface (CLI)
```sh
npm install -g sequelize-cli
```

For development environments...

```sh
$ npm install
$ bower install
$ npm run watch
```

For production environments...

```sh
$ npm install
$ bower install
$ npm run prod
```
If you bower is not installed already, install it using
```sh
npm install -g bower
```

Create a /config/config.json file for [Sequelize] by copying the contents of [/config/config.json.example](config/config.json.example) and replacing the necessesary fields
```
{
  "development": {
    "username": "root",
    "password": your mysql password,
    "database": "your database name",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": your mysql password,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": your mysql password,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```
For migrating the tables...
```sh
$ sequelize db:migrate
```
When you install a new dependency always use ```--save``` 
```sh
$ npm install --save <package_name>
$ bower install --save <package_name>
```
*Happy coding*


   [node.js]: <http://nodejs.org>
   [React]: <http://reactjs.org/>
   [Webpack]: <http://webpack.js.org/>
   [jQuery]: <http://jquery.com>
   [express]: <http://expressjs.com>
   [sequelize-cli]: <http://www.npmjs.com/package/sequelize-cli>
   [Sequelize]: <https://sequelizejs.com>
   

