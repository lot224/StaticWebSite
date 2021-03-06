import cors from 'cors';
import express from 'express';
import core from 'express-serve-static-core';
import path from 'path';
import fs from 'fs';

import config from './Config';
import chalk from 'chalk';

export default class Server {

  private app: core.Express

  constructor() {
    this.app = express();
  }

  private middleware = () => {
    this.app.use(cors(config.corsOptions || undefined));

    if (config.useLiveReload)
      this.app.use(require('connect-livereload')())

    // Allow Statice Folders
    const staticPath = path.join(__dirname, '../../../web');

    this.app.use((req, res, next) => {
      const file = path.join(staticPath, req.path + '.html');
      if (fs.existsSync(file) === true)
        req.url += '.html'
      
      next();
    });

    this.app.use(express.static(staticPath));

    // Default root site to index.html
    this.app.use('/', express.static(`${staticPath}/index.html`));
  }


  onRequestStart = (request: core.Request, response: core.Response, next: core.NextFunction) => {
    // Here we can log usage analytics to see what is being called.
    const staticPath = path.join(__dirname, '../../../web');
    
    let url = request.originalUrl;
    if (request.originalUrl.indexOf('?') > 0)
      url = url.substr(0, request.originalUrl.indexOf('?'));

    const file = path.join(staticPath, url);
    const type = chalk.blue('REQUEST');
    const method = chalk.yellow(request.method);
    
    if (fs.existsSync(file) === true) {
      console.log(`${type}\t${method}\t${chalk.green(url)}`);
    } else {
      console.log(`${type}\t${method}\t${chalk.red(url)}`);
    }

    next();
  }


  listen = (port: number) => {
    this.app.use(this.onRequestStart);
    this.middleware();

    const router = express.Router();

    this.app.use('/', router);

    this.app.listen(port);
    console.log(chalk.blue(`Site Running (http://localhost:${port}/)`));
  }

}