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
                // Clear the content
                scheduleViewContainer.innerHTML = '';



                if (viewType == 'table') {

                    RenderTableView(schedule, scheduleViewContainer);
                } else if (viewType == 'list') {

                    RenderListView(schedule, scheduleViewContainer);
                } else {

                    console.error(`Invalid view type ${viewType}`)
                }



            } else {
                console.warn(`No schedule found for ${uniqName}.`);
                const noScheduleMessage = document.createElement('p');
                noScheduleMessage.textContent = 'No class schedule could be found';
                scheduleViewContainer.appendChild(noScheduleMessage);
            }
        })
        .catch((error) => {
            console.error(`Failed to render schedule for ${uniqName}:`, error);
        });
}

function RenderTableView(schedule, scheduleViewContainer) {

    // Create a table to display the schedule
    const table = document.createElement('table');
    table.classList.add('class-schedule-table');  // Add a class for styling
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML =
        `<tr><th>Course</th><th>Status</th><th>Units</th><th>Grading</th>
              <th>Section</th><th>Instruction Mode</th><th>Days and Times</th><th>Room</th><th>Instructor</th><th>Start/End Date</th>
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
        courseContainer.appendChild(courseTitle);

        // Add course-level details (Status, Units, Grading)
        const courseDetailsTable = document.createElement('table');
        courseDetailsTable.classList.add('course-details-table');
        courseDetailsTable.style.width = '100%';
        courseDetailsTable.style.marginBottom = '10px';

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
                <th style="border: 1px solid #ddd; padding: 8px;">Class Nbr</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Instruction Mode</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Section</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Component</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Days & Times</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Room</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Instructor</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Start/End Date</th>
            </tr>
        `;
        sectionsTable.appendChild(tableHeader);

        // Add table body
        const tableBody = document.createElement('tbody');
        course.sections.forEach((section) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="border: 1px solid #ddd; padding: 8px;">${
                section.class_nbr}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                section.instruction_mode}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${section.section}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                section.component}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                section.days_and_times}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${section.room}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                section.instructor}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                section.start_end_date}</td>
            `;
            tableBody.appendChild(row);
        });

        sectionsTable.appendChild(tableBody);
        courseContainer.appendChild(sectionsTable);

        // Append the course container to the schedule container
        scheduleViewContainer.appendChild(courseContainer);
    });
}
