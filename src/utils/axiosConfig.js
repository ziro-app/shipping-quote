require('dotenv').config();

const TOKEN = process.env.TOKEN

module.exports = ({
	headers: {
        "Authorization": TOKEN,
        "Content-Type": "application/json",
        "Accept": "application/json",
},
})
