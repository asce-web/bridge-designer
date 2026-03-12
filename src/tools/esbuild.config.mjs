import * as esbuild from 'esbuild';
import esbuildPluginTsc from 'esbuild-plugin-tsc';

esbuild.build({
  entryPoints: ['src/main.ts'],
  format: 'cjs',
  outfile: 'dist/main.cjs',
  bundle: true,
  platform: 'node',
  
  // Compress and obfuscate
  // minify: true, 

  // Required for decorator processing. 
  plugins: [esbuildPluginTsc()],
}).catch(() => process.exit(1));
