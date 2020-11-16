import {
  jest, describe, it, expect, beforeAll, afterAll,
} from '@jest/globals';
import { printHelloWorld } from './print-hello-world';

const { info } = console;
const catchInfo = jest.fn();

describe('printHelloWorld', () => {
  beforeAll(() => {
    console.info = catchInfo;
  });

  afterAll(() => {
    console.info = info;
  });

  it('should be defined', () => {
    expect(printHelloWorld).toBeDefined();
  });

  it('should print \'Hello World!\' on console', () => {
    catchInfo.mockImplementationOnce((msg) => {
      expect(msg).toBe('Hello World!');
    });
  });
});
