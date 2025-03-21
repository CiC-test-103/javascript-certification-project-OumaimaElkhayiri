// Necessary Imports (you will need to use this)
const { Student } = require('./Student')

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    this.head = null;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    const newNode = new Node(newStudent);
    if(!this.head) {
      this.head = this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    if (this.head === null) return;

    if (this.head.data.getEmail() === email) {
      this.head = this.head.next;
      if(this.head === null) {
        this.tail = null;
      } 
      this.length--;
      return;
    }

    let current = this.head;
    while(current.next !== null && current.next.data.getEmail() !== email) {
      current = current.next;
    }

    if (current.next !== null) {
      current.next = current.next.next;
      if(current.next === null) {
        this.tail = current;
      }
      this.length--;
    }
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    let current = this.head;
    while (current) {
      if (current.data.getEmail() === email) return current.data;
      current = current.next;
    }
    return -1;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  clearStudents() {
    this.head = this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    let result = [];
    let current = this.head;
    while (current) {
      result.push(current.data.getName());
      current = current.next;
    }
    return result.join (', ');
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    let studentsArray = [];
    let current = this.head;
    while(current) {
      studentsArray.push(current.data);
      current = current.next;
    }
    return studentsArray.sort((a,b) => a.getName().localCompare(b.getName()));
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    let filteredStudents = [];
    let current = this.head;
    while(current) {
      if (current.data.getSpecialization() === specialization) {
        filteredStudents.push(current.data);
      }
      current = current.next;
    }
    return this.#sortStudentsByName(filteredStudents);
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    let filteredStudents = [];
    let current = this.head;
    while(current) {
      if (new Date().getFullYear - current.data.getYear() >= minAge){
        filteredStudents.push(current.data);
      }
      current = current.next;
    }
    return this.#sortStudentsByName(filteredStudents);
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    const fs = require('fs/promises');
    const studentsArray = [];
    let current = this.head;
    while(current) {
      studentsArray.push({
        name: current.data.getName(),
        year: current.data.getYear(),
        email: current.data.getEmail(),
        specialization: current.data.getSpecialization()
      });
      current = current.next;
    }
    await fs.writeFile(fileName, JSON.stringify(studentsArray, null, 2));
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    const fs = require('fs/promises');
    try {
      const data = await fs.readFile(fileName, 'utf-8');
      const studentsArray = JSON.parse(data);
      this.clearStudents();
      studentsArray.forEach(({name, year, email, specialization}) => {
        this.addStudent(new Student(name, year, email, specialization));
      });
    } catch (error) {
      console.error("Error loading JSON file:", error)
    }
  }

}

module.exports = { LinkedList }
