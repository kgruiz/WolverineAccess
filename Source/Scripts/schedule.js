/**
 * FILE: schedule.js
 */

function ReadClassSchedules(jsonPath) {
    const fileName = jsonPath.split('/').pop();

    return fetch(jsonPath)
        .then((response) => {
            if (!response.ok) {
                console.error(
                    `Failed to load ${fileName}. Make sure it exists at ${jsonPath}.`);
                return [];  // Return an empty array or appropriate fallback
            }
            return response.json();
        })
        .catch((error) => {
            console.error(
                `Error fetching ${fileName}. Make sure it exists at ${jsonPath}.`, error);
            return [];  // Return an empty array or appropriate fallback
        });
}

export function RenderClassSchedule(uniqName, viewType) {
    const jsonPath = '../../Assets/JSON Files/classSchedules.json';

    ReadClassSchedules(jsonPath)
        .then((schedules) => {
            const schedule = schedules[uniqName];
            const scheduleViewContainer =
                document.querySelector('.schedule-view-container');

            if (schedule) {
                // Clear the content and reset styles
                scheduleViewContainer.innerHTML = '';
                resetContainerStyles(scheduleViewContainer);

                // Render the selected view
                if (viewType === 'table') {
                    RenderTableView(schedule, scheduleViewContainer);
                } else if (viewType === 'list') {
                    RenderListView(schedule, scheduleViewContainer);
                } else if (viewType === 'calendar') {
                    RenderCalendarView(schedule, scheduleViewContainer);
                } else {
                    console.error(`Invalid view type "${viewType}"`);
                }

            } else {
                console.warn(`No schedule found for "${uniqName}".`);
                const noScheduleMessage = document.createElement('p');
                noScheduleMessage.textContent = 'No class schedule could be found';
                scheduleViewContainer.appendChild(noScheduleMessage);
            }
        })
        .catch((error) => {
            console.error(`Failed to render schedule for "${uniqName}": ${
                error.message}\nStack trace: ${error.stack}`);
        });
}

// Helper function to reset container styles
function resetContainerStyles(container) {
    container.style.width = '';
    container.style.height = '';
    container.style.padding = '';
    container.style.boxSizing = '';
    container.style.display = '';
    container.style.flexDirection = '';
    container.style.alignItems = '';
    container.style.justifyContent = '';
    container.style.textAlign = '';
    // Add more properties as needed
}

function RenderTableView(schedule, scheduleViewContainer) {
    // Set styles specific to table view
    scheduleViewContainer.style.width = '80%';
    scheduleViewContainer.style.display = 'block';  // Ensure block display

    // Create a table to display the schedule
    const table = document.createElement('table');
    table.classList.add('class-schedule-table');  // Add a class for styling
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `<tr>
            <th>Course</th>
            <th>Status</th>
            <th>Units</th>
            <th>Grading</th>
            <th>Section</th>
            <th>Instruction Mode</th>
            <th>Days and Times</th>
            <th>Room</th>
            <th>Instructor</th>
            <th>Start/End Date</th>
        </tr>`;
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');

    schedule.courses.forEach((course) => {
        course.sections.forEach((section) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.course}</td>
                <td>${course.status}</td>
                <td>${course.units}</td>
                <td>${course.grading}</td>
                <td>${section.section}</td>
                <td>${section.instruction_mode}</td>
                <td>${section.days_and_times}</td>
                <td>${section.room}</td>
                <td>${section.instructor}</td>
                <td>${section.start_end_date}</td>
            `;
            tableBody.appendChild(row);
        });
    });
    table.appendChild(tableBody);
    scheduleViewContainer.appendChild(table);
}

function RenderListView(schedule, scheduleViewContainer) {
    // Set styles specific to list view
    scheduleViewContainer.style.width = '80%';
    scheduleViewContainer.style.display = 'block';  // Ensure block display

    // Loop through courses to display each one
    schedule.courses.forEach((course) => {
        // Create a container for each course
        const courseContainer = document.createElement('div');
        courseContainer.classList.add('course-container');  // Add a class for styling

        // Add course title
        const courseTitle = document.createElement('h2');
        courseTitle.textContent = course.course;
        courseTitle.style.backgroundColor =
            '#f9f9f9';  // Light gray background for course title
        courseTitle.style.padding = '10px';
        courseTitle.style.border = '1px solid #ddd';
        courseTitle.style.borderRadius = '4px';
        courseContainer.appendChild(courseTitle);

        // Add course-level details (Status, Units, Grading)
        const courseDetailsTable = document.createElement('table');
        courseDetailsTable.classList.add('course-details-table');
        courseDetailsTable.style.width = '100%';
        courseDetailsTable.style.marginBottom = '10px';
        courseDetailsTable.style.borderCollapse = 'collapse';

        courseDetailsTable.innerHTML = `
            <tr>
                <td><strong>Status</strong></td>
                <td>${course.status}</td>
                <td><strong>Units</strong></td>
                <td>${course.units}</td>
                <td><strong>Grading</strong></td>
                <td>${course.grading}</td>
            </tr>
        `;
        courseContainer.appendChild(courseDetailsTable);

        // Create a table for the sections
        const sectionsTable = document.createElement('table');
        sectionsTable.classList.add('sections-table');
        sectionsTable.style.width = '100%';
        sectionsTable.style.borderCollapse = 'collapse';
        sectionsTable.style.marginBottom = '20px';

        // Add table header
        const tableHeader = document.createElement('thead');
        tableHeader.innerHTML = `
            <tr>
                <th>Class Nbr</th>
                <th>Instruction Mode</th>
                <th>Section</th>
                <th>Component</th>
                <th>Days & Times</th>
                <th>Room</th>
                <th>Instructor</th>
                <th>Start/End Date</th>
            </tr>
        `;
        sectionsTable.appendChild(tableHeader);

        // Add table body
        const tableBody = document.createElement('tbody');
        course.sections.forEach((section) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${section.class_nbr}</td>
                <td>${section.instruction_mode}</td>
                <td>${section.section}</td>
                <td>${section.component}</td>
                <td>${section.days_and_times}</td>
                <td>${section.room}</td>
                <td>${section.instructor}</td>
                <td>${section.start_end_date}</td>
            `;
            tableBody.appendChild(row);
        });

        sectionsTable.appendChild(tableBody);
        courseContainer.appendChild(sectionsTable);

        // Append the course container to the schedule container
        scheduleViewContainer.appendChild(courseContainer);
    });
}

function RenderCalendarView(schedule, scheduleViewContainer) {
    // Set styles specific to calendar view
    scheduleViewContainer.style.width = '80%';      // Adjust as needed
    scheduleViewContainer.style.display = 'block';  // Ensure block display

    // Configuration Variables
    const startTime = '08:00AM';  // 8 AM
    const endTime = '07:00PM';    // 9 PM
    const interval = 30;          // 30 minutes
    const calendarHeight = 800;   // Fixed calendar height in pixels
    const timeColumnWidth = 100;  // Fixed width for the time column in pixels

    // Days of the week in order
    const daysOfWeek =
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const abbreviatedDays = {
        'Mo': 'Monday',
        'Tu': 'Tuesday',
        'We': 'Wednesday',
        'Th': 'Thursday',
        'Fr': 'Friday',
        'Sa': 'Saturday',
        'Su': 'Sunday'
    };

    // Helper function to parse time strings
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

    // Days headers with calculated widths
    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f2f2f2';
        th.style.width = `calc((100% - ${
            timeColumnWidth}px) / 7)`;  // Distribute remaining width equally
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

        // Day cells
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
            const splitResult = section.days_and_times.trim().match(
                /^([A-Za-z]+)\s+(\d{1,2}:\d{2}(?:AM|PM))\s*[-–—]\s*(\d{1,2}:\d{2}(?:AM|PM))$/i);
            if (!splitResult) {
                console.error(
                    `Invalid days_and_times format: "${section.days_and_times}"`);
                return;
            }

            const [, daysStr, startTimeStr, endTimeStr] = splitResult;

            const days = extractDays(daysStr);
            if (days.length === 0) {
                console.error(`No valid days extracted from: "${daysStr}"`);
                return;
            }

            const startMinutes = parseTime(startTimeStr);
            const endMinutes = parseTime(endTimeStr);

            if (startMinutes === null || endMinutes === null) {
                console.error(`Skipping section due to invalid time format: "${
                    section.days_and_times}"`);
                return;
            }

            const duration = endMinutes - startMinutes;
            const span = duration / interval;

            days.forEach(day => {
                const dayIndex = daysOfWeek.indexOf(day);
                if (dayIndex === -1)
                    return;  // Skip if day is not in the calendar

                // Calculate row index based on start time
                const calendarStartMinutes = parseTime(startTime);
                if (calendarStartMinutes === null) {
                    console.error(`Invalid calendar start time: "${startTime}"`);
                    return;
                }
                const totalStartMinutes = startMinutes - calendarStartMinutes;
                if (totalStartMinutes < 0) {
                    console.warn(`Class starts before calendar start time: "${
                        section.days_and_times}"`);
                    return;
                }
                const rowIndex = Math.floor(totalStartMinutes / interval);

                if (rowIndex < 0 || rowIndex >= timeSlots.length) {
                    console.warn(`Class time is out of calendar range: "${
                        section.days_and_times}"`);
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
                classBlock.textContent = `${course.course} (${section.component})`;

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