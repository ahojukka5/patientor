declare const process: {
  env: {
    NODE_ENV: 'development' | 'production';
  };
};

const prod = {
  apiBaseUrl: 'https://patientor-backend.eu-gb.mybluemix.net',
};

const dev = {
  apiBaseUrl: 'http://localhost:3001/api',
};

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default config;
