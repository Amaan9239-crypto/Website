import Router from 'koa-router'

const router = new Router()

import Accounts from '../modules/accounts.js'
import Addbook from '../modules/addbook.js'
import Borrowbook from '../modules/borrowbook.js'
const dbName = 'website1.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	try {
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		// call the functions in the module
		await account.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		await account.close()
	}
})

router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

router.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	console.log(account);
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		const userData = await  account.login(body.user, body.pass)
		ctx.session.authorised = true;
  console.log("user id in login", userData.id);
		ctx.session.userId = userData.id;
		const referrer = body.referrer || '/secure'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		await account.close()
	}
})


router.get('/bookpage', async ctx => {
	await ctx.render('bookpage', ctx.hbs)
})

router.post('/bookpage', async ctx => {
	const addbook = await new Addbook(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		// call the functions in the module
  console.log("user id ++++++++++", ctx.session);
		await addbook.addBook(ctx.session.userId, ctx.hbs.body.bookName, ctx.request.body.bookAuthor, ctx.request.body.isbnNumber, ctx.request.body.quantity, ctx.request.body.barcode, ctx.request.body.cTime)
		ctx.redirect(`booklist`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('bookpage', ctx.hbs)
	} finally {
		await addbook.close()
	}
})
//borrowpage router
router.post('/borrowpage', async ctx => {
	const addborrow = await new Borrowbook(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		// call the functions in the module
		await addborrow.addBorrow(ctx.request.body.borrowName, ctx.request.body.borrowHash)
		ctx.redirect(`borrowlist`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('borrowpage', ctx.hbs)
	} finally {
		await addborrow.close()
	}
})


router.get('/booklist', async ctx => {

	const addbook = await new Addbook(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		// call the functions in the module
		const bookData = await addbook.getAllBooks(ctx.session.userId)
		console.log("hahahahahahaha: ", bookData)
		await ctx.render('booklist', { bookData : bookData, msg : 'Book saved successfully!' })
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('booklist', ctx.hbs)
	} finally {
		await addbook.close()
	}
})
//borrow list router
router.get('/borrowlist', async ctx => {

	const addborrow = await new Borrowbook(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		// call the functions in the module
		const borrowData = await addborrow.getAllBorrow()
		console.log("hahahahahahaha: ", borrowData)
		await ctx.render('borrowlist', { borrowData : borrowData, msg : 'Borrowed Book saved successfully!' })
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('borrowlist', ctx.hbs)
	} finally {
		await addborrow.close()
	}
})

// router.post('/booklist', async ctx => {
// 	//{ bookData : allBooks, msg : 'Book saved successfully!' }
// 	console.log('IO a here ');
// })



router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})

export default router