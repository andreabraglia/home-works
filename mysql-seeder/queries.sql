INSERT INTO Classi
    VALUES
        ("1A"),
        ("2A"),
        ("3A"),
        ("4A"),
        ("5A");

INSERT INTO Studenti
      VALUES
          ("1A", "Dariana", "Wunsch"),
          ("2A", "Kiara", "Walker"),
          ("3A", "Tamara", "Kuhic"),
          ("4A", "Jordyn", "Kessler"),
          ("5A", "Lisette", "Schuppe"),
          ("1A", "Ari", "Kris"),
          ("2A", "Carlee", "Dare");

INSERT INTO Materie
    VALUES
        ("ENG", "Inglese"),
        ("ITA", "Italiano"),
        ("LAT", "Latino"),
        ("FIL", "Filosofia"),
        ("STO", "Storia");

INSERT INTO Docenti
    VALUES
        ("Sandrine", "Kunze", DEFAULT),
        ("Jermain", "Wyman", DEFAULT),
        ("Fatima", "Wilkinson", DEFAULT),
        ("Edna", "Gulgowski", DEFAULT),
        ("Caroline", "Schowalter", DEFAULT);

INSERT INTO Insegnamenti
    VALUES
        ("4", "ITA"),
        ("1", "LAT"),
        ("2", "ITA"),
        ("0", "ITA"),
        ("2", "ITA"),
        ("2", "STO"),
        ("1", "ITA"),
        ("4", "FIL");

INSERT INTO Valutazioni
    VALUES
        ("1A", "Dariana", "FIL", "2017-12-12", 3),
        ("2A", "Kiara", "ITA", "2000-02-18", 4),
        ("3A", "Tamara", "LAT", "2013-07-14", 1),
        ("4A", "Jordyn", "STO", "2001-08-21", 0),
        ("5A", "Lisette", "LAT", "2020-03-29", 4),
        ("1A", "Ari", "ENG", "2001-04-02", 5),
        ("2A", "Carlee", "ITA", "2016-02-20", 8);