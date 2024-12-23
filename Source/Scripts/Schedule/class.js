/**
 * FILE: class.js
 * Defines the Class and Section classes.
 */

export class Section {

    constructor(classNum, instructionMode, sectionNum, component, daysAndTimes, room,
                instructor, startEndDate) {

        this.classNum = classNum;
        this.instructionMode = instructionMode;
        this.sectionNum = sectionNum;
        this.component = component;
        this.daysAndTimes = daysAndTimes;
        this.room = room;
        this.instructor = instructor;
        this.startEndDate = startEndDate;
    }
}

export class Class {

    constructor(course, status, units, grading, sections) {
        this.course = course;
        this.status = status;
        this.units = units;
        this.grading = grading;
        this.sections = sections;
    }
}