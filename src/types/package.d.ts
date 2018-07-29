interface PackageInfo {
  id: string;
  name: string;
  version: string;
  categories: string[];
  owners: string[];
  files: Array<{
    from: string;
    fonts: Record<string, string>;
  }>;
  fallback?: string;
  license: {
    id: string;
    from?: string;
  };
  copyrights: string[];
  website: string;
}
