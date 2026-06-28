import { transform } from 'sucrase';

export const transpileTypeScript = (codeStr: string): string => {
  try {
    const result = transform(codeStr, {
      transforms: ['jsx', 'typescript', 'imports'],
      production: true,
    });
    return result.code;
  } catch (err) {
    console.error('Transpilation error:', err);
    throw err;
  }
};
