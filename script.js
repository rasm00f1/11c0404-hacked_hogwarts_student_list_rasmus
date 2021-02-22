"use strict";

window.addEventListener("DOMContentLoaded", init);

const studentList = [];

const filterButtons = document.querySelectorAll(`p[data-action="filter"]`);
const sortButtons = document.querySelectorAll(`button[data-action="sort"]`);

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  img: null,
  house: null,
};

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDirection: "asc",
};

function init() {
  // load JSON
  registerButtons();
  loadJSON("https://petlatkea.dk/2021/hogwarts/students.json", prepareStudentData);
}

function registerButtons() {
  // set eventlisteners
  filterButtons.forEach((button) => {
    button.addEventListener("click", selectFilter);
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", clickSortButton);
  });
}

async function loadJSON(url, callback) {
  const JSONData = await fetch(url);
  const studentData = await JSONData.json();
  console.log(studentData);
  callback(studentData);
}

function prepareStudentData(data) {
  data.forEach((jsonObject) => {
    // Trim the student names, and push each name to the studentList
    const oneStudent = Object.create(Student);
    const trimmedName = jsonObject.fullname.trim();
    const trimmedHouse = jsonObject.house.trim();

    const firstSpace = trimmedName.indexOf(" ");
    const secondSpace = trimmedName.indexOf(" ", firstSpace + 1);

    const firstNameCapitalized = trimmedName.substring(0, 1).toUpperCase() + trimmedName.substring(1, firstSpace).toLowerCase();

    const lastNameCapitalized = trimmedName.substring(secondSpace + 1, secondSpace + 2).toUpperCase() + trimmedName.substring(secondSpace + 2, trimmedName.length).toLowerCase();

    const middleNameCapitalized = trimmedName.substring(firstSpace + 1, firstSpace + 2).toUpperCase() + trimmedName.substring(firstSpace + 2, secondSpace).toLowerCase();

    const lastNameNoMiddleCapitalized = trimmedName.substring(firstSpace + 1, firstSpace + 2).toUpperCase() + trimmedName.substring(firstSpace + 2, trimmedName.length).toLowerCase();

    const houseNameCapitalized = trimmedHouse.substring(0, 1).toUpperCase() + trimmedHouse.substring(1, trimmedHouse.length).toLowerCase();

    const hyphenIndex = trimmedName.indexOf("-");
    const hyphenName = trimmedName.substring(hyphenIndex, hyphenIndex + 2).toUpperCase() + trimmedName.substring(hyphenIndex + 2).toLowerCase();

    if (trimmedName.indexOf('"') !== -1) {
      oneStudent.firstName = firstNameCapitalized;
      oneStudent.middleName = "";
      oneStudent.nickName = trimmedName.substring(firstSpace + 2, secondSpace - 1);
      oneStudent.lastName = lastNameCapitalized;
      oneStudent.img = `${lastNameCapitalized.toLowerCase()}_${trimmedName.substring(0, 1).toLowerCase()}.png`;
      oneStudent.house = houseNameCapitalized;
    } else if (trimmedName.indexOf(" ", firstSpace + 1) == -1) {
      oneStudent.firstName = firstNameCapitalized;
      oneStudent.middleName = "";
      oneStudent.nickName = "";
      oneStudent.lastName = lastNameNoMiddleCapitalized;
      oneStudent.img = `${lastNameNoMiddleCapitalized.toLowerCase()}_${trimmedName.substring(0, 1).toLowerCase()}.png`;
      oneStudent.house = houseNameCapitalized;
    } else if (trimmedName.indexOf(" ", firstSpace + 1) !== -1 && trimmedName.indexOf('"') == -1) {
      oneStudent.firstName = firstNameCapitalized;
      oneStudent.middleName = middleNameCapitalized;
      oneStudent.nickName = "";
      oneStudent.lastName = lastNameCapitalized;
      oneStudent.img = `${lastNameCapitalized.toLowerCase()}_${trimmedName.substring(0, 1).toLowerCase()}.png`;
      oneStudent.house = houseNameCapitalized;
    }
    if (trimmedName.indexOf(" ") == -1) {
      oneStudent.firstName = trimmedName;
      oneStudent.middleName = "";
      oneStudent.lastName = "";
      oneStudent.nickName = "";
      oneStudent.img = "anon.png";
      oneStudent.house = houseNameCapitalized;
    }
    if (hyphenIndex !== -1) {
      oneStudent.lastName = trimmedName.substring(firstSpace + 1, hyphenIndex) + hyphenName;
      oneStudent.img = `${hyphenName.substring(1, hyphenName.length).toLowerCase()}_${trimmedName.substring(0, 1).toLowerCase()}.png`;
    }
    studentList.push(oneStudent);
  });

  const checkForDuplicate = studentList.filter((student) => student.lastName === "Patil");
  console.log(checkForDuplicate);
  checkForDuplicate.forEach((duplicate) => {
    if (checkForDuplicate.length >= 2) {
      duplicate.img = `${duplicate.lastName.toLowerCase()}_${duplicate.firstName.toLowerCase()}.png`;
    }
  });

  displayStudents(studentList);
}

function displayStudents(buildList) {
  const container = document.querySelector("#list");
  const studentTemplate = document.querySelector("template");

  container.innerHTML = "";

  buildList.forEach((oneStudent) => {
    let clone = studentTemplate.cloneNode(true).content;
    clone.querySelector(".student_firstname").textContent += oneStudent.firstName;
    clone.querySelector(".student_lastname").textContent += oneStudent.lastName;
    clone.querySelector(".student_img").src += oneStudent.img;

    container.appendChild(clone);
  });
}

//FILTERING
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);

  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredStudentList) {
  if (settings.filterBy === "gryffindor") {
    filteredStudentList = studentList.filter(isGriffendor);
  } else if (settings.filterBy === "hufflepuff") {
    filteredStudentList = studentList.filter(isHufflepuff);
  } else if (settings.filterBy === "slytherin") {
    filteredStudentList = studentList.filter(isSlytherin);
  } else if (settings.filterBy === "ravenclaw") {
    filteredStudentList = studentList.filter(isRavenclaw);
  } else if (settings.filterBy === "all") {
    filteredStudentList = studentList.filter(isAll);
  }

  return filteredStudentList;
}

function isAll() {
  return true;
}

function isGriffendor(student) {
  return student.house === "Gryffindor";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

//SORTING
function clickSortButton(event) {
  const sortBy = event.target.dataset.sort;
  const sortDirection = event.target.dataset.sortDirection;

  //toggleling the direction
  if (sortDirection === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`User selected: ${sortBy} - ${sortDirection}`);
  setSort(sortBy, sortDirection);
}

function setSort(sortBy, sortDirection) {
  settings.sortBy = sortBy;
  settings.sortDirection = sortDirection;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;

  if (settings.sortDirection === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}

//BUILD THE NEW LIST
function buildList() {
  const currentList = filterList(studentList);
  const sortedList = sortList(currentList);

  displayStudents(sortedList);
}
