import mysql from "mysql2/promise";

const DEFAULT_CONFIG = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "curso_sql",
};
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const connection = await mysql.createConnection(connectionString);

export class MovieModel {
  static async getAll({ genre }) {
    //console.log("getAll");

    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();

      // get genre ids from database table using genre names
      const [genres] = await connection.query(
        "SELECT id, name FROM midugenre WHERE LOWER(name) = ?;",
        [lowerCaseGenre]
      );

      // no genre found
      if (genres.length === 0) return [];

      // get the id from the first genre result
      const [{ id }] = genres;

      // get all movies ids from database table
      // la query a movie_genres

      const [movies] = await connection.query(
        "SELECT movie_id FROM midu_movie_genre WHERE genre_id = ?;",
        [id]
      );
      // join
      // y devolver resultados..
      return movies;
    }

    const [movies] = await connection.query("SELECT * FROM midumovie;");

    //console.log(movies);
    return movies;
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, id
        FROM midumovie WHERE id = ?;`,
      [id]
    );

    if (movies.length === 0) return null;

    return movies[0];
  }

  static async create({ input }) {
    const {
      genre, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    // todo: crear la conexión de genre

    // crypto.randomUUID()
    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      await connection.query(
        `INSERT INTO midumovie (id, title, year, director, duration, poster, rate)
          VALUES ("${uuid}", ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      );
      for (const g of genre) {
        const [[{ id }]] = await connection.query(
          `SELECT id FROM midugenre WHERE name = ?`,
          [g]
        );

        await connection.query(
          `INSERT INTO midu_movie_genre (movie_id, genre_id) VALUES ("${uuid}", ${id})`
        );
      }
    } catch (e) {
      // puede enviarle información sensible
      throw new Error("Error creating movie");
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, id
        FROM midumovie WHERE id = ?;`,
      [uuid]
    );

    return movies[0];
  }

  static async delete({ id }) {
    // ejercio fácil: crear el delete

    try {
      await connection.query("DELETE FROM midumovie WHERE id = ?;", [id]);

      await connection.query(
        "DELETE FROM midu_movie_genre WHERE movie_id = ?;",
        [id]
      );
    } catch (error) {
      throw new Error("no se pudo eliminar");
    }

    return { message: "movie eliminada" };
  }

  static async update({ id, input }) {
    // ejercicio fácil: crear el update
    const { genre, title, year, duration, director, rate, poster } = input;

    let [movie] = await connection.query(
      "SELECT * FROM midumovie WHERE id = ?;",
      [id]
    );

    movie = movie[0];

    try {
      await connection.query(
        `
        UPDATE midumovie SET title = ?, year = ?, duration = ?,
        director = ?, rate = ?, poster = ? WHERE id = ?;
        `,
        [
          title || movie.title,
          year || movie.year,
          duration || movie.duration,
          director || movie.director,
          rate || movie.rate,
          poster || movie.poster,
          id,
        ]
      );

      if (genre) {
        await connection.query(
          "DELETE FROM midu_movie_genre WHERE movie_id = ?;",
          [id]
        );

        for (const g of genre) {
          const [[{ id: idGenre }]] = await connection.query(
            `SELECT id FROM midugenre WHERE name = ?`,
            [g]
          );

          await connection.query(
            `INSERT INTO midu_movie_genre (movie_id, genre_id) VALUES ("${id}", ${idGenre})`
          );
        }
      }
    } catch (error) {
      throw new Error("Error creating movie");
    }

    const [movieUpdated] = await connection.query(
      "SELECT * FROM midumovie WHERE id = ?",
      [id]
    );

    return movieUpdated;
  }
}
