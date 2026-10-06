# marronniers (R)

Paquet R publié par [Les Créavores](https://lescreavores.fr/), sans dépendance :
le calendrier éditorial français (les « marronniers », ces dates qui reviennent
chaque année dans la presse et chez les marques) de septembre 2026 à décembre
2027, pour planifier publications, newsletters ou articles autour des dates qui
comptent pour un public français.

- 139 dates, du 14/09/2026 au 31/12/2027 (une période se termine le 03/01/2028)
- Types : `ferie`, `fete`, `commercial`, `journee`, `vacances`, `saison`
- 7 secteurs : `commerce`, `restauration`, `beaute`, `artisanat`, `b2b`,
  `sante`, `immobilier` ; une entrée marquée `tous` vaut pour chaque secteur
- Chaque entrée donne sa source et une idée de publication (`angle`)

## Installation

```r
install.packages("marronniers", repos = c("https://tresor4k.r-universe.dev", "https://cloud.r-project.org"))
```

## Utilisation

```r
library(marronniers)

# Les 3 prochaines dates non terminées au 20/11/2026 (périodes en cours comprises)
marronniers_a_venir("2026-11-20", n = 3)
#> 2026-11-01 Mois sans tabac et Movember
#> 2026-11-20 Journée internationale des droits de l'enfant
#> 2026-11-27 Black Friday

marronniers_a_venir()                 # à partir d'aujourd'hui
marronniers_mois(2027, 5)             # tout mai 2027
marronniers_secteur("restauration")   # entrées « tous » comprises
marronniers                           # le jeu complet (data.frame)
marronniers_secteurs                  # identifiants et libellés des secteurs
```

## Méthode

Chaque date est fixe, calculée par une règle publique (Pâques 2027 = 28 mars,
Black Friday = lendemain du 4e jeudi de novembre, soldes = code de commerce) ou
lue dans un texte officiel (arrêtés fixant les calendriers scolaires, calendrier
des soldes du ministère de l'Économie). `data/` est généré depuis le fichier de
données de l'outil en ligne (`tools/gen_data.mjs`) et un contrôle croisé compare
chaque champ avec ce fichier (`tools/crosscheck.mjs`, zéro écart exigé) :
[générateur de calendrier éditorial en ligne](https://lescreavores.fr/outils/generateur-calendrier-editorial/).

La même API existe en Swift, Java, Clojure et Haxe :
[tresor4k/marronniers](https://github.com/tresor4k/marronniers).

## Licence

MIT, voir LICENSE.md.
