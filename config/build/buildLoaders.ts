import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { ModuleOptions, RuleSetRule } from "webpack";
import type { BuildOptions } from "./types/types";
import ReactRefreshTypeScript from 'react-refresh-typescript';


export function buildLoaders({ mode }: BuildOptions): ModuleOptions['rules'] {
  const isProd = mode === 'production';
  const isDev = !isProd;

  const assetRule = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  };

  const svgrLoader = {
    test: /\.svg$/,
    use: [
      { 
        loader: '@svgr/webpack', 
        options: { 
          icon: true,
          svgoConfig: {
            plugins: [
              {
                name: 'convertColors',
                params: {
                  currentColor: true,
                },
              },
            ],
          },
        } ,
      },
    ],
  };

  const cssLoader: RuleSetRule['use'] = {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
      modules: {
        auto: /\.module\.\w+$/i,
        mode: 'local',
        localIdentName: isProd ? '[hash:base64:8]' : '[path][name]__[local]',
        namedExport: false,
      },
    },
  };

  const postcssLoader = { 
    loader: 'postcss-loader',
  };

  const sassLoader = {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  };

  const styleRule: RuleSetRule = {
    test: /\.(sa|sc|c)ss$/,
    use: [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader', 
      cssLoader, 
      postcssLoader, 
      sassLoader,
    ],
  };

  const tsRule: RuleSetRule = {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: { 
      loader: 'ts-loader', 
      options: { 
        transpileOnly: true,
        getCustomTransformers: () => ({
          before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
        }),
      } 
    },
  };

  return [
    assetRule,
    tsRule,
    styleRule,
    svgrLoader,
  ]
}