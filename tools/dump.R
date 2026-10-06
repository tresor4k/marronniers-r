# Contrôle croisé : écrit le jeu installé en JSON pour tools/crosscheck.mjs.
# Usage : Rscript tools/dump.R chemin.json   (paquets marronniers et jsonlite installés)
m <- marronniers::marronniers
m$date <- format(m$date)
m$date_fin <- format(m$date_fin)
names(m)[names(m) == "date_fin"] <- "dateFin"
jsonlite::write_json(list(entries = m, sectors = marronniers::marronniers_secteurs),
                     commandArgs(TRUE)[1], auto_unbox = TRUE)
