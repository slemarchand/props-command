require('./rw');

var format = function(path) {
	
	backup(path);

	var data = read(path);

	write(path, data);
};

module.exports = format;
