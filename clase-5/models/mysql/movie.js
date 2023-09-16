import mysql from 'mysql2/promise';

const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'moviesdb',
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();

      // get genre ids from database table using genre names
      const [genres] = await connection.query(
        `SELECT id, name FROM genre WHERE LOWER(name) = ?`,
        [lowerCaseGenre]
      );

      // no genre found
      if (genres.length === 0) return [];

      // get the id from the first genre result
      // const [{id}] = genres;

      // get all movies ids from database table
      // movie_genres query
      // join
      // return results...
      return [];
    }

    const [movies] = await connection.query(
      `SELECT
        BIN_TO_UUID(id) as id,
        title,
        year,
        director,
        duration,
        poster,
        rate
      FROM movie`
    );

    return movies;
  }

  static async getById({ id }) {
    const [rows] = await connection.query(
      `SELECT
        BIN_TO_UUID(id) as id,
        title,
        year,
        director,
        duration,
        poster,
        rate
      FROM movie
      WHERE id = UUID_TO_BIN(?)`,
      [id]
    );

    if (rows.length === 0) return null;
    return rows[0];
  }

  static async create(input) {
    const {
      // genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    const [rows] = await connection.query(`SELECT UUID() as uuid`);
    const [{ uuid }] = rows;

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, duration, director, rate, poster)
          VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`,
        [uuid, title, year, duration, director, rate, poster]
      );
    } catch (error) {
      // it can send private information
      throw new Error('Error creating movie');
      // send stack trace to internal service
      // sendLog(e)
    }

    const [movies] = await connection.query(
      `SELECT
        BIN_TO_UUID(id) as id,
        title,
        year,
        director,
        duration,
        poster,
        rate
      FROM movie
      WHERE id = UUID_TO_BIN(?)`,
      [uuid]
    );

    return movies[0];
  }

  static async delete({ id }) {
    const [rows] = await connection.query(
      `DELETE FROM movie
      WHERE id = UUID_TO_BIN(?)`,
      [id]
    );

    return rows.affectedRows === 1;
  }

  static async update({ id, input }) {
    const {
      // genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    const [rows] = await connection.query(
      `UPDATE movie
      SET title = ?, year = ?, duration = ?, director = ?, rate = ?, poster = ?
      WHERE id = UUID_TO_BIN(?)`,
      [title, year, duration, director, rate, poster, id]
    );

    if (rows.affectedRows === 0) return false;

    const [movies] = await connection.query(
      `SELECT
        BIN_TO_UUID(id) as id,
        title,
        year,
        director,
        duration,
        poster,
        rate
      FROM movie
      WHERE id = UUID_TO_BIN(?)`,
      [id]
    );

    return movies[0];
  }
}
