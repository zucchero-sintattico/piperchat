const jwt = require("jsonwebtoken");
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

readline.question("Username: ", (name) => {
	console.log(name);
	const token = jwt.sign(
		{
			username: name,
		},
		"access",
		{
			expiresIn: "100d",
		}
	);
	console.log(token);
	readline.close();
});
