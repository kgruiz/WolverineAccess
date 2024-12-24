/**
 * FILE: formatTimes.js
 */

/**
 * Converts a time string between 12-hour and 24-hour formats.
 *
 * @param {string} timeString - The time string to be converted (e.g., "02:30 PM" or
 *     "14:30").
 * @param {boolean} showTimePostfix - If false, converts to 24-hour format; otherwise,
 *     converts to 12-hour format.
 * @returns {string} - The converted time string in the desired format.
 * @throws {Error} - Throws an error if the input format is invalid.
 */
export function FormatTime(timeString, showTimePostfix) {
    if (typeof timeString !== 'string') {
        throw new Error('Invalid input: timeString must be a string.');
    }

    // Trim whitespace and convert to uppercase for consistency
    const trimmedTime = timeString.trim().toUpperCase();

    // Regular expressions to match 12-hour and 24-hour formats
    const twelveHourRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/;
    const twentyFourHourRegex = /^(\d{1,2}):(\d{2})$/;

    let match;
    let hours, minutes, modifier;

    if (showTimePostfix) {
        // Convert to 12-hour format
        match = trimmedTime.match(twentyFourHourRegex);
        if (!match) {
            // Attempt to parse 12-hour format if showTimePostfix is true
            match = trimmedTime.match(twelveHourRegex);
            if (!match) {
                throw new Error(
                    'Invalid time format. Expected "HH:MM" or "HH:MM AM/PM".');
            }
            // If already in 12-hour format and showTimePostfix is true, return as is
            return formatWithPostfix(match[1], match[2], match[3]);
        }

        hours = parseInt(match[1], 10);
        minutes = match[2];

        if (hours < 0 || hours > 23 || minutes < '00' || minutes > '59') {
            throw new Error('Invalid time values.');
        }

        return formatWithPostfix(hours, minutes);
    } else {
        // Convert to 24-hour format
        match = trimmedTime.match(twelveHourRegex);
        if (!match) {
            // Attempt to parse 24-hour format if showTimePostfix is false
            match = trimmedTime.match(twentyFourHourRegex);
            if (!match) {
                throw new Error(
                    'Invalid time format. Expected "HH:MM" or "HH:MM AM/PM".');
            }
            // If already in 24-hour format and showTimePostfix is false, return as is
            // with zero padding
            hours = match[1].padStart(2, '0');
            minutes = match[2];
            return `${hours}:${minutes}`;
        }

        hours = parseInt(match[1], 10);
        minutes = match[2];
        modifier = match[3];

        if (hours < 1 || hours > 12 || minutes < '00' || minutes > '59') {
            throw new Error('Invalid time values.');
        }

        // Convert to 24-hour format
        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }

        const formattedHours = String(hours).padStart(2, '0');
        return `${formattedHours}:${minutes}`;
    }
}

/**
 * Helper function to format time with AM/PM postfix.
 *
 * @param {number|string} hours - The hour component.
 * @param {string} minutes - The minutes component.
 * @param {string} [modifier] - The AM/PM modifier (optional).
 * @returns {string} - Formatted time string in 12-hour format with AM/PM.
 */
function formatWithPostfix(hours, minutes, modifier) {
    if (modifier) {
        // If modifier is provided, return as is with proper formatting
        hours = parseInt(hours, 10);
        if (hours < 1 || hours > 12 || minutes < '00' || minutes > '59') {
            throw new Error('Invalid time values.');
        }
        return `${hours.toString().padStart(2, '0')}:${minutes} ${modifier}`;
    }

    // If modifier is not provided, determine AM or PM based on hours
    if (hours === '00') {
        return `12:${minutes} AM`;
    }

    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}
