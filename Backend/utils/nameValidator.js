/* File: nameValidator.js located src/utils/             */

/**
 * Validates name: must contain only alphabetic characters and be within length range.
 *
 * @param {string} data - User-provided name value.
 * @param {number} min - Minimum allowed length.
 * @param {number} max - Maximum allowed length.
 * @returns {number} - 1 if valid (alphabetic only and within range), 0 if not.
 */

const nameValidator = (data, min, max) => {
    // Check if data is a string
    if (typeof data !== 'string') {
        return 0;
    }

    // Check length
    if (data.length < min || data.length > max) {
        return 0;
    }

    // Check if only alphabetic characters (and spaces allowed)
    const alphabeticRegex = /^[a-zA-Z\s]+$/;
    if (!alphabeticRegex.test(data)) {
        return 0;
    }

    return 1;
};

export default nameValidator;