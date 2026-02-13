/**
 * Centralized error handling utilities
 */

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export class StripeError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'StripeError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Handle API errors consistently
 */
export const handleApiError = (error: any): string => {
  if (error instanceof StripeError) {
    return error.message;
  }

  if (error instanceof NetworkError) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error.response) {
    // API error response
    const apiError = error.response.data;
    return apiError?.message || `Server error: ${error.response.status}`;
  }

  if (error.request) {
    // Request made but no response
    return 'No response from server. Please try again later.';
  }

  // Generic error
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

/**
 * Validate payment amount
 */
export const validatePaymentAmount = (amount: number): { valid: boolean; error?: string } => {
  if (amount <= 0) {
    return { valid: false, error: 'Payment amount must be greater than zero' };
  }

  if (amount < 0.5) {
    return { valid: false, error: 'Minimum payment amount is $0.50' };
  }

  if (amount > 10000) {
    return { valid: false, error: 'Maximum payment amount is $10,000' };
  }

  return { valid: true };
};

/**
 * Validate Stripe account ID
 */
export const validateStripeAccountId = (accountId: string): boolean => {
  return /^acct_[a-zA-Z0-9]+$/.test(accountId);
};
