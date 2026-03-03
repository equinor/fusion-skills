/**
 * Runs a callback while suppressing console output.
 *
 * @param run - Callback to execute with temporary console.log and console.error suppression.
 * @returns Callback return value.
 */
export function withSuppressedConsoleOutput<T>(run: () => T): T {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  console.log = () => undefined;
  console.error = () => undefined;

  try {
    return run();
  } finally {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  }
}
