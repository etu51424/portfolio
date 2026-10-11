import test from 'node:test';
import assert from 'node:assert/strict';
import {getTags} from '../src/lib/tags.mjs';
import {hasTag,matchesQuery,tagUrl} from '../src/lib/tag-search.mjs';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import {remarkTags} from '../src/lib/tags.mjs';
test('Inline Markdown tags become real links, code remains code',async()=>{
 const processor=unified().use(remarkParse).use(remarkTags);
 const markdown='Une note #systèmes/spatial et `#code`.';
 const tree=await processor.run(processor.parse(markdown),{value:markdown});
 const children=tree.children[0].children;
 assert.equal(children.find(n=>n.type==='link').url,tagUrl('systèmes/spatial'));
 assert.equal(children.find(n=>n.type==='inlineCode').value,'#code');
});
test('Markdown tags: unicode, nested, case deduplication and frontmatter',()=>{
 assert.deepEqual(getTags('# Heading\n#énergie #systèmes/spatial #ÉNERGIE #1984 #y1984 #🛰️',['Projet','projet']),['Projet','énergie','systèmes/spatial','y1984','🛰️']);
});
test('Ignore code, HTML, escaped hashes, URLs and Obsidian comments',()=>{
 assert.deepEqual(getTags('`#inline`\n```md\n#code\n```\n\\#escaped\n<a href="#html">#html</a>\n[link](https://example.com/#url)\n%% #comment %%\n#real'),['real']);
});
test('Tag search matches a parent hierarchy, never a substring or reversed path',()=>{
 assert.equal(hasTag(['Systèmes/spatial'],'#systèmes'),true);
 assert.equal(hasTag(['mysystèmes'],'systèmes'),false);
 assert.equal(hasTag(['other/systèmes'],'systèmes'),false);
 assert.equal(hasTag(['systèmes'],'systèmes/spatial'),false);
});
test('Combined tag and text searches and exclusions',()=>{
 const note={tags:['spatial/satellites','essai'],text:'Économie des satellites'};
 assert.equal(matchesQuery(note,'tag:#SPATIAL économie'),true);
 assert.equal(matchesQuery(note,'tag:spatial tag:essai'),true);
 assert.equal(matchesQuery(note,'tag:spatial -tag:essai'),false);
 assert.equal(matchesQuery(note,'#spatial'),true);
 assert.equal(tagUrl('énergie'), '/?q=tag%3A%23%C3%A9nergie');
});
