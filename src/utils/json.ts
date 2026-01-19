type SafeParseJsonResult<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: unknown;
	  };

/**
 * Safely parses a JSON string into a typed object.
 *
 * @template T - The expected type of the parsed data.
 * @param {string} input - The JSON string to parse.
 * @returns {SafeParseJsonResult<T>} A result object indicating success with the parsed data or failure with an error.
 */
export const safeParseJson = <T>(input: string): SafeParseJsonResult<T> => {
	// Try to parse string input to js object
	try {
		return { success: true, data: JSON.parse(input) };
	} catch (error) {
		return {
			success: false,
			error: new Error("Failed to parse json.", { cause: error }),
		};
	}
};
