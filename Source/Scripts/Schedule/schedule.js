/**
 * FILE: schedule.js
 * Main script for rendering class schedules.
 */

import {RenderCalendarView} from './Schedule Renderers/calendar.js';
import {RenderListView} from './Schedule Renderers/list.js';
import {RenderTableView} from './Schedule Renderers/table.js';

export function RenderClassSchedule(
    uniqName, viewType, selectedDays, showTimePostfix, showClassTitle, showInstructor,
    showLocation, showTime, showEnrolled, showWaitlisted, classSchedules) {

    const schedule = classSchedules[uniqName];
    const scheduleViewContainer = document.querySelector('.schedule-view-container');

    if (schedule) {
        // Clear the content and reset styles
        scheduleViewContainer.innerHTML = '';
        resetContainerStyles(scheduleViewContainer);

        // Render the selected view
        if (viewType === 'table') {
            RenderTableView(schedule, scheduleViewContainer, showTimePostfix,
                            showClassTitle, showInstructor, showLocation, showTime,
                            showEnrolled, showWaitlisted);
        } else if (viewType === 'list') {
            RenderListView(schedule, scheduleViewContainer, showTimePostfix,
                           showClassTitle, showInstructor, showLocation, showTime,
                           showEnrolled, showWaitlisted);
        } else if (viewType === 'calendar') {
            RenderCalendarView(schedule, scheduleViewContainer, selectedDays,
                               showTimePostfix, showClassTitle, showInstructor,
                               showLocation, showTime, showEnrolled, showWaitlisted);
        } else {
            console.error(`Invalid view type "${viewType}"`);
        }

    } else {
        const noScheduleMessage = document.createElement('p');
        noScheduleMessage.textContent = 'No class schedule could be found';
        scheduleViewContainer.appendChild(noScheduleMessage);
    }
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
                .print-container { width: 90%; max-width: 1200px; margin: 0 auto; }
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