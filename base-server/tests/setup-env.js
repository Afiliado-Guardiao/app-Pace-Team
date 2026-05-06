process.env.DATABASE_URL_TEST = "postgresql://postgres:postgres@localhost:5434/pushtime_test";
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key-minimum-32-characters-long-for-testing";
process.env.JWT_EXPIRATION = "7d";
process.env.RATE_LIMIT = "1000";
process.env.RATE_LIMIT_TIMEWINDOW = "60000";
process.env.AUTH_RATE_LIMIT = "1000";
