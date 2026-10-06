\name{marronniers_a_venir}
\alias{marronniers_a_venir}
\encoding{UTF-8}
\title{Prochains marronniers à partir d'une date}
\description{
Renvoie les \code{n} prochaines entrées de \code{\link{marronniers}} qui ne sont
pas terminées au jour \code{depuis}, périodes en cours comprises, triées par date
de début.
}
\usage{marronniers_a_venir(depuis = Sys.Date(), n = 10)}
\arguments{
  \item{depuis}{date de départ : \code{Date} ou chaîne \code{"AAAA-MM-JJ"}.}
  \item{n}{nombre maximal d'entrées renvoyées.}
}
\value{Un \code{data.frame} avec les colonnes de \code{\link{marronniers}}.}
\examples{
marronniers_a_venir("2026-11-20", n = 3)[, c("date", "date_fin", "libelle")]
}
