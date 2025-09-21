export interface BuildPaths {
  entry: string;
  html: string;
  output: string;
  src: string;
  public: string;
}

export type BuildMode = 'production' | 'development';
export type BuildPlatform = 'desktop' | 'mobile';

export function isBuildPlatform(value: any): value is BuildPlatform {
  return ["desktop", "mobile", "web"].includes(value);
}

export interface BuildOptions {
  port: number | string;
  open?: boolean;
  paths: BuildPaths;
  mode: BuildMode;
  analyzer?: boolean;
  platform: BuildPlatform;
}
