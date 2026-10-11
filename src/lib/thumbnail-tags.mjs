import { validTag, tagKey } from './tag-search.mjs';
export function readThumbnailTags(source) {
  const text = source.replace(/^\uFEFF/, '');
  const firstLine = text.split(/\r?\n/, 1)[0];
  if (!firstLine.startsWith(';;THUMBNAIL_TAGS;')) return { markdown: text, tags: [] };
  const match = /^;;THUMBNAIL_TAGS;([^;]*);$/.exec(firstLine);
  if (!match) throw new Error('Première ligne invalide : utiliser ;;THUMBNAIL_TAGS;#tag #autre;');
  const tags = new Map();
  for (const token of match[1].trim().split(/\s+/).filter(Boolean)) {
    if (!token.startsWith('#') || !validTag(token.slice(1))) throw new Error('Tag de miniature invalide : ' + token);
    const value = token.slice(1);
    if (!tags.has(tagKey(value))) tags.set(tagKey(value), value);
  }
  return { markdown: text.slice(firstLine.length).replace(/^\r?\n/, ''), tags: [...tags.values()] };
}
