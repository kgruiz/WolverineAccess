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

export function RenderClassSchedule(uniqName) {
    const jsonPath = '../../Assets/JSON Files/classSchedules.json';

    ReadClassSchedules(jsonPath)
        .then((schedules) => {
            const schedule = schedules[uniqName];
            const scheduleContainer =
                document.querySelector('.not-implemented-container');

            if (schedule) {
                // Clear the "Not Implemented" content
                scheduleContainer.innerHTML = '';

                // Create a header for the schedule
                const scheduleHeader = document.createElement('h1');
                scheduleHeader.textContent = 'My Class Schedule';
                scheduleContainer.appendChild(scheduleHeader);

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
                scheduleContainer.appendChild(table);


            } else {
                console.warn(`No schedule found for ${uniqName}.`);
                const noScheduleMessage = document.createElement('p');
                noScheduleMessage.textContent = 'No class schedule could be found';
                scheduleContainer.appendChild(noScheduleMessage);
            }
        })
        .catch((error) => {
            console.error(`Failed to render schedule for ${uniqName}:`, error);
        });
}