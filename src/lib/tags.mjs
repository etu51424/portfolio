import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { tagKey, validTag, tagUrl } from './tag-search.mjs';
export function inlineTags(text) {
  return [...text.matchAll(/(?<![\p{L}\p{M}\p{N}_/#\\])#([\p{L}\p{M}\p{N}\p{S}_/-]+)/gu)]
    .filter(match => validTag(match[1]));
}
function visitText(node, callback) {
  if (['code','inlineCode','html','link','image','definition'].includes(node.type)) return;
  if (node.type === 'text') callback(node);
  for (const child of node.children || []) visitText(child, callback);
}
export function getTags(body = '', frontmatter = []) {
  const tags = new Map();
  const add = tag => { const clean = tag.replace(/^#/, ''); if(validTag(clean) && !tags.has(tagKey(clean))) tags.set(tagKey(clean), clean); };
  for (const tag of frontmatter) add(tag);
  const source = body.replace(/%%[\s\S]*?%%/g, '').replace(/<([a-z][\w-]*)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const tree = unified().use(remarkParse).parse(source);
  visitText(tree, node => {
    const raw = source.slice(node.position.start.offset, node.position.end.offset);
    for (const match of inlineTags(raw)) add(match[1]);
  });
  return [...tags.values()];
}
// Make inline Markdown tags clickable without touching code or link destinations.
export function remarkTags() {
  return (tree, file) => {
    const source = String(file);
    function transform(parent) {
      if (['code','inlineCode','html','link','image','definition'].includes(parent.type)) return;
      if (!parent.children) return;
      parent.children = parent.children.flatMap(node => {
        if(node.type !== 'text') { transform(node); return [node]; }
        const raw = source.slice(node.position.start.offset, node.position.end.offset);
        const allowed = new Set(inlineTags(raw).map(match => tagKey(match[1])));
        const matches = inlineTags(node.value).filter(match => allowed.has(tagKey(match[1])));
        const parts = []; let offset = 0;
        for(const match of matches) {
          parts.push({type:'text',value:node.value.slice(offset,match.index)});
          parts.push({type:'link',url:tagUrl(match[1]),children:[{type:'text',value:match[0]}],data:{hProperties:{className:['inline-tag']}}});
          offset = match.index + match[0].length;
        }
        parts.push({type:'text',value:node.value.slice(offset)});
        return parts;
      });
    }
    transform(tree);
  };
}
