import { CorsOptions } from "cors";

/**
 * THIS SHOULD BE POPULATED VIA A SECRETS FILE
 */
class Config {
  port: number
  corsOptions: CorsOptions
  useLiveReload: boolean

  constructor() {
    this.port = parseInt(process.env.PORT || '8080');

    this.useLiveReload = true;

    this.corsOptions = {
      origin: 'http://localhost:3000',
      optionsSuccessStatus: 200
    }
  }
}

const config = new Config();
export default config;