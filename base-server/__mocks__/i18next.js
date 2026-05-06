const mockInstance = {
	t: jest.fn((key, options) => (options && options.defaultValue) || key),
	changeLanguage: jest.fn().mockResolvedValue(undefined),
	cloneInstance: jest.fn(function () {
		return mockInstance;
	}),
	use: jest.fn(function () {
		return this;
	}),
	init: jest.fn().mockResolvedValue(undefined),
};

module.exports = mockInstance;
module.exports.default = mockInstance;
