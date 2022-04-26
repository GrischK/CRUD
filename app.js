const express = require("express");
const connection = require("./db-config");
const app = express();
app.use(express.json());

const port = process.env.port || 3000;

connection.connect((err) => {
  if (err) {
    console.log("error connecting");
  } else {
    console.log("connected successfully");
  }
});

app.listen(port, () => console.log("Express server is running"));

// Rechercher une bd par son ID
app.get("/bds13/:id", (req, res) => {
  const { id } = req.params;

  connection
    .promise()
    .query(`SELECT * FROM XIII WHERE id= ?`, [id])

    .then(([result]) => {
      res.json(result);
    })

    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving db");
    });
});

// Faire une recherche personnalisée
app.get("/bds13", (req, res) => {
  const { query } = req.query;
  let sql = "SELECT * FROM XIII";
  const valuesToEscape = [];

  if (query) {
    sql += " WHERE Titre LIKE ?";
    valuesToEscape.push(`%${query}%`);
  }
  console.log(query);

  connection
    .promise()
    .query(sql, valuesToEscape)
    .then(([result]) => {
      res.json(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error retrieving comic");
    });
});

// Ajouter une nouvelle bd
app.post("/bds13", (req, res) => {
  const { Titre, Tome, Année } = req.body;

  connection
    .promise()
    .query(`INSERT INTO XIII (Titre, Tome, Année) VALUES (?, ?, ?)`, [
      Titre,
      Tome,
      Année,
    ])
    .then(([result]) => {
      const createdBd = { id: result.insertId, Titre, Tome, Année };
      res.status(201).json(createdBd);
    })

    .catch((err) => {
      console.error(err);
      res.status(500).send("Error adding new comic");
    });
});

// Modifier une bd
app.put("/bds13/:id", (req, res) => {
  const { Titre, Tome, Année } = req.body;

  connection
    .promise()
    .query(`UPDATE XIII SET ? WHERE id = ?`, [req.body, req.params.id])
    .then(([result]) => {
      const updateBd = `Comic id ${req.params.id} updated with ${req.body}`;
      res.status(200).json(updateBd);
    })

    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating comic");
    });
});

// Effacer une bd
app.delete("/bds13/:id", (req, res) => {
  connection
    .promise()
    .query(`DELETE FROM XIII WHERE id = ?`, [req.params.id])
    .then(([result]) => {
      if (result.affectedRows)
        res.status(204).send(`Comic ${req.params.id} was deleted successfully`);
      else res.sendStatus(404);
    })

    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting comic");
    });
});

// app.post("/bds13", async (req, res)=> {
//   try{
//     const { Titre, Tome, Année } = req.body;

//   }
// })
