# Japon 2026 — contexte du projet

App web personnelle pour un voyage au Japon, **du 13 octobre au 4 novembre 2026**.
Selma Ceria voyage avec Syan (son copain), sa mère Nidia qui les rejoint le 15,
et Selma, la sœur de Syan, qui détient les billets.

## Les adresses

| | |
|---|---|
| L'app | https://selmaceria-droid.github.io/japon-2026/ |
| Page d'installation (à partager) | `.../installer.html` |
| To-do de Selma (sœur de Syan) | `.../selma.html` |
| Dépôt | `selmaceria-droid/japon-2026` — **public** |

## Règles non négociables

**1. Ne jamais mélanger avec Billy.** Selma utilise le même Mac pour ses dépôts
professionnels. Le cloisonnement en place, à préserver :

- Clé SSH perso : `~/.ssh/id_ed25519_japon_perso`, enfermée derrière l'alias
  `github-perso` dans `~/.ssh/config` avec `IdentitiesOnly yes`. Une connexion
  `github.com` ordinaire ne propose **aucune** clé — c'est voulu.
- Remote : `git@github-perso:selmaceria-droid/japon-2026.git`
- `user.name` / `user.email` sont posés **en local au dépôt**, jamais en global,
  avec l'adresse masquée `selmaceria-droid@users.noreply.github.com`.
- L'adresse `selma@billyapp.live` ne doit apparaître nulle part ici.

**2. Le dépôt est public.** N'y mettre jamais : numéro ou code de réservation,
numéro de billet, téléphone, adresse e-mail, prix payés, nom de famille d'un tiers.
Les numéros de vol, noms d'hôtels et adresses de lieux publics sont sans risque.
Les références du Rokuhara Inn et les PNR restent dans Booking, volontairement.

**3. Pas de serveur.** Ce sont des fichiers statiques sur GitHub Pages. Donc : pas
de stockage partagé, pas de réception de fichiers, pas de notification push. Toute
demande qui suppose un serveur doit être redessinée, pas bricolée.

**Les billets eux-mêmes (QR, captures smartEX…) ne vont jamais dans le dépôt** : un QR
scanné, c'est quelqu'un qui monte à notre place. L'app propose « Joindre le billet »
sur chaque activité à billet : la capture reste dans le téléphone (IndexedDB
`japon-billets`, la même réserve que `selma.html`, clé `b-<date>-<titre>`), s'affiche
dans Activités et dans le trajet correspondant de l'onglet Itinéraire, et s'ouvre en
plein écran sur fond blanc pour le portique. Chacun joint les siens sur son téléphone.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `data.js` | **le seul fichier de contenu** : `ETAPES`, `ACTIVITES`, `APPS`, `ALBUM`, `METEO` |
| `app.js` | tout le rendu de l'app |
| `index.html` | structure et feuille de style de l'app |
| `installer.html` | page d'installation, autonome |
| `selma.html` | to-do de Selma, autonome (lit `data.js` pour la liste des billets) |
| `icones-apps.js` | icônes App Store en base64, pour que l'onglet Apps marche hors ligne |
| `sw.js` | cache hors ligne |

### Champs maison dans `data.js`

- `marche` : 0 à 3 (plus pour une journée entière au même endroit). La jauge du jour
  est la somme : 0 Repos · 1-2 Tranquille · 3-5 Modérée · 6-8 Soutenue · 9+ Grosse journée.
- `billet` : `"attendu"` ou `"pris"`.
- `vol` : code OACI, pour le bouton FlightAware (`AFR186`, `HVN311`, `HVN19`).
- `tz` : fuseau quand ce n'est pas Tokyo (`Europe/Paris`, `Asia/Ho_Chi_Minh`).
- `trajet` sur une étape : `mode`, `duree`, `prix`, `depart`, `arrivee`,
  `details` (tableau de lignes), `aVerifier`.

## Publier

```bash
git add -A && git commit -m "..." && git push
```

**Incrémenter `VERSION` dans `sw.js` à chaque fois**, sinon les téléphones qui ont
déjà l'app servent l'ancienne version depuis leur cache. Compter ~40 s avant que
GitHub Pages publie. Pour vérifier soi-même tout de suite, ajouter `?cb=1` à l'adresse.

**Depuis une session Claude distante** (qui travaille sur une branche `claude/...`) :
GitHub Pages ne publie que `main`. Selma a demandé que Claude publie lui-même, sans
attendre : après le commit sur la branche de travail, fusionner dans `main` et pousser
`main` dans la foulée, sans pull request ni question. Ne pas s'arrêter à « c'est sur
ma branche ».

## Pièges déjà rencontrés — ne pas les refaire

- **Cache GitHub Pages** : 10 min de `max-age`. Le service worker revalide
  (`cache: 'no-cache'`) pour que les mises à jour arrivent au premier rechargement.
- **Collisions de classes CSS** : `.sceau act` entrait en conflit avec `.act` des
  cartes d'activité, qui imposait sa grille. Les sceaux sont préfixés `s-`.
- **UID de calendrier** : avec un UID non unique, l'iPhone fusionne silencieusement
  les événements d'un même jour. Ils dérivent de la date + du titre.
- **Transform CSS sur un SVG** : elle *remplace* l'attribut `transform`. Mettre la
  position sur un `<g>` et l'animation sur l'élément interne.
- **Fuseaux horaires** : un vol parti de Paris n'est pas à l'heure de Tokyo. Le
  fichier `.ics` déclare un `VTIMEZONE` par fuseau utilisé.
- **Ordre du cascade CSS** : une règle de mode sombre placée avant la règle générale
  est écrasée par elle.
- **Météo du Fuji** : les modèles divergent beaucoup (19° à 25° le 19 oct.). Les
  chiffres du lac viennent d'Open-Meteo, point de grille à 831 m.

## Ce qui reste à faire

- **Rafraîchir la météo** quelques jours avant le 13 octobre : elle est figée au
  10 oct. 2026. Source : `api.open-meteo.com`, plus JMA / Weather Company / AccuWeather.
- **Les réponses de Selma** : elle renvoie un récapitulatif par message. Reporter
  ses oui/non dans `data.js` et basculer les `billet: "attendu"` en `"pris"`.
  Récapitulatif du 11 oct. reporté : il reste sans réponse la durée du vol
  Narita → Hanoï, le nom et l'adresse du logement de Tokyo (ce n'est pas la Villa
  Roppongi), et 8 billets encore « attendus ». Sur le Jidai Matsuri elle répond
  « non » au départ du Palais vers midi, ce qui contredit le programme habituel :
  à recouper.
- **Les schémas d'ouverture des apps** (`schema` dans `APPS`) marqués `aVerifier`
  sont des suppositions ; les éditeurs ne les documentent pas. Pour en tester un :
  le taper dans Safari sur l'iPhone.
- Si le planning définitif migre vers l'app **Stippl**, réaligner `data.js` dessus.

## Ton

Selma n'est pas développeuse mais a des notions. Expliquer les choix techniques en
français courant, signaler les contraintes réelles au lieu de les contourner en
silence, et vérifier le rendu plutôt que l'affirmer.
