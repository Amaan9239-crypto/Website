import Router from 'koa-router'

const router = new Router({ prefix: '/secure' })

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)

router.get('/', async ctx => {
	try {
		await ctx.render('secure', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.get('/search', async ctx => {
	await ctx.render('search', ctx.hbs)
})

router.get('/bookforms', async ctx => {
	await ctx.render('bookforms', ctx.hbs)
})

router.get('/books', async ctx => {
	await ctx.render('books', ctx.hbs)
})

router.get('/checkout', async ctx => {
	await ctx.render('checkout', ctx.hbs)
})

router.get('/bookpage', async ctx => {
	const barcodeNumber = Math.floor(1000 + Math.random() * 9000000000000)
	await ctx.render('bookpage', {barcode: barcodeNumber})
})


router.get('/data', async ctx => {
	await ctx.render('data', ctx.hbs)
})


export default router
