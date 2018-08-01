type CharacterType = 'Alphabets' | 'Hiragana' | 'Katakana' | 'Kanji';

interface PackageInfo {
  $schema: string;
  id: string;
  name: string;
  version: string;
  categories: string[];
  characters: CharacterType[];
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
