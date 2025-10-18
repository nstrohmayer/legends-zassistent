// services/geminiService.test.ts

import { fetchNavigatorGuidanceFromGemini } from './geminiService';

// --- Simple Test Runner & Mocks (adapted for async tests) ---
const testResults = { successes: 0, failures: 0 };
const describe = (description: string, fn: () => void) => {
  // This is a simple wrapper for grouping tests.
  // The tests will run sequentially as they are defined.
  console.log(`\n--- ${description} ---`);
  fn();
};

const it = async (description: string, fn: () => Promise<void>) => {
  try {
    await fn(); // Await the async test function
    console.log(`  ✓ ${description}`);
    testResults.successes++;
  } catch (error) {
    console.error(`  ✗ ${description}`);
    console.error(error);
    testResults.failures++;
  }
};

const expect = (actual: any) => ({
  toBe: (expected: any) => {
    if (actual !== expected) {
      throw new Error(`\nExpected: ${JSON.stringify(expected)}\nReceived: ${JSON.stringify(actual)}`);
    }
  },
  toThrow: async (expectedErrorMsg?: string) => {
    let thrownError: Error | null = null;
    try {
      await actual(); // 'actual' is now assumed to be an async function () => Promise<any>
    } catch (e) {
      thrownError = e as Error;
    }
    if (!thrownError) {
      throw new Error('Expected function to throw an error, but it did not.');
    }
    if (expectedErrorMsg && !thrownError.message.includes(expectedErrorMsg)) {
      throw new Error(`\nExpected error message to contain: "${expectedErrorMsg}"\nReceived: "${thrownError.message}"`);
    }
  }
});

// A stand-in for jest.fn() to keep track of calls and mock implementations
const createMockFn = () => {
    const mock = (...args: any[]) => {
        mock.calls.push(args);
        if (mock.implementation) {
            return mock.implementation(...args);
        }
    };
    mock.calls = [] as any[][];
    mock.implementation = (..._args: any[]): any => {};
    mock.mockImplementation = (impl: (...args: any[]) => any) => {
        mock.implementation = impl;
        return mock;
    };
    mock.mockResolvedValue = (value: any) => {
        mock.implementation = () => Promise.resolve(value);
        return mock;
    };
    mock.mockRejectedValue = (error: Error) => {
        mock.implementation = () => Promise.reject(error);
        return mock;
    };
    return mock;
};

// --- Global Mocks ---
let mockFetch: ReturnType<typeof createMockFn>;
const originalFetch = globalThis.fetch;

const setupMocks = () => {
    mockFetch = createMockFn();
    globalThis.fetch = mockFetch as any;
};

const teardownMocks = () => {
    globalThis.fetch = originalFetch;
};

// --- Test Suite ---
describe('Gemini Service Health Check', () => {

    it('should return a useful response on a healthy connection', async () => {
        setupMocks();
        const mockApiResponse = { text: 'A healthy response about {{Pikachu}}.' };
        mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockApiResponse) });

        const response = await fetchNavigatorGuidanceFromGemini('Tell me about Pikachu');
        expect(response).toBe('A healthy response about {{Pikachu}}.');
        teardownMocks();
    });

    it('should throw an error with a specific message if the proxy returns one', async () => {
        setupMocks();
        const mockErrorResponse = { error: 'API key is invalid.' };
        mockFetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve(mockErrorResponse) });
        
        // The code prioritizes the 'error' field from the JSON response, so we test for that.
        await expect(() => fetchNavigatorGuidanceFromGemini('test prompt')).toThrow('API key is invalid.');
        teardownMocks();
    });

    it('should throw a specific error if the proxy itself times out', async () => {
        setupMocks();
        const mockErrorResponse = { error: 'AI request timed out on the server.' };
        mockFetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve(mockErrorResponse) });
        
        await expect(() => fetchNavigatorGuidanceFromGemini('test prompt')).toThrow('AI request timed out on the server.');
        teardownMocks();
    });

    it('should use a fallback error message if the proxy returns a server error without a specific message', async () => {
        setupMocks();
        // No 'error' property in the response
        const mockErrorResponse = { detail: 'Internal server issue' }; 
        mockFetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve(mockErrorResponse) });
        
        await expect(() => fetchNavigatorGuidanceFromGemini('test prompt')).toThrow('Proxy request failed with status 500');
        teardownMocks();
    });

    it('should throw an error if the connection to the proxy fails (network error)', async () => {
        setupMocks();
        mockFetch.mockRejectedValue(new Error('Network request failed'));
        
        await expect(() => fetchNavigatorGuidanceFromGemini('test prompt')).toThrow('Network request failed');
        teardownMocks();
    });

    it('should throw a specific error if the AI response is blocked', async () => {
        setupMocks();
        const mockBlockedResponse = { text: '', promptFeedback: { blockReason: 'SAFETY' } };
        mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockBlockedResponse) });

        await expect(() => fetchNavigatorGuidanceFromGemini('a blocked prompt')).toThrow('Your query was blocked. Reason: SAFETY');
        teardownMocks();
    });

    it('should throw a specific error if the AI response is empty and not blocked', async () => {
        setupMocks();
        const mockEmptyResponse = { text: '', candidates: [{ finishReason: 'STOP' }] };
        mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockEmptyResponse) });

        await expect(() => fetchNavigatorGuidanceFromGemini('an empty prompt')).toThrow('The AI returned an empty response.');
        teardownMocks();
    });
    
    it('should throw a specific error if the AI stops for a reason other than STOP', async () => {
        setupMocks();
        const mockRecitationResponse = { text: '', candidates: [{ finishReason: 'RECITATION' }] };
        mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockRecitationResponse) });

        await expect(() => fetchNavigatorGuidanceFromGemini('a prompt causing recitation')).toThrow('The AI stopped generating a response unexpectedly. Reason: RECITATION');
        teardownMocks();
    });
    
    it('should throw a timeout error when fetch is aborted by the client', async () => {
        setupMocks();
        const abortError = new Error('The operation was aborted.');
        abortError.name = 'AbortError';
        mockFetch.mockRejectedValue(abortError);
        
        // This simulates the AbortController in callGeminiProxy triggering and rejecting the fetch promise
        await expect(() => fetchNavigatorGuidanceFromGemini('a prompt that will time out'))
            .toThrow('The request to the AI took too long and has timed out.');
        teardownMocks();
    });
});

/**
 * To run these tests, execute this file using a TypeScript runner like ts-node:
 * `npx ts-node services/geminiService.test.ts`
 *
 * This will print the test results to the console. It is self-contained and does not require a full test framework like Jest.
 */