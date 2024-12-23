export function RenderTableView(schedule, scheduleViewContainer) {
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
