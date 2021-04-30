import test from 'ava'
import addbook from '../modules/addbook.js'

test('ADD : error if no data entered', async test => {
	test.plan(1)
	const bookData = await new addbook()
	try {
		await bookData.getAllBooks('')
		 test.fail('error was not thrown')
	}catch(err) {
		test.is(err.message, 'Book was not added')
	} finally {
		bookData.close()
	}
})


test('ADD : error if wrong datatype entered', async test => {
	test.plan(1)
	const bookData = await new addbook()
	try {
		await bookData.GetAllBooks('$$$$$')
		test.fail('error was not thrown')
	}catch(err) {
		test.is(err.message, 'Book was not added')
	} finally {
		bookData.close()
	}
})


