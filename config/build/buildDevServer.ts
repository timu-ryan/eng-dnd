import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { BuildOptions } from "./types/types";

export function buildDevServer({ port, open }: BuildOptions): DevServerConfiguration {
  
  const devServer = {
    port: port ?? 3000,
    open: open ?? true,
    // config nginx in prod
    historyApiFallback: true,
    hot: true,
    host: "0.0.0.0",
    allowedHosts: "all",
  };

  return devServer;
}