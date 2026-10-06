\name{marronniers}
\alias{marronniers}
\alias{marronniers_secteurs}
\docType{data}
\encoding{UTF-8}
\title{Calendrier éditorial français, septembre 2026 à décembre 2027}
\description{
Les « marronniers », ces dates qui reviennent chaque année dans la presse et chez
les marques : 139 entrées du 14/09/2026 au 31/12/2027 (une période se termine le
03/01/2028), triées par date de début. Les entrées qui commencent le même jour
gardent l'ordre de la source.
}
\usage{
marronniers
marronniers_secteurs
}
\format{
\code{marronniers} est un \code{data.frame} de 139 lignes et 7 colonnes :
\describe{
  \item{date}{premier jour (\code{Date}).}
  \item{date_fin}{dernier jour (\code{Date}), égal à \code{date} pour un jour unique.}
  \item{libelle}{nom de la date.}
  \item{type}{\code{"ferie"}, \code{"fete"}, \code{"commercial"}, \code{"journee"},
    \code{"vacances"} ou \code{"saison"}.}
  \item{secteurs}{identifiants de secteur séparés par des virgules ; \code{"tous"}
    vaut pour chaque secteur.}
  \item{source}{origine de la date (texte officiel, organisation, règle ou usage).}
  \item{angle}{idée de publication en une phrase.}
}
\code{marronniers_secteurs} est un \code{data.frame} de 7 lignes : \code{id} et
\code{label} (libellé en français) de chaque secteur.
}
\source{
Données de l'outil en ligne de Les Créavores :
\url{https://lescreavores.fr/outils/generateur-calendrier-editorial/}. Chaque date
est fixe, calculée par une règle publique (Pâques 2027 = 28 mars, Black Friday =
lendemain du 4e jeudi de novembre, soldes = code de commerce) ou lue dans un texte
officiel (arrêtés fixant les calendriers scolaires, calendrier des soldes du
ministère de l'Économie).
}
\examples{
head(marronniers[, c("date", "libelle", "type")])
table(marronniers$type)
marronniers_secteurs
}
\keyword{datasets}
