import type { Configuration } from 'webpack';
import { buildDevServer } from './buildDevServer';
import { buildLoaders } from './buildLoaders';
import { buildPlugins } from './buildPlugins';
import { buildResolvers } from './buildResolvers';
import { BuildOptions } from './types/types';


export function buildWebpack(options: BuildOptions): Configuration {
  const isProd = options.mode === 'production';

  const config: Configuration = {
    mode: options.mode,
    entry: options.paths.entry,
    output: {
      path: options.paths.output,
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      clean: true,
    },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    module: {
      rules: buildLoaders(options),
    },
    resolve: buildResolvers(options),
    plugins: buildPlugins(options),
    cache: { type: 'filesystem' },
    stats: 'minimal',
    infrastructureLogging: { level: 'warn' },
    devServer: isProd ? undefined : buildDevServer(options),
  };

  return config;

}