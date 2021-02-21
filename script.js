"use strict";

window.addEventListener("DOMContentLoaded", init);

const studentList = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  img: null,
  house: null,
};

function init() {
  // load JSON
  loadJSON("https://petlatkea.dk/2021/hogwarts/students.json", prepareStudentData);
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

    const trimmedLastNameFirstLetter = trimmedName.substring(secondSpace + 1, secondSpace + 2).toUpperCase();
    const trimmedLastNameRest = trimmedName.substring(secondSpace + 2, trimmedName.length).toLowerCase();

    const trimmedMiddleNameFirstLetter = trimmedName.substring(firstSpace + 1, firstSpace + 2).toUpperCase();
    const trimmedMiddleNameRest = trimmedName.substring(firstSpace + 2, secondSpace).toLowerCase();

    const trimmedLastNameNoMiddleFirstLetter = trimmedName.substring(firstSpace + 1, firstSpace + 2).toUpperCase();
    const trimmedLastNameNoMiddleRest = trimmedName.substring(firstSpace + 2, trimmedName.length).toLowerCase();

    const trimmedHouseFirstLetter = trimmedHouse.substring(0, 1).toUpperCase();
    const trimmedHouseRest = trimmedHouse.substring(1, trimmedHouse.length).toLowerCase();

    const hyphenIndex = trimmedName.indexOf("-");
    const hyphenName = trimmedName.substring(hyphenIndex, hyphenIndex + 2).toUpperCase();
    const hyphenNameRest = trimmedName.substring(hyphenIndex + 2).toLowerCase();

    if (trimmedName.indexOf('"') !== -1) {
      oneStudent.firstName = firstNameCapitalized;
      oneStudent.middleName = "";
      oneStudent.nickName = trimmedName.substring(firstSpace + 2, secondSpace - 1);
      oneStudent.lastName = trimmedLastNameFirstLetter + trimmedLastNameRest;
      oneStudent.img = `${trimmedLastNameFirstLetter.toLowerCase()}${trimmedLastNameRest}_${trimmedName.substring(0, 1).toLowerCase()}.png`;
      oneStudent.house = trimmedHouseFirstLetter + trimmedHouseRest;
      studentList.push(oneStudent);
    } else if (trimmedName.indexOf(" ", firstSpace + 1) == -1) {
      oneStudent.firstName = firstNameCapitalized;
      oneStudent.middleName = "";
      oneStudent.nickName = "";
      oneStudent.lastName = trimmedLastNameNoMiddleFirstLetter + trimmedLastNameNoMiddleRest;
      oneStudent.img = `${trimmedLastNameNoMiddleFirstLetter.toLowerCase()}${trimmedLastNameNoMiddleRest}_${trimmedName.substring(0, 1).toLowerCase()}.png`;
      oneStudent.house = trimmedHouseFirstLetter + trimmedHouseRest;
      studentList.push(oneStudent);
    } else if (trimmedName.indexOf(" ", firstSpace + 1) !== -1 && trimmedName.indexOf('"') == -1) {
      oneStudent.firstName = firstNameCapitalized;
      oneStudent.middleName = trimmedMiddleNameFirstLetter + trimmedMiddleNameRest;
      oneStudent.nickName = "";
      oneStudent.lastName = trimmedLastNameFirstLetter + trimmedLastNameRest;
      oneStudent.img = `${trimmedLastNameFirstLetter.toLowerCase()}${trimmedLastNameRest}_${trimmedName.substring(0, 1).toLowerCase()}.png`;
      oneStudent.house = trimmedHouseFirstLetter + trimmedHouseRest;
      studentList.push(oneStudent);
    }
    if (trimmedName.indexOf(" ") == -1) {
      studentList.pop(oneStudent);
      oneStudent.firstName = trimmedName;
      oneStudent.middleName = "";
      oneStudent.lastName = "";
      oneStudent.nickName = "";
      oneStudent.house = trimmedHouseFirstLetter + trimmedHouseRest;
      studentList.push(oneStudent);
    }
    if (hyphenIndex !== -1) {
      studentList.pop(oneStudent);
      oneStudent.lastName = trimmedLastNameNoMiddleFirstLetter + trimmedName.substring(firstSpace + 2, hyphenIndex) + hyphenName + hyphenNameRest;
      oneStudent.img = `${trimmedName.substring(hyphenIndex + 1, hyphenIndex + 2).toLowerCase() + hyphenNameRest}_${trimmedName.substring(0, 1)}.png`;
      studentList.push(oneStudent);
    }
  });

  console.table(studentList);
  displayStudents();
}

function displayStudents() {
  const container = document.querySelector(".list");
  const studentTemplate = document.querySelector("template");

  studentList.forEach((oneStudent) => {
    let clone = studentTemplate.cloneNode(true).content;
    clone.querySelector(".student_firstname").textContent += oneStudent.firstName;
    clone.querySelector(".student_lastname").textContent += oneStudent.lastName;
    clone.querySelector(".student_img").src += oneStudent.img;

    container.appendChild(clone);
  });
}
