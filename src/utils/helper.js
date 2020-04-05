// some utils functions here
exports.inArray = (needle, haystack) => {
	var length = haystack.length;
	for (var i = 0; i < length; i++) {
		if (haystack[i] === needle) return true;
	}
	return false;
};

exports.exists2default = (needle, def) => {
	return needle ? needle : def;
};

exports.uid = () => {
	return (
		"_" +
		Math.random()
			.toString(36)
			.substr(2, 9)
	);
};

exports.removeSpace = str => {
	return str.toString().split(" ").join("");
};

exports.space2dashLow = str => {
	return str.toString().split(" ").join("-").toLowerCase();
}
