/**
 * FILE: table.js
 * Renders the schedule in a table view.
 */

import {FormatTime} from '../formatTime.js';

export function RenderTableView(schedule, scheduleViewContainer, showTimePostfix,
                                showClassTitle, showInstructor, showLocation, showTime,
                                showEnrolled, showWaitlisted) {
    // Set styles specific to table view
    scheduleViewContainer.style.width = '85%';
    scheduleViewContainer.style.display = 'block';  // Ensure block display

    // Create a table to display the schedule
    const table = document.createElement('table');
    table.classList.add('class-schedule-table');  // Add a class for styling
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = generateTableHeader(showTime, showLocation, showInstructor);
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');

    schedule.courses.forEach((course) => {
        course.sections.forEach((section) => {
            if ((showEnrolled && course.status === 'Enrolled') ||
                (showWaitlisted && course.status === 'Waitlisted')) {
                const row = document.createElement('tr');
                row.innerHTML =
                    generateTableRow(course, section, showTimePostfix, showClassTitle,
                                     showTime, showLocation, showInstructor);
                tableBody.appendChild(row);
            }
        });
    });
    table.appendChild(tableBody);
    scheduleViewContainer.appendChild(table);
}

function generateTableHeader(showTime, showLocation, showInstructor) {
    let headers = `<tr>
            <th>Course</th>
            <th>Status</th>
            <th>Units</th>
            <th>Grading</th>
            <th>Section</th>
            <th>Instruction Mode</th>
        `;
    headers += showTime ? `<th>Days and Times</th>` : `<th>Days</th>`;
    if (showLocation)
        headers += `<th>Room</th>`;
    if (showInstructor)
        headers += `<th>Instructor</th>`;
    headers += `<th>Start/End Date</th></tr>`;
    return headers;
}

function generateTableRow(course, section, showTimePostfix, showClassTitle, showTime,
                          showLocation, showInstructor) {
    const {days, timeStr} = parseSectionTimes(section.daysAndTimes, showTimePostfix);
    return `
        <td>${showClassTitle ? course.course : course.course.split('-')[0]}</td>
        <td>${course.status}</td>
        <td>${course.units}</td>
        <td>${course.grading}</td>
        <td>${section.sectionNum}</td>
        <td>${section.instructionMode}</td>
        <td>${showTime ? `${days} ${timeStr}` : days}</td>
        ${showLocation ? `<td>${section.room}</td>` : ''}
        ${showInstructor ? `<td>${section.instructor}</td>` : ''}
        <td>${section.startEndDate}</td>
    `;
}

function parseSectionTimes(daysAndTimes, showTimePostfix) {
    const [days, ...timeParts] = daysAndTimes.split(' ');
    const times =
        timeParts.join(' ').split('-').map(time => FormatTime(time, showTimePostfix));

    if (times.length < 2) {
        console.error('Invalid times length:', times.length);
        return {days, timeStr: ''};
    }

    if (times.length > 2) {
        console.warn('Unexpected times length:', times.length);
    }

    const timeStr = `${times[0]}-${times[1]}`;
    return {days, timeStr};
}
