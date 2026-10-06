test_that("le jeu est complet et trié", {
  expect_equal(nrow(marronniers), 139L)
  expect_equal(names(marronniers), c("date", "date_fin", "libelle", "type", "secteurs", "source", "angle"))
  expect_s3_class(marronniers$date, "Date")
  expect_equal(marronniers$date[1], as.Date("2026-09-14"))
  expect_equal(marronniers$date[139], as.Date("2027-12-31"))
  expect_false(is.unsorted(marronniers$date))
  expect_true(all(marronniers$date_fin >= marronniers$date))
  expect_setequal(unique(marronniers$type), c("ferie", "fete", "commercial", "journee", "vacances", "saison"))
  expect_equal(nrow(marronniers_secteurs), 7L)
  expect_equal(marronniers_secteurs$label[2], "Restauration et métiers de bouche")
})

test_that("marronniers_a_venir garde les périodes en cours", {
  v <- marronniers_a_venir("2026-11-20", n = 3)
  expect_equal(v$libelle, c("Mois sans tabac et Movember",
                            "Journée internationale des droits de l'enfant",
                            "Black Friday"))
  expect_equal(v$date[3], as.Date("2026-11-27"))
  expect_equal(rownames(v), c("1", "2", "3"))
  expect_equal(nrow(marronniers_a_venir(as.Date("2028-01-04"))), 0L)
  expect_equal(nrow(marronniers_a_venir("2026-01-01", n = 0)), 0L)
  expect_error(marronniers_a_venir(c("2026-01-01", "2026-02-01")))
})

test_that("marronniers_mois et marronniers_secteur", {
  mai <- marronniers_mois(2027, 5)
  expect_equal(nrow(mai), 12L)
  expect_true(any(mai$date == as.Date("2027-05-30") & mai$libelle == "Fête des mères"))
  expect_equal(nrow(marronniers_mois(2025, 1)), 0L)
  avril <- marronniers_mois(2027, 4)
  corse <- avril[avril$libelle == "Vacances de Pâques en Corse (jusqu'au 12 avril)", ]
  expect_equal(corse$date_fin, as.Date("2027-04-12"))
  expect_equal(nrow(marronniers_secteur("restauration")), 77L)
  expect_equal(sum(marronniers$type == "ferie"), 14L)
})
