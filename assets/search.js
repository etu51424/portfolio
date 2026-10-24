/* Plain JavaScript; shared by the browser and the migration checks. */
(function (root) {
  'use strict';

  const tagKey = tag => tag.replace(/^#/, '').toLowerCase();

  function hasTag(tags, query) {
    const key = tagKey(query);
    return !!key && tags.some(tag => tagKey(tag) === key || tagKey(tag).startsWith(key + '/'));
  }

  function matchesQuery(note, query) {
    const terms = query.match(/(?:-?tag:)?"[^"]*"|\S+/g) || [];
    return terms.every(term => {
      const excluded = term.startsWith('-');
      const token = excluded ? term.slice(1) : term;
      const isTag = /^tag:/i.test(token) || token.startsWith('#');
      const value = (isTag ? token.replace(/^tag:/i, '') : token).replace(/^"|"$/g, '');
      const match = isTag ? hasTag(note.tags, value) : note.text.toLowerCase().includes(value.toLowerCase());
      return excluded ? !match : match;
    });
  }

  root.PortfolioSearch = { tagKey, hasTag, matchesQuery };
})(globalThis);
