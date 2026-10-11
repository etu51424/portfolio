import test from 'node:test';
import assert from 'node:assert/strict';
import {readThumbnailTags} from '../src/lib/thumbnail-tags.mjs';
import {parseFrontmatter} from '@astrojs/markdown-remark';
test('Read first line and retain valid YAML and Markdown body',()=>{
 const source=';;THUMBNAIL_TAGS;#biologie #projet;\n---\ntitle: Test\ntags: [autre]\n---\nBody';
 const result=readThumbnailTags(source);
 assert.deepEqual(result.tags,['biologie','projet']);
 assert.equal(parseFrontmatter(result.markdown).frontmatter.title,'Test');
 assert.equal(parseFrontmatter(result.markdown).content.trim(),'Body');
});
test('BOM, Windows lines, Unicode, nested tags and case deduplication',()=>{
 const result=readThumbnailTags('\uFEFF;;THUMBNAIL_TAGS;#Énergie #énergie #biologie/spéculative;\r\n---\r\ntitle: Test\r\n---');
 assert.deepEqual(result.tags,['Énergie','biologie/spéculative']);
 assert.ok(result.markdown.startsWith('---'));
});
test('No implicit tags or directive recognition later in the file',()=>{
 const markdown='---\ntags: [biologie]\n---\n;;THUMBNAIL_TAGS;#projet;';
 assert.deepEqual(readThumbnailTags(markdown),{markdown,tags:[]});
 assert.deepEqual(readThumbnailTags(';;THUMBNAIL_TAGS;;\nBody'),{markdown:'Body',tags:[]});
});
test('Reject malformed directives and invalid tags',()=>{
 assert.throws(()=>readThumbnailTags(';;THUMBNAIL_TAGS;#projet'));
 assert.throws(()=>readThumbnailTags(';;THUMBNAIL_TAGS;biologie;'));
 assert.throws(()=>readThumbnailTags(';;THUMBNAIL_TAGS;#1984;'));
});
