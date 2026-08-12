jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    on: jest.fn(),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn(),
  })),
}));

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    quit: jest.fn(),
  }));
});

// Mock Prisma Client
jest.mock('./../config/db', () => {
  return {
    prisma: {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
      $disconnect: jest.fn(),
    },
    connectDB: jest.fn(),
  };
});
