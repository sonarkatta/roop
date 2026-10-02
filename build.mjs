import {build} from 'esbuild';
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('docs',{recursive:true});
await build({entryPoints:['src/main.tsx'],bundle:true,minify:true,outfile:'docs/app.js',target:['safari14','chrome90'],jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
for(const file of ['index.html','icon.svg','sw.js'])await copyFile(file,'docs/'+file);
