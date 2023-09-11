export interface NpmRegistryResponse {
  name: string;
  'dist-tags': {
    [key: string]: string;
  };
}

export interface NpmDownloadsResponse {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

export interface PepyResponse {
  total_downloads: number;
  id: string;
  versions: string[];
}
