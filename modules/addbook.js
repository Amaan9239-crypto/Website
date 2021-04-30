
/** @module Addbook */

import sqlite from 'sqlite-async'


/**
 * Accounts
 * ES6 module that handles add book feature
 */
class Addbook {
	/**
   * Create an account object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS books\
(id INTEGER PRIMARY KEY AUTOINCREMENT,\
user_id INTEGER,\
book_name TEXT, book_author TEXT, quantity TEXT, barcode\
TEXT, isbn_number TEXT, create_at INTEGER  CURRENT_TIMESTAMP);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * add a new book
	 * @param {String} userId the logged in user id
	 * @param {String} bookName the bookname
	 * @param {String} bookAuthor the book author
	 * @param {String} isbnNumber the number
	 * @param {String} quantity the number
	 * @param {String} barcode the number
	 * @returns {Boolean} returns true if the new user has been added
	 */

	/*jshint maxparams: 8 */
	/*eslint max-params: [1, 7] */
	async addBook(userId, bookName, bookAuthor, isbnNumber,
		quantity, barcode, cTime) {

		// Array.from(arguments).forEach( val => {
		// 	// if(val.length === 0) throw new Error('missing field')
		// })

		const sql = `INSERT INTO books(user_id, book_name, book_author, 
isbn_number, quantity, barcode, create_at) 
VALUES("${userId}", "${bookName}", "${bookAuthor}", 
"${isbnNumber}", "${quantity}", "${barcode}", "${cTime}" )`
		await this.db.run(sql)
		return true
	}

	async getAllBooks() {
		//let sql = `SELECT books.*, users.user
		//FROM  books INNER JOIN users
		//ON users.id = books.user_id where books.user_id = "${userId}";`
		const sql = 'SELECT books.*, users.user FROM  books LEFT JOIN users ON users.id = books.user_id'
		const bookData = await this.db.all(sql)
		console.log('bookdatalist: ', bookData)
		return bookData
	}

	async close() {
		await this.db.close()
	}
}

export default Addbook
