import config from "./infrastructure/Config";
import Server from "./infrastructure/Server";

import * as path from 'path';
import chalk from "chalk";

console.log(chalk.gray(`\n${new Date().toString()}`));
console.log(chalk.green(`Starting Static Web Server`));

if (config.useLiveReload) {
  const liveReload = require('livereload');
  const liveReloadServer = liveReload.createServer();
  const staticPath = path.join(__dirname, '../../web');
  liveReloadServer.watch(staticPath);
}

const app = new Server();
app.listen(config.port);