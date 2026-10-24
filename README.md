# Carnet ouvert

Portfolio statique en HTML, CSS et JavaScript. Aucune dépendance, installation,
compilation, bibliothèque externe ou serveur applicatif.

## Ouvrir le site

Ouvrir `index.html` dans un navigateur. Pour une prévisualisation HTTP facultative,
servir ce dossier avec n’importe quel serveur statique.

## Fichiers à modifier

- `index.html` : accueil et cartes des articles.
- `notes/<nom>/index.html` : texte et métadonnées HTML de chaque article.
- `assets/style.css` : styles, responsive et thème sombre selon le navigateur.
- `assets/notes.js` : catalogue de recherche (titre, domaine, tags, texte et URL).
- `assets/search.js` : filtres de recherche, sans dépendances.
- `assets/app.js` : résultats de recherche et filtres par domaine.
- `images/` : médias locaux.

Le contenu et les menus sont du vrai HTML, lisible même sans JavaScript.
La recherche utilise un catalogue local : après modification d’un article,
mettre aussi à jour son entrée dans `assets/notes.js`, notamment le champ `text`.
Ce petit travail manuel remplace la génération automatique d’Astro.

## Ajouter une note

1. Copier une page vers `notes/<nouveau-nom>/index.html`.
2. Modifier le titre, la description, les tags et le texte dans `article.prose`.
3. Ajouter son entrée dans `assets/notes.js` avec son texte recherchable et son
   URL relative `notes/<nouveau-nom>/index.html`.
4. Ajouter sa carte dans `index.html`, ses liens dans les menus et les éventuels
   liens entrants dans les pages concernées.

Les liens sont relatifs : le dossier fonctionne à la racine d’un hébergeur,
sous `/portfolio/` ou directement depuis un fichier.

## Recherche et tags

- `satellites` : recherche dans le texte intégral.
- `"passage à l’échelle"` : expression exacte.
- `#biologie` ou `tag:biologie` : tag et ses sous-tags.
- `tag:biologie -tag:projet` : exclusions.
- Plusieurs termes ou tags se combinent avec un ET.

Les recherches sont partageables dans l’URL. Échap efface la recherche ;
le bouton Retour restaure la recherche précédente.
Les tags sont des liens HTML tels que `../../index.html?q=tag%3A%23biologie`.

## Publier sur GitHub Pages

Dans `etu51424/portfolio` : Settings → Pages → Source : **Deploy from a branch**,
branche **main**, dossier **/(root)**. `.nojekyll` permet de servir les fichiers
statiques directement. Aucun workflow de compilation n’est nécessaire.

Adresse attendue après activation : https://etu51424.github.io/portfolio/

## Contenus conservés

Les six notes du dépôt sont conservées. La note locale « Mon parcours dans
l’aérospatial » et sa photo sont ajoutées sous `notes/parcours-aerospatial/`.
L’essai d’origine reste sous `notes/satellites/`.
Les anciennes sources Astro restent dans l’historique Git et la copie locale
originale, qui n’a pas été remplacée.
