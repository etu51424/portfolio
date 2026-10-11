# Carnet ouvert

Portfolio et blog statique sous Astro. Les textes sont dans `src/content/notes/`.

Chaque note comporte un titre, un domaine, un type, un résumé et une liste de notes liées. Ajouter un fichier Markdown génère une page et actualise la navigation, la recherche et les liens entrants lors de la prochaine compilation.

Commandes : `pnpm install`, `pnpm dev`, `pnpm build`.

Les textes initiaux sont issus du brief. Les dossiers incomplets sont explicitement signalés. Ajouter les vrais projets, médias, sources et liens sociaux avant de les présenter comme des réalisations.

React peut être ajouté ultérieurement pour une visualisation interactive. La recherche actuelle fonctionne en JavaScript léger.

## Tags Markdown

Ajouter des tags dans le texte (`#systèmes`, `#aerospace/satellites`) ou dans le frontmatter YAML : `tags: [systèmes, aerospace/satellites]`. Ils apparaissent automatiquement en haut de la note. Un clic ouvre `tag:#systèmes` dans la recherche. La casse est ignorée et un parent inclut ses sous-tags. Les tags purement numériques, le code et les destinations de liens ne sont pas indexés comme tags.

La barre accepte `tag:#essai`, `tag:biologie`, plusieurs tags, du texte complémentaire et `-tag:projet`. `#essai` seul est aussi un raccourci. Les recherches ont une URL partageable (`?q=…`). Les autres opérateurs avancés d’Obsidian ne sont pas implémentés.

## Tags sur les miniatures

La première ligne du fichier, avant le frontmatter `---`, sélectionne les tags affichés :

```text
;;THUMBNAIL_TAGS;#biologie #projet;
---
title: Exemple
```

Seuls ces tags apparaissent sur la miniature, dans l’ordre donné. Ils sont également recherchables et visibles dans l’article. Sans directive, la miniature n’affiche aucun tag. La directive est retirée avant le rendu et ne compte pas dans le temps de lecture. Les tags ordinaires du frontmatter ou du texte restent indépendants de cette sélection.

## Cloudflare Workers

Connecter le dépôt `etu51424/portfolio` dans Workers & Pages > Create application > Import a repository.

- Branche : `main`
- Répertoire racine : `/`
- Build : `pnpm run build`
- Déploiement : `pnpm exec wrangler deploy`
- Variable de build : `NODE_VERSION=24`

Le fichier `wrangler.jsonc` publie les fichiers statiques de `dist`. Aucun serveur Astro ni adaptateur SSR n'est nécessaire. Après connexion, chaque push sur `main` publie la nouvelle version.

Localement : `pnpm install`, `pnpm test`, `pnpm build`. Pour un déploiement manuel : `pnpm exec wrangler login`, puis `pnpm deploy`.
