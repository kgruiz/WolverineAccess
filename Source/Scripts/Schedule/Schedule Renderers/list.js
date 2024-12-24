/**
 * FILE: list.js
 * Renders the schedule in a list view.
 */

import {FormatTime} from '../formatTime.js';

export function RenderListView(schedule, scheduleViewContainer, showTimePostfix,
                               showClassTitle, showInstructor, showLocation, showTime,
                               showEnrolled, showWaitlisted) {
    // Set styles specific to list view
    Object.assign(scheduleViewContainer.style, {
        width: '80%',
        display: 'block',
    });

    const fragment = document.createDocumentFragment();

    schedule.courses.forEach((course) => {
        // Create a container for each course
        const courseContainer = document.createElement('div');
        courseContainer.classList.add('course-container');

        // Determine course title
        const courseLabel = showClassTitle ? course.course : course.course.split('-')[0];
        const courseTitle = document.createElement('h2');
        courseTitle.textContent = courseLabel;
        courseTitle.classList.add('course-title');
        courseContainer.appendChild(courseTitle);

        // Add course-level details
        const courseDetailsTable = createCourseDetailsTable(course);
        courseContainer.appendChild(courseDetailsTable);

        // Add sections table
        const sectionsTable = createSectionsTable(course.sections, showTimePostfix,
                                                  showTime, showLocation, showInstructor);
        courseContainer.appendChild(sectionsTable);

        fragment.appendChild(courseContainer);
    });

    scheduleViewContainer.appendChild(fragment);
}

function createCourseDetailsTable(course) {
    const table = document.createElement('table');
    table.classList.add('course-details-table');

    table.innerHTML = `
        <tr>
            <td><strong>Status</strong></td>
            <td>${course.status}</td>
            <td><strong>Units</strong></td>
            <td>${course.units}</td>
            <td><strong>Grading</strong></td>
            <td>${course.grading}</td>
        </tr>
    `;
    return table;
}

function createSectionsTable(sections, showTimePostfix, showTime, showLocation,
                             showInstructor) {
    const table = document.createElement('table');
    table.classList.add('sections-table');

    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = generateTableHeader(showTime, showLocation, showInstructor);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');

    sections.forEach((section) => {
        const row = document.createElement('tr');
        const {days, timeStr} = parseSectionTimes(section.daysAndTimes, showTimePostfix);

        row.innerHTML = `
            <td>${section.classNum}</td>
            <td>${section.instructionMode}</td>
            <td>${section.sectionNum}</td>
            <td>${section.component}</td>
            <td>${showTime ? `${days} ${timeStr}` : days}</td>
            ${showLocation ? `<td>${section.room}</td>` : ''}
            ${showInstructor ? `<td>${section.instructor}</td>` : ''}
            <td>${section.startEndDate}</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}

function generateTableHeader(showTime, showLocation, showInstructor) {
    let headers = `
        <tr>
            <th>Class Nbr</th>
            <th>Instruction Mode</th>
            <th>Section</th>
            <th>Component</th>
    `;

    headers += showTime ? `<th>Days & Times</th>` : `<th>Days</th>`;
    if (showLocation)
        headers += `<th>Room</th>`;
    if (showInstructor)
        headers += `<th>Instructor</th>`;
    headers += `<th>Start / End Date</th></tr>`;

    return headers;
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
