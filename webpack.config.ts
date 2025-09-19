// запуск: NODE_OPTIONS='--loader ts-node/esm' webpack --env mode=development --config webpack.config.ts

import path from 'path';
import { fileURLToPath } from 'url';
import type { Configuration } from 'webpack';
import { buildWebpack } from './config/build/buildWebpack';
import { BuildMode, BuildPaths, BuildPlatform, isBuildPlatform } from './config/build/types/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BuildEnv {
  mode?: BuildMode;
  port?: number | string;
  open?: boolean;
  analyzer?: boolean;
  platform?: BuildPlatform;
}

const config = (env: BuildEnv = {}): Configuration => {
  const paths: BuildPaths = {
    output: path.resolve(__dirname, 'build'),
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    html: path.resolve(__dirname, 'public', 'index.html'),
    src: path.resolve(__dirname, 'src'),
    public: path.resolve(__dirname, 'public'),
  }

  const config: Configuration = buildWebpack({
    port: env.port ?? 3000,
    mode: env.mode ?? 'development',
    paths,
    analyzer: env.analyzer,
    platform: isBuildPlatform(env.platform) ? env.platform : "desktop"
  })

  return config;
};

export default config;