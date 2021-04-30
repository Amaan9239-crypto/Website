import prodb, { createEle, getData, SortObj } from './module.js'


const db = prodb('Productdb', {
	products: '++id, name, seller, price'
})

// input tags
const userid = document.getElementById('userid')
const proname = document.getElementById('proname')
const seller = document.getElementById('seller')
const price = document.getElementById('price')


// user data

// event listerner for create button

// reset textbox values
//proname.value = "";
//seller.value = "";
// price.value = "";
proname.value = seller.value = price.value = ''

// set id textbox value
getData(db.products, data => {
	userid.value = data.id + 1 || 1
})
table()
const insertmsg = document.querySelector('.insertmsg')
getMsg(insertmsg)


// display message
const updatemsg = document.querySelector('.updatemsg')
getMsg(updatemsg)

proname.value = seller.value = price.value = ''
//console.log(get);


// create dynamic table
/*eslint max-lines-per-function: ["error", {"max": 50, "IIFEs": true}]*/
function table() {
	const tbody = document.getElementById('tbody')
	const notfound = document.getElementById('notfound')
	notfound.textContent = ''
	// remove all childs from the dom first
	while (tbody.hasChildNodes()) {
		tbody.removeChild(tbody.firstChild)
	}

	getData(db.products, (data) => {
		if (data) {
			createEle('tr', tbody, tr => {
				for (const value in data) {
					createEle('td', tr, td => {
						td.textContent = data.price === data[value] ? ` ${data[value]}` : data[value]
					})
				}
				createEle('td', tr, td => {
					createEle('i', td, i => {
						i.className += 'fas fa-edit btnedit'
						i.setAttribute('data-id', data.id)
						// store number of edit buttons
						i.onclick = editbtn
					})
				})
				createEle('td', tr, td => {
					createEle('i', td, i => {
						i.className += 'fas fa-trash-alt btndelete'
						i.setAttribute('data-id', data.id)
						// store number of edit buttons
						i.onclick = deletebtn
					})
				})
			})
		} else {
			notfound.textContent = 'No record found in the database...!'
		}

	})
}

const editbtn = (event) => {
	const id = parseInt(event.target.dataset.id)
	db.products.get(id, (data) => {
		const newdata = SortObj(data)
		userid.value = newdata.id || 0
		proname.value = newdata.name || ''
		seller.value = newdata.seller || ''
		price.value = newdata.price || ''
	})
}

// delete icon remove element
const deletebtn = event => {
	const id = parseInt(event.target.dataset.id)
	db.products.delete(id)
	table()
}

// textbox id


// function msg
function getMsg(flag, element) {
	if (flag) {
		// call msg
		element.className += ' movedown'

		setTimeout(() => {
			element.classList.forEach(classname => {
				classname === 'movedown' ? undefined : element.classList.remove('movedown')
			})

		}, 4000)
	}
}
