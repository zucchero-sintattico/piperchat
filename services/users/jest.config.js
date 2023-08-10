module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	coveragePathIgnorePatterns: ["/node_modules/"],
	testTimeout: 60000,
	testMatch: ["**/test/**/*.test.ts"],
};
