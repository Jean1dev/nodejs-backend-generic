<h1 align="center">
    nodejs-backend-generic
</h1>

<p align="center">
<a href="https://github.com/Jean1dev/nodejs-backend-generic/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/Jean1dev/nodejs-backend-generic"></a>
<a href="https://github.com/Jean1dev/nodejs-backend-generic/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/Jean1dev/nodejs-backend-generic"></a>
<a href="https://github.com/Jean1dev/nodejs-backend-generic/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/Jean1dev/nodejs-backend-generic"></a>
<a href="https://github.com/Jean1dev/nodejs-backend-generic/blob/master/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/Jean1dev/nodejs-backend-generic"></a>
</p>
![Node.js CI](https://github.com/Jean1dev/nodejs-backend-generic/workflows/Node.js%20CI/badge.svg)
backend utilizado em algumas das minhas aplicacoes

Para rodar a aplicacao é necessario ter o mongoDB
o arquivo de configuracao fica em src/config/db.config.js
apos isso instale as dependencias e rode o projeto

## :information_source: How To Use

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js v10.16][nodejs] or higher + [Yarn v1.13][yarn] or higher installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/Jean1dev/nodejs-backend-generic.git

# Go into the repository
$ cd nodejs-backend-generic

# Install dependencies
$ yarn install

# Start project Dependencies
$ docker-compose -f "docker-compose.yml" up -d --build

# Run the app 
$ npm start
```
