/**
 * FILE: calendarOptions.js
 * Initializes and manages calendar time spinners.
 */

import {state} from '../constants.js'

import {Class, Section} from './class.js';  // Import Class and Section

export function initializeTimeSpinners(RenderClassSchedule, showTimePostfix) {

    function initializeStartTimeSpinner() {
        // Initialize elements and variables
        let startTimeSpinnerBox = document.getElementById('start-time-spinner-box');

        // Create options representing times from 12:00 AM to 11:30 PM in 30-minute
        // increments
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                let period = hour < 12 ? 'AM' : 'PM';
                let displayHour = hour % 12 === 0 ? 12 : hour % 12;
                let timeString = showTimePostfix ?
                                     `${String(displayHour).padStart(2, '0')}:${
                                         String(minute).padStart(2, '0')} ${period}` :
                                     `${String(hour).padStart(2, '0')}:${
                                         String(minute).padStart(2, '0')}`;
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


        if (showTimePostfix) {
            let eightAM = Array.from(startTimeNumbers)
                              .findIndex(span => span.textContent === '08:00 AM');

            eightAM = eightAM !== -1 ? eightAM : 0;


            startTimesIndex = eightAM;
        } else {

            let eightAM = Array.from(startTimeNumbers)
                              .findIndex(span => span.textContent === '08:00');

            eightAM = eightAM !== -1 ? eightAM : 0;


            startTimesIndex = eightAM;
        }

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

                const toggleTimePostfix = document.getElementById('toggleTimePostfix');
                const toggleClassTitle = document.getElementById('toggleClassTitle');
                const toggleInstructor = document.getElementById('toggleInstructor');
                const toggleLocation = document.getElementById('toggleLocation');
                const toggleShowTime = document.getElementById('toggleShowTime');

                const showTimePostfix = toggleTimePostfix.checked;
                const showClassTitle = toggleClassTitle.checked;
                const showInstructor = toggleInstructor.checked;
                const showLocation = toggleLocation.checked;
                const showTime = toggleShowTime.checked;

                RenderClassSchedule('kgruiz', viewType, selectedDays, showTimePostfix,
                                    showClassTitle, showInstructor, showLocation,
                                    showTime, state.classSchedules);
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

                const toggleTimePostfix = document.getElementById('toggleTimePostfix');
                const toggleClassTitle = document.getElementById('toggleClassTitle');
                const toggleInstructor = document.getElementById('toggleInstructor');
                const toggleLocation = document.getElementById('toggleLocation');
                const toggleShowTime = document.getElementById('toggleShowTime');

                const showTimePostfix = toggleTimePostfix.checked;
                const showClassTitle = toggleClassTitle.checked;
                const showInstructor = toggleInstructor.checked;
                const showLocation = toggleLocation.checked;
                const showTime = toggleShowTime.checked;

                RenderClassSchedule('kgruiz', viewType, selectedDays, showTimePostfix,
                                    showClassTitle, showInstructor, showLocation,
                                    showTime, state.classSchedules);
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
                let timeString = showTimePostfix ?
                                     `${String(displayHour).padStart(2, '0')}:${
                                         String(minute).padStart(2, '0')} ${period}` :
                                     `${String(hour).padStart(2, '0')}:${
                                         String(minute).padStart(2, '0')}`;
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

        if (showTimePostfix) {
            let fivePM = Array.from(endTimeNumbers)
                             .findIndex(span => span.textContent === '05:00 PM');

            fivePM = fivePM !== -1 ? fivePM : 0;

            endTimesIndex = fivePM;
        } else {
            let fivePM = Array.from(endTimeNumbers)
                             .findIndex(span => span.textContent === '17:00');

            fivePM = fivePM !== -1 ? fivePM : 0;

            endTimesIndex = fivePM;
        }

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

                const toggleTimePostfix = document.getElementById('toggleTimePostfix');
                const toggleClassTitle = document.getElementById('toggleClassTitle');
                const toggleInstructor = document.getElementById('toggleInstructor');
                const toggleLocation = document.getElementById('toggleLocation');
                const toggleShowTime = document.getElementById('toggleShowTime');

                const showTimePostfix = toggleTimePostfix.checked;
                const showClassTitle = toggleClassTitle.checked;
                const showInstructor = toggleInstructor.checked;
                const showLocation = toggleLocation.checked;
                const showTime = toggleShowTime.checked;

                RenderClassSchedule('kgruiz', viewType, selectedDays, showTimePostfix,
                                    showClassTitle, showInstructor, showLocation,
                                    showTime, state.classSchedules);
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

                const toggleTimePostfix = document.getElementById('toggleTimePostfix');
                const toggleClassTitle = document.getElementById('toggleClassTitle');
                const toggleInstructor = document.getElementById('toggleInstructor');
                const toggleLocation = document.getElementById('toggleLocation');
                const toggleShowTime = document.getElementById('toggleShowTime');

                const showTimePostfix = toggleTimePostfix.checked;
                const showClassTitle = toggleClassTitle.checked;
                const showInstructor = toggleInstructor.checked;
                const showLocation = toggleLocation.checked;
                const showTime = toggleShowTime.checked;

                RenderClassSchedule('kgruiz', viewType, selectedDays, showTimePostfix,
                                    showClassTitle, showInstructor, showLocation,
                                    showTime, state.classSchedules);
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