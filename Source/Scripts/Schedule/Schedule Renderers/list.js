export function RenderListView(schedule, scheduleViewContainer) {
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
