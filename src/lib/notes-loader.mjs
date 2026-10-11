import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { readThumbnailTags } from './thumbnail-tags.mjs';
export function notesLoader() {
 return {name:'markdown-notes-with-thumbnail-tags',async load(context){
  const base=fileURLToPath(new URL('./src/content/notes/',context.config.root));
  async function files(directory){const entries=await readdir(directory,{withFileTypes:true});const lists=await Promise.all(entries.map(entry=>entry.isDirectory()?files(path.join(directory,entry.name)):entry.name.endsWith('.md')?[path.join(directory,entry.name)]:[]));return lists.flat();}
  async function sync(){
   const ids=new Set();
   for(const filename of await files(base)){
    const raw=await readFile(filename,'utf8');
    const {markdown,tags}=readThumbnailTags(raw);
    const {frontmatter,content}=parseFrontmatter(markdown);
    const id=path.relative(base,filename).split(path.sep).join('/').replace(/\.md$/,'');ids.add(id);
    const data=await context.parseData({id,filePath:filename,data:{...frontmatter,thumbnailTags:tags,tags:[...(frontmatter.tags||[]),...tags]}});
    const rendered=await context.renderMarkdown(content,{fileURL:pathToFileURL(filename)});
    context.store.set({id,data,body:content,filePath:path.relative(fileURLToPath(context.config.root),filename).split(path.sep).join('/'),digest:context.generateDigest(raw),rendered,assetImports:rendered.metadata?.imagePaths});
   }
   for(const id of context.store.keys())if(!ids.has(id))context.store.delete(id);
  }
  await sync();
  if(context.watcher){let pending=Promise.resolve();const refresh=filename=>{const relative=path.relative(base,filename);if(relative.startsWith('..')||path.isAbsolute(relative)||!filename.endsWith('.md'))return;pending=pending.then(sync).catch(error=>context.logger.error(error.message));};context.watcher.add(base);context.watcher.on('add',refresh);context.watcher.on('change',refresh);context.watcher.on('unlink',refresh);}
 }};
}
