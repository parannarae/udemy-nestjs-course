import { rm } from 'fs/promises';
import { join } from 'path';

// Global beforeEach to be run before any test file
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {} // ignore the error of non-existential file (already cleaned)
});
