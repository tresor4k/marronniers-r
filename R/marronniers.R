# Jeu complet du paquet (lazy data), dans l'ordre des dates.
.jeu <- function() marronniers::marronniers

.ligne <- function(x) {
  rownames(x) <- NULL
  x
}

marronniers_a_venir <- function(depuis = Sys.Date(), n = 10) {
  depuis <- as.Date(depuis)
  if (length(depuis) != 1L || is.na(depuis)) stop("`depuis` doit \u00eatre une date unique (AAAA-MM-JJ).")
  m <- .jeu()
  .ligne(utils::head(m[m$date_fin >= depuis, , drop = FALSE], max(0L, as.integer(n))))
}

marronniers_mois <- function(annee, mois) {
  debut <- as.Date(sprintf("%04d-%02d-01", as.integer(annee), as.integer(mois)))
  fin <- seq(debut, by = "month", length.out = 2L)[2L] - 1L
  m <- .jeu()
  .ligne(m[m$date <= fin & m$date_fin >= debut, , drop = FALSE])
}

marronniers_secteur <- function(secteur) {
  m <- .jeu()
  tags <- lapply(strsplit(m$secteurs, ",", fixed = TRUE), trimws)
  garde <- vapply(tags, function(t) "tous" %in% t || secteur %in% t, logical(1))
  .ligne(m[garde, , drop = FALSE])
}
