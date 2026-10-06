\name{marronniers_secteur}
\alias{marronniers_secteur}
\encoding{UTF-8}
\title{Marronniers d'un secteur d'activité}
\description{
Renvoie les entrées de \code{\link{marronniers}} qui concernent un secteur ; les
entrées marquées \code{"tous"} sont toujours incluses.
}
\usage{marronniers_secteur(secteur)}
\arguments{
  \item{secteur}{identifiant de secteur, voir \code{marronniers_secteurs$id} :
    \code{"commerce"}, \code{"restauration"}, \code{"beaute"}, \code{"artisanat"},
    \code{"b2b"}, \code{"sante"} ou \code{"immobilier"}.}
}
\value{Un \code{data.frame} avec les colonnes de \code{\link{marronniers}}.}
\examples{
nrow(marronniers_secteur("restauration"))
}
