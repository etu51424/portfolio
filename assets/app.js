(function () {
  'use strict';

  // The script URL anchors every link to this folder, including /portfolio/.
  const script = Array.from(document.scripts).find(script => /\/assets\/app\.js(?:\?|$)/.test(script.src));
  const base = new URL('../', script.src);
  const home = new URL('index.html', base);
  const notes = window.PortfolioNotes;
  const { matchesQuery, tagKey } = window.PortfolioSearch;
  const input = document.getElementById('search');
  const results = document.getElementById('search-results');
  const main = document.querySelector('main');
  const tabs = Array.from(document.querySelectorAll('.feed-tabs a'));

  function tagUrl(tag) {
    const url = new URL(home);
    url.searchParams.set('q', 'tag:#' + tagKey(tag));
    return url.href;
  }

  function render() {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    input.value = query;
    const searching = !!query.trim();
    results.replaceChildren();
    results.hidden = !searching;
    main.hidden = searching;

    if (main.classList.contains('feed')) {
      const requested = params.get('domain') || '';
      const selected = tabs.some(tab => tab.dataset.domain === requested) ? requested : '';
      for (const tab of tabs) {
        if (tab.dataset.domain === selected) tab.setAttribute('aria-current', 'page');
        else tab.removeAttribute('aria-current');
      }
      for (const card of document.querySelectorAll('.media-card')) {
        card.hidden = !!selected && card.dataset.domain !== selected;
      }
      for (const intro of document.querySelectorAll('[data-domain-intro]')) {
        intro.hidden = selected !== intro.dataset.domainIntro;
      }
    }

    if (!searching) return;
    const matches = notes.filter(note => matchesQuery(note, query.trim()));
    const label = document.createElement('p');
    label.textContent = matches.length + ' résultat(s) pour ' + query;
    results.append(label);

    for (const note of matches) {
      const row = document.createElement('article');
      row.className = 'search-result';
      const link = document.createElement('a');
      link.href = new URL(note.url, base).href;
      link.textContent = note.title;
      row.append(link);
      const tags = document.createElement('div');
      tags.className = 'note-tags';
      for (const tag of note.tags) {
        const link = document.createElement('a');
        link.href = tagUrl(tag);
        link.textContent = '#' + tag;
        tags.append(link);
      }
      row.append(tags);
      results.append(row);
    }
  }

  function navigate(url, replace = false) {
    // Local files can be opened directly; some browsers restrict file history.
    try { history[replace ? 'replaceState' : 'pushState'](null, '', url); }
    catch { location.href = url.href; return; }
    render();
  }

  input.addEventListener('input', () => {
    const url = new URL(location.href);
    if (input.value.trim()) url.searchParams.set('q', input.value.trim());
    else url.searchParams.delete('q');
    // Keep the typed value (including spaces) while rendering normalized results.
    const typed = input.value;
    navigate(url, true);
    input.value = typed;
  });

  input.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const url = new URL(location.href);
    url.searchParams.delete('q');
    navigate(url);
  });

  document.addEventListener('click', event => {
    const link = event.target.closest('.note-tags a, .inline-tag');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const query = new URL(link.href).searchParams.get('q');
    if (!query) return;
    event.preventDefault();
    const url = new URL(location.href);
    url.searchParams.set('q', query);
    navigate(url);
    input.focus();
    window.scrollTo({ top: 0 });
  });

  window.addEventListener('popstate', render);
  render();
})();
