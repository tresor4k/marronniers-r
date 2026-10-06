\name{marronniers_mois}
\alias{marronniers_mois}
\encoding{UTF-8}
\title{Marronniers d'un mois}
\description{
Renvoie les entrées de \code{\link{marronniers}} dont la période chevauche le mois
demandé, triées par date de début.
}
\usage{marronniers_mois(annee, mois)}
\arguments{
  \item{annee}{année, par exemple \code{2027}.}
  \item{mois}{mois, de 1 à 12.}
}
\value{Un \code{data.frame} avec les colonnes de \code{\link{marronniers}}.}
\examples{
marronniers_mois(2027, 5)[, c("date", "libelle")]
}
