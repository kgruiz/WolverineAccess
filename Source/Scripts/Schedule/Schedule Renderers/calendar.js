/**
 * FILE: calendar.js
 * Renders the schedule in a calendar view.
 */

import {getSelectedEndTime, getSelectedStartTime} from '../calendarOptions.js';
import {Class, Section} from '../class.js';  // Import Class and Section

export function RenderCalendarView(schedule, scheduleViewContainer, selectedDays,
                                   showTimePostfix, showClassTitle, showInstructor,
                                   showLocation, showTime) {

    // Set styles specific to calendar view
    scheduleViewContainer.style.width = '85%';      // Adjust as needed
    scheduleViewContainer.style.display = 'block';  // Ensure block display

    // Configuration Variables
    let tempStartTime = getSelectedStartTime();
    let tempEndTime = getSelectedEndTime();
    const interval = 30;          // 30 minutes
    const calendarHeight = 700;   // Fixed calendar height in pixels
    const timeColumnWidth = 100;  // Fixed width for the time column in pixels


    tempStartTime = tempStartTime.replace(/\s+/g, '');
    tempEndTime = tempEndTime.replace(/\s+/g, '');

    // Ensure start and end times are always treated as AM/PM before parsing
    const startTime = convertToAmPm(tempStartTime);
    const endTime = convertToAmPm(tempEndTime);

    // Days of the week mapping
    const abbreviatedDays = {
        'Mo': 'Monday',
        'Tu': 'Tuesday',
        'We': 'Wednesday',
        'Th': 'Thursday',
        'Fr': 'Friday',
        'Sa': 'Saturday',
        'Su': 'Sunday'
    };

    const validDays = Object.values(abbreviatedDays);
    const daysOfWeek = selectedDays.filter(day => validDays.includes(day));

    if (daysOfWeek.length === 0) {
        console.error('No valid selectedDays provided.');
        return;
    }

    // Helper function to convert time to AM/PM format if needed
    function convertToAmPm(timeStr) {
        // Check if the time string looks like 24-hour format
        if (/^(\d{1,2}):(\d{2})$/.test(timeStr.trim())) {
            let [hour, minute] = timeStr.trim().split(':').map(Number);
            let meridiem = 'AM'
            if (hour >= 12) {
                meridiem = 'PM';
                if (hour > 12) {
                    hour -= 12;
                }
            }
            if (hour === 0) {
                hour = 12;
            }
            return `${hour}:${String(minute).padStart(2, '0')}${meridiem}`
        }
        // If not 24 hour, assume it's already in AM/PM
        return timeStr.trim();
    }

    // Helper function to parse time strings (always AM/PM)
    function parseTime(timeStr) {
        const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
        if (!match) {
            console.error(`Invalid time format: "${timeStr}"`);
            return null;  // Return null or handle as needed
        }

        let [, hour, minute, meridiem] = match;
        hour = parseInt(hour, 10);
        minute = parseInt(minute, 10);
        meridiem = meridiem.toUpperCase();

        if (meridiem === 'PM' && hour !== 12) {
            hour += 12;
        }
        if (meridiem === 'AM' && hour === 12) {
            hour = 0;
        }

        return hour * 60 + minute;  // Total minutes
    }

    // Helper function to generate time slots
    function generateTimeSlots(start, end, interval) {
        const startMinutes = parseTime(start);
        const endMinutes = parseTime(end);

        if (startMinutes === null || endMinutes === null) {
            console.error('Invalid startTime or endTime');
            return [];
        }

        const slots = [];
        let currentMinutes = startMinutes;

        while (currentMinutes < endMinutes) {
            const hour = Math.floor(currentMinutes / 60);
            const minute = currentMinutes % 60;
            slots.push(`${hour.toString().padStart(2, '0')}:${
                minute.toString().padStart(2, '0')}`);
            currentMinutes += interval;
        }

        return slots;
    }

    // Helper function to extract days from a string like "MoWeFr" or "TuTh"
    function extractDays(daysStr) {
        const dayKeys = Object.keys(abbreviatedDays);
        const days = [];

        let i = 0;
        while (i < daysStr.length) {
            let matched = false;
            for (let key of dayKeys) {
                if (daysStr.startsWith(key, i)) {
                    days.push(abbreviatedDays[key]);
                    i += key.length;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                console.error(
                    `Unknown day abbreviation in "${daysStr}" at position ${i}`);
                break;  // Prevent infinite loop
            }
        }

        return days;
    }

    // Generate time slots
    const timeSlots = generateTimeSlots(startTime, endTime, interval);
    const numberOfSlots = timeSlots.length;
    const cellHeight = calendarHeight / numberOfSlots;

    // Create the calendar table
    const calendarTable = document.createElement('table');
    calendarTable.classList.add('calendar-table');
    calendarTable.style.width = '100%';
    calendarTable.style.height = `${calendarHeight}px`;
    calendarTable.style.tableLayout = 'fixed';  // Ensures fixed column widths

    // Create table header
    const headerRow = document.createElement('tr');

    // Time column header with fixed width
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Time';
    timeHeader.style.border = '1px solid #ddd';
    timeHeader.style.borderRight = '2px solid #00274C';
    timeHeader.style.zIndex = '10000';
    timeHeader.style.padding = '8px';
    timeHeader.style.backgroundColor = '#f9f9f9';
    timeHeader.style.width = `${timeColumnWidth}px`;
    timeHeader.style.textAlign = 'center';
    headerRow.appendChild(timeHeader);

    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f2f2f2';
        th.style.width = `calc((100% - ${timeColumnWidth}px) / ${
            daysOfWeek.length})`;  // Distribute remaining width equally
        th.style.textAlign = 'center';
        headerRow.appendChild(th);
    });

    calendarTable.appendChild(headerRow);

    // Create time slot rows
    timeSlots.forEach((time, index) => {
        const row = document.createElement('tr');

        // Time label cell only for full hours
        const timeCell = document.createElement('td');
        if (time.endsWith(':00')) {
            const [hour, minute] = time.split(':').map(Number);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const displayTime = `${displayHour}:00 ${ampm}`;
            timeCell.textContent = displayTime;
            timeCell.style.fontWeight = 'bold';
        } else {
            timeCell.textContent = '';  // No label for half-hour
        }
        timeCell.style.border = (time.endsWith(':00')) ?
                                    '2px solid #ddd' :
                                    '1px solid #eee';  // Thicker border for hour
        timeCell.style.borderRight = '2px solid #00274C'
        timeCell.style.padding = '8px';
        timeCell.style.zIndex = '10000';
        timeCell.style.height = `${cellHeight}px`;
        timeCell.style.verticalAlign = 'top';
        timeCell.style.width = `${timeColumnWidth}px`;  // Fixed width
        timeCell.style.boxSizing = 'border-box';
        row.appendChild(timeCell);

        for (let i = 0; i < daysOfWeek.length; i++) {
            const cell = document.createElement('td');
            cell.style.borderTop = (time.endsWith(':00')) ?
                                       '2px solid #ddd' :
                                       '1px solid #eee';  // Thicker border for hour
            cell.style.borderBottom = '1px solid #ddd';
            cell.style.padding =
                '0';  // Remove padding to allow class blocks to occupy full cell
            cell.style.position = 'relative';  // For positioning class blocks
            cell.style.height = `${cellHeight}px`;
            row.appendChild(cell);
        }

        calendarTable.appendChild(row);
    });

    scheduleViewContainer.appendChild(calendarTable);

    // Process each course section
    schedule.courses.forEach(course => {
        course.sections.forEach(section => {
            // Correctly split the days and time range using regex to handle different
            // dash types and extra spaces
            const splitResult = section.daysAndTimes.trim().match(
                /^([A-Za-z]+)\s+(\d{1,2}:\d{2}(?:AM|PM))\s*[-–—]\s*(\d{1,2}:\d{2}(?:AM|PM))$/i);
            if (!splitResult) {
                console.error(`Invalid days_and_times format: "${section.daysAndTimes}"`);
                return;
            }

            const [, daysStr, startTimeStr, endTimeStr] = splitResult;

            const days = extractDays(daysStr).filter(day => daysOfWeek.includes(day));
            if (days.length === 0) {
                return;
            }

            const startMinutes = parseTime(startTimeStr);
            const endMinutes = parseTime(endTimeStr);

            if (startMinutes === null || endMinutes === null) {
                console.error(`Skipping section due to invalid time format: "${
                    section.daysAndTimes}"`);
                return;
            }

            const duration = endMinutes - startMinutes;
            const span = duration / interval;

            days.forEach(day => {
                const dayIndex = daysOfWeek.indexOf(day);
                if (dayIndex === -1) {
                    return;  // Skip if day is not in the selected days
                }

                // Calculate row index based on start time
                const calendarStartMinutes = parseTime(startTime);
                if (calendarStartMinutes === null) {
                    console.error(`Invalid calendar start time: "${startTime}"`);
                    return;
                }
                const totalStartMinutes = startMinutes - calendarStartMinutes;
                if (totalStartMinutes < 0) {
                    return;
                }
                const rowIndex = Math.floor(totalStartMinutes / interval);

                if (rowIndex < 0 || rowIndex >= timeSlots.length) {
                    return;  // Out of calendar range
                }

                // Get the specific cell
                const tableRows = calendarTable.rows;
                const targetRow = tableRows[rowIndex + 1];  // +1 to account for header
                if (!targetRow) {
                    console.error(`No target row found for rowIndex ${rowIndex}`);
                    return;
                }
                const targetCell =
                    targetRow.cells[dayIndex + 1];  // +1 to account for time label
                if (!targetCell) {
                    console.error(`No target cell found for dayIndex ${dayIndex}`);
                    return;
                }

                // Create a class block
                const classBlock = document.createElement('div');
                classBlock.classList.add('class-block');
                let classBlockContent = `${course.course} (${section.component})`;

                if (showClassTitle) {
                    classBlockContent = `${course.course} (${section.component})`;
                } else {
                    classBlockContent = `(${section.component})`
                }
                if (showInstructor) {
                    classBlockContent = `${classBlockContent} ${section.instructor}`
                }
                if (showLocation) {
                    classBlockContent = `${classBlockContent} ${section.room}`
                }
                if (showTime) {
                    let newStart = startTimeStr;
                    let newEnd = endTimeStr;
                    if (!showTimePostfix) {
                        const [startHour, startMinute, startMeridiem] =
                            startTimeStr.match(/(\d{1,2}):(\d{2})(AM|PM)/i).slice(1);
                        const [endHour, endMinute, endMeridiem] =
                            endTimeStr.match(/(\d{1,2}):(\d{2})(AM|PM)/i).slice(1);

                        const startHour24 = (startMeridiem.toUpperCase() === 'PM' &&
                                             parseInt(startHour, 10) !== 12) ?
                                                parseInt(startHour, 10) + 12 :
                                            (startMeridiem.toUpperCase() === 'AM' &&
                                             parseInt(startHour, 10) === 12) ?
                                                0 :
                                                parseInt(startHour, 10);
                        const endHour24 = (endMeridiem.toUpperCase() === 'PM' &&
                                           parseInt(endHour, 10) !== 12) ?
                                              parseInt(endHour, 10) + 12 :
                                          (endMeridiem.toUpperCase() === 'AM' &&
                                           parseInt(endHour, 10) === 12) ?
                                              0 :
                                              parseInt(endHour, 10)

                        newStart =
                            `${String(startHour24).padStart(2, '0')}:${startMinute}`;
                        newEnd = `${String(endHour24).padStart(2, '0')}:${endMinute}`;
                    }
                    classBlockContent = `${classBlockContent} ${newStart} - ${newEnd}`
                }
                classBlock.textContent = classBlockContent;

                // Calculate top position within the cell
                const minutesIntoSlot = startMinutes % interval;
                const additionalTop = (minutesIntoSlot / interval) * cellHeight;
                classBlock.style.top = `${additionalTop}px`;

                // Set height based on duration
                classBlock.style.height =
                    `${span * cellHeight - 4}px`;  // Subtracting for borders/margins

                classBlock.style.zIndex = 5000;

                // Append to the cell
                targetCell.appendChild(classBlock);
            });
        });
    });
}