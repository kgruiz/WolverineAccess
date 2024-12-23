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

export function RenderClassSchedule(uniqName, viewType, selectedDays) {
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
                    RenderCalendarView(schedule, scheduleViewContainer, selectedDays);
                } else {
                    console.error(`Invalid view type "${viewType}"`);
                }

            } else {
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
    scheduleViewContainer.style.width = '85%';
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

function RenderCalendarView(schedule, scheduleViewContainer, selectedDays) {
    // Set styles specific to calendar view
    scheduleViewContainer.style.width = '85%';      // Adjust as needed
    scheduleViewContainer.style.display = 'block';  // Ensure block display

    // Configuration Variables
    const tempStartTime = getSelectedStartTime();
    const tempEndTime = getSelectedEndTime();
    const interval = 30;          // 30 minutes
    const calendarHeight = 700;   // Fixed calendar height in pixels
    const timeColumnWidth = 100;  // Fixed width for the time column in pixels


    const startTime = tempStartTime.replace(/\s+/g, '');
    const endTime = tempEndTime.replace(/\s+/g, '');

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
            const splitResult = section.days_and_times.trim().match(
                /^([A-Za-z]+)\s+(\d{1,2}:\d{2}(?:AM|PM))\s*[-–—]\s*(\d{1,2}:\d{2}(?:AM|PM))$/i);
            if (!splitResult) {
                console.error(
                    `Invalid days_and_times format: "${section.days_and_times}"`);
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
                    section.days_and_times}"`);
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

export function initializeTimeSpinners(RenderClassSchedule) {

    function initializeStartTimeSpinner() {
        // Initialize elements and variables
        let startTimeSpinnerBox = document.getElementById('start-time-spinner-box');

        // Create options representing times from 12:00 AM to 11:30 PM in 30-minute
        // increments
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                let period = hour < 12 ? 'AM' : 'PM';
                let displayHour = hour % 12 === 0 ? 12 : hour % 12;
                let timeString = `${String(displayHour).padStart(2, '0')}:${
                    String(minute).padStart(2, '0')} ${period}`;
                let span = document.createElement('span');
                span.textContent = timeString;
                startTimeSpinnerBox.appendChild(span);
            }
        }

        let startTimeNumbers = startTimeSpinnerBox.getElementsByTagName('span');
        let startTimesIndex = 0;

        for (let i = 0; i < startTimeNumbers.length; i++) {
            startTimeNumbers[i].style.display = 'none';
        }

        let eightAM = Array.from(startTimeNumbers)
                          .findIndex(span => span.textContent === '08:00 AM');

        eightAM = eightAM !== -1 ? eightAM : 0;


        startTimesIndex = eightAM;

        startTimeNumbers[startTimesIndex].style.display = 'initial';

        // Function to show the next number
        function nextStartTimeNum() {
            startTimeNumbers[startTimesIndex].style.display = 'none';
            // Check if we're at the end of the list
            if (startTimesIndex < startTimeNumbers.length - 1) {
                startTimesIndex++;
                startTimeNumbers[startTimesIndex].style.display = 'initial';
                updateEndTime(startTimeNumbers[startTimesIndex].textContent,
                              startTimesIndex);
                // Re-render the calendar
                const selectedRadio =
                    document.querySelector('input[name="schedule-view"]:checked');
                const viewType = selectedRadio ? selectedRadio.value : 'list';
                const selectedCheckboxes =
                    document.querySelectorAll('input[name="schedule-day"]:checked');
                let selectedDays =
                    Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
                if (selectedDays.length === 0) {
                    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                    selectedDays = days.map(day => {
                        const checkbox = document.getElementById(`day-${day}`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                        return day.charAt(0).toUpperCase() + day.slice(1);
                    });
                }
                RenderClassSchedule('kgruiz', viewType, selectedDays)
            } else {
                startTimeNumbers[startTimesIndex].style.display = 'initial';
            }
        }

        // Function to show the previous number
        function prevStartTimeNum() {
            startTimeNumbers[startTimesIndex].style.display = 'none';
            // Check if we're at the beginning of the list
            if (startTimesIndex > 0) {
                startTimesIndex--;
                startTimeNumbers[startTimesIndex].style.display = 'initial';
                updateEndTime(startTimeNumbers[startTimesIndex].textContent,
                              startTimesIndex);
                // Re-render the calendar
                const selectedRadio =
                    document.querySelector('input[name="schedule-view"]:checked');
                const viewType = selectedRadio ? selectedRadio.value : 'list';
                const selectedCheckboxes =
                    document.querySelectorAll('input[name="schedule-day"]:checked');
                let selectedDays =
                    Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
                if (selectedDays.length === 0) {
                    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                    selectedDays = days.map(day => {
                        const checkbox = document.getElementById(`day-${day}`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                        return day.charAt(0).toUpperCase() + day.slice(1);
                    });
                }
                RenderClassSchedule('kgruiz', viewType, selectedDays)
            } else {
                startTimeNumbers[startTimesIndex].style.display = 'initial';
            }
        }

        let nextTimeoutId = null;
        let prevTimeoutId = null;

        const nextButton = document.querySelector('.start-time-spinner-next');
        const prevButton = document.querySelector('.start-time-spinner-prev');

        // Function to handle the continuous next button
        function handleNextStart() {
            nextStartTimeNum();
            nextTimeoutId = setTimeout(function continuousNext() {
                nextStartTimeNum();
                nextTimeoutId = setTimeout(continuousNext, 100);
            }, 300)
        }

        // Function to handle the continuous previous button
        function handlePrevStart() {
            prevStartTimeNum();
            prevTimeoutId = setTimeout(function continuousPrev() {
                prevStartTimeNum();
                prevTimeoutId = setTimeout(continuousPrev, 100)
            }, 300);
        }

        function handleStop() {
            clearTimeout(nextTimeoutId);
            clearTimeout(prevTimeoutId);
        }

        // Attach event listeners for the spinner buttons
        nextButton.addEventListener('mousedown', handleNextStart);
        prevButton.addEventListener('mousedown', handlePrevStart);
        nextButton.addEventListener('mouseup', handleStop);
        prevButton.addEventListener('mouseup', handleStop);
        nextButton.addEventListener('mouseleave', handleStop);
        prevButton.addEventListener('mouseleave', handleStop);


        // Prevent selection of number when clicking buttons
        startTimeSpinnerBox.addEventListener('mousedown', function(e) {
            e.preventDefault();
        });

        return {
            getStartIndex: () => startTimesIndex, setStartIndex: (index) => {
                if (index >= 0 && index < startTimeNumbers.length) {
                    for (let i = 0; i < startTimeNumbers.length; i++) {
                        startTimeNumbers[i].style.display = 'none';
                    }
                    startTimesIndex = index;
                    startTimeNumbers[startTimesIndex].style.display = 'initial';
                }
            }
        }
    }

    function initializeEndTimeSpinner() {
        // Initialize elements and variables
        let endTimeSpinnerBox = document.getElementById('end-time-spinner-box');

        // Create options representing times from 12:00 AM to 11:30 PM in 30-minute
        // increments
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                let period = hour < 12 ? 'AM' : 'PM';
                let displayHour = hour % 12 === 0 ? 12 : hour % 12;
                let timeString = `${String(displayHour).padStart(2, '0')}:${
                    String(minute).padStart(2, '0')} ${period}`;
                let span = document.createElement('span');
                span.textContent = timeString;
                endTimeSpinnerBox.appendChild(span);
            }
        }

        let endTimeNumbers = endTimeSpinnerBox.getElementsByTagName('span');
        let endTimesIndex = 0;

        for (let i = 0; i < endTimeNumbers.length; i++) {
            endTimeNumbers[i].style.display = 'none';
        }

        let fivePM =
            Array.from(endTimeNumbers).findIndex(span => span.textContent === '05:00 PM');

        fivePM = fivePM !== -1 ? fivePM : 0;

        endTimesIndex = fivePM;

        endTimeNumbers[endTimesIndex].style.display = 'initial';

        // Function to show the next number
        function nextEndTimeNum() {
            endTimeNumbers[endTimesIndex].style.display = 'none';
            // Check if we're at the end of the list
            if (endTimesIndex < endTimeNumbers.length - 1) {
                endTimesIndex++;
                endTimeNumbers[endTimesIndex].style.display = 'initial';
                updateStartTime(endTimeNumbers[endTimesIndex].textContent, endTimesIndex);
                // Re-render the calendar
                const selectedRadio =
                    document.querySelector('input[name="schedule-view"]:checked');
                const viewType = selectedRadio ? selectedRadio.value : 'list';
                const selectedCheckboxes =
                    document.querySelectorAll('input[name="schedule-day"]:checked');
                let selectedDays =
                    Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
                if (selectedDays.length === 0) {
                    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                    selectedDays = days.map(day => {
                        const checkbox = document.getElementById(`day-${day}`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                        return day.charAt(0).toUpperCase() + day.slice(1);
                    });
                }
                RenderClassSchedule('kgruiz', viewType, selectedDays)
            } else {
                endTimeNumbers[endTimesIndex].style.display = 'initial';
            }
        }

        // Function to show the previous number
        function prevEndTimeNum() {
            endTimeNumbers[endTimesIndex].style.display = 'none';
            // Check if we're at the beginning of the list
            if (endTimesIndex > 0) {
                endTimesIndex--;
                endTimeNumbers[endTimesIndex].style.display = 'initial';
                updateStartTime(endTimeNumbers[endTimesIndex].textContent, endTimesIndex);
                // Re-render the calendar
                const selectedRadio =
                    document.querySelector('input[name="schedule-view"]:checked');
                const viewType = selectedRadio ? selectedRadio.value : 'list';
                const selectedCheckboxes =
                    document.querySelectorAll('input[name="schedule-day"]:checked');
                let selectedDays =
                    Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
                if (selectedDays.length === 0) {
                    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                    selectedDays = days.map(day => {
                        const checkbox = document.getElementById(`day-${day}`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                        return day.charAt(0).toUpperCase() + day.slice(1);
                    });
                }
                RenderClassSchedule('kgruiz', viewType, selectedDays)
            } else {
                endTimeNumbers[endTimesIndex].style.display = 'initial';
            }
        }

        let nextTimeoutId = null;
        let prevTimeoutId = null;

        const nextButton = document.querySelector('.end-time-spinner-next');
        const prevButton = document.querySelector('.end-time-spinner-prev');

        // Function to handle the continuous next button
        function handleNextEnd() {
            nextEndTimeNum();
            nextTimeoutId = setTimeout(function continuousNext() {
                nextEndTimeNum();
                nextTimeoutId = setTimeout(continuousNext, 100);
            }, 300)
        }

        // Function to handle the continuous previous button
        function handlePrevEnd() {
            prevEndTimeNum();
            prevTimeoutId = setTimeout(function continuousPrev() {
                prevEndTimeNum();
                prevTimeoutId = setTimeout(continuousPrev, 100)
            }, 300);
        }

        function handleStop() {
            clearTimeout(nextTimeoutId);
            clearTimeout(prevTimeoutId);
        }

        // Attach event listeners for the spinner buttons
        nextButton.addEventListener('mousedown', handleNextEnd);
        prevButton.addEventListener('mousedown', handlePrevEnd);
        nextButton.addEventListener('mouseup', handleStop);
        prevButton.addEventListener('mouseup', handleStop);
        nextButton.addEventListener('mouseleave', handleStop);
        prevButton.addEventListener('mouseleave', handleStop);


        // Prevent selection of number when clicking buttons
        endTimeSpinnerBox.addEventListener('mousedown', function(e) {
            e.preventDefault();
        });

        return {
            getEndIndex: () => endTimesIndex, setEndIndex: (index) => {
                if (index >= 0 && index < endTimeNumbers.length) {
                    for (let i = 0; i < endTimeNumbers.length; i++) {
                        endTimeNumbers[i].style.display = 'none';
                    }
                    endTimesIndex = index;
                    endTimeNumbers[endTimesIndex].style.display = 'initial';
                }
            }
        }
    }

    const startTimeSpinner = initializeStartTimeSpinner();
    const endTimeSpinner = initializeEndTimeSpinner();

    function updateEndTime(startTime, startIndex) {
        const currentEnd = getSelectedEndTime();

        const [startHour, startMinute] = startTime.split(':');
        const startPeriod = startTime.slice(-2);
        const startHour24 = startPeriod === 'PM' && startHour !== '12' ?
                                parseInt(startHour) + 12 :
                                parseInt(startHour);
        const startMinuteInt = parseInt(startMinute.slice(0, 2));

        const [endHour, endMinute] = currentEnd.split(':');
        const endPeriod = currentEnd.slice(-2);
        let endHour24 = endPeriod === 'PM' && endHour !== '12' ? parseInt(endHour) + 12 :
                                                                 parseInt(endHour);
        let endMinuteInt = parseInt(endMinute.slice(0, 2));

        if (endHour24 < startHour24 ||
            (endHour24 === startHour24 && endMinuteInt <= startMinuteInt)) {
            const endTimeSpinnerBox = document.getElementById('end-time-spinner-box');
            const endTimeNumbers = endTimeSpinnerBox.getElementsByTagName('span');
            let newEndTimesIndex = endTimeSpinner.getEndIndex();

            if (newEndTimesIndex < endTimeNumbers.length - 1) {
                newEndTimesIndex++;
            }

            for (let i = 0; i < endTimeNumbers.length; i++) {
                endTimeNumbers[i].style.display = 'none';
            }

            endTimeNumbers[newEndTimesIndex].style.display = 'initial';
            endTimeSpinner.setEndIndex(newEndTimesIndex);
        }
    }

    function updateStartTime(endTime, endIndex) {
        const currentStart = getSelectedStartTime();

        const [endHour, endMinute] = endTime.split(':');
        const endPeriod = endTime.slice(-2);
        const endHour24 = endPeriod === 'PM' && endHour !== '12' ?
                              parseInt(endHour) + 12 :
                              parseInt(endHour);
        const endMinuteInt = parseInt(endMinute.slice(0, 2));

        const [startHour, startMinute] = currentStart.split(':');
        const startPeriod = currentStart.slice(-2);
        let startHour24 = startPeriod === 'PM' && startHour !== '12' ?
                              parseInt(startHour) + 12 :
                              parseInt(startHour);
        let startMinuteInt = parseInt(startMinute.slice(0, 2));

        if (startHour24 > endHour24 ||
            (startHour24 === endHour24 && startMinuteInt >= endMinuteInt)) {
            const startTimeSpinnerBox = document.getElementById('start-time-spinner-box');
            const startTimeNumbers = startTimeSpinnerBox.getElementsByTagName('span');
            let newStartTimesIndex = startTimeSpinner.getStartIndex()

            if (newStartTimesIndex > 0) {
                newStartTimesIndex--;
            }

            for (let i = 0; i < startTimeNumbers.length; i++) {
                startTimeNumbers[i].style.display = 'none';
            }

            startTimeNumbers[newStartTimesIndex].style.display = 'initial';
            startTimeSpinner.setStartIndex(newStartTimesIndex);
        }
    }

    function getSelectedStartTime() {
        const startTimeSpinnerBox = document.getElementById('start-time-spinner-box');
        const startTimeNumbers = startTimeSpinnerBox.getElementsByTagName('span');
        const currentIndex = startTimeSpinner.getStartIndex();
        return startTimeNumbers[currentIndex].textContent
    }

    function getSelectedEndTime() {
        const endTimeSpinnerBox = document.getElementById('end-time-spinner-box');
        const endTimeNumbers = endTimeSpinnerBox.getElementsByTagName('span');
        const currentIndex = endTimeSpinner.getEndIndex();
        return endTimeNumbers[currentIndex].textContent
    }

    return {
        getSelectedStartTime: () => getSelectedStartTime(),
                              getSelectedEndTime: () => getSelectedEndTime(),
    }
}

// Function to get the currently selected start time from the spinner
export function getSelectedStartTime() {
    const startTimeSpinnerBox = document.getElementById('start-time-spinner-box');
    if (!startTimeSpinnerBox) {
        console.error('Start time spinner box not found.');
        return null;
    }

    const visibleSpan =
        startTimeSpinnerBox.querySelector('span[style*="display: initial"]');
    if (!visibleSpan) {
        console.error('No visible start time span found.');
        return null;
    }
    return visibleSpan.textContent;
}

// Function to get the currently selected end time from the spinner
export function getSelectedEndTime() {
    const endTimeSpinnerBox = document.getElementById('end-time-spinner-box');
    if (!endTimeSpinnerBox) {
        console.error('End time spinner box not found.');
        return null;
    }

    const visibleSpan =
        endTimeSpinnerBox.querySelector('span[style*="display: initial"]');
    if (!visibleSpan) {
        console.error('No visible end time span found.');
        return null;
    }
    return visibleSpan.textContent;
}

export function InitializePrinterFriendlyButton() {
    const printButton = document.querySelector('.printer-friendly-button');

    if (!printButton) {
        console.error('Printer friendly button not found.');
        return;
    }

    printButton.addEventListener('click', () => {
        const scheduleViewContainer = document.querySelector('.schedule-view-container');
        if (!scheduleViewContainer) {
            console.error('Schedule view container not found.');
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            console.error('Failed to open print window.');
            return;
        }

        printWindow.document.write('<html><head><title>Print Schedule</title>');
        printWindow.document.write(`<style>
                body { font-family: sans-serif; margin: 10px; }
                .print-container { width: 90%; max-width: 1000px; margin: 0 auto; }
                h2 { font-size: 1.2em; margin-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 0.9em; word-break: break-word; }
                th { background-color: #f2f2f2; }
                .course-container { margin-bottom: 20px; }

                @media print {
                    body { margin: 0; }
                    .print-container { width: 100%; max-width: none; }
                    .course-container { margin-bottom: 10px; }
                    table { font-size: 0.8em; }
                    h2 { font-size: 1em; margin-bottom: 3px; }
                    th, td { padding: 4px; }
                    .calendar-table { font-size: 0.8em; }

                    tr {
                        page-break-inside: avoid;
                    }
                }
            </style>`);
        printWindow.document.write('</head><body>');
        printWindow.document.write('<div class="print-container">');

        const clonedScheduleView = scheduleViewContainer.cloneNode(true);

        const allCourseContainers =
            clonedScheduleView.querySelectorAll('.course-container');
        if (allCourseContainers.length > 0) {
            allCourseContainers.forEach(container => {
                container.querySelectorAll('table').forEach(table => {
                    table.style.width = '100%';
                });
            });
        }

        const calendarTable = clonedScheduleView.querySelector('.calendar-table');
        if (calendarTable) {
            calendarTable.style.width = '100%';
        }

        printWindow.document.write(clonedScheduleView.innerHTML);
        printWindow.document.write('</div></body></html>');

        printWindow.document.close();

        printWindow.focus();
    });
}
