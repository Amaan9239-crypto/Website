/** @module Addbook */

import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'

const saltRounds = 10

/**
 * Accounts
 * ES6 module that handles add book feature
 */

//borrowbook class
class Borrowbook {
	/**
   * Create an account object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS books\
				(id INTEGER PRIMARY KEY AUTOINCREMENT,name text, hash text);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * add a new book
	 * @param {String} borrowName 
	 * @param {String} borrowHash 
	 * @returns {Boolean} returns true if the new user has been added
	 */

	//add borrow function
	async addBorrow(borrowName, borrowHash) {

		let sql = `INSERT INTO borrow(name, hash) VALUES("${borrowName}", "${borrowHash}")`
		await this.db.run(sql)
		return true
	}
	// function to get borrowed data
	async getAllBorrow() {
		//let sql = `SELECT books.*, users.user FROM  books INNER JOIN users ON users.id = books.user_id where books.user_id = "${userId}";`
		let sql = `SELECT borrow.id as borrowid, borrow.name, borrow.hash, books.* FROM  borrow LEFT JOIN books ON borrow.hash = books.barcode`
		const borrowData = await this.db.all(sql)
  		console.log("borrowdatalist: ", borrowData);
		return borrowData;
	}
 
	async close() {
		await this.db.close()
	}
}

export default Borrowbook