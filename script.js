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
  prefect: false,
  expelled: false,
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
      oneStudent.expelled = false;
      oneStudent.prefect = false;
    } else if (trimmedName.indexOf(" ", firstSpace + 1) == -1) {
      oneStudent.firstName = firstNameCapitalized;
      oneStudent.middleName = "";
      oneStudent.nickName = "";
      oneStudent.lastName = lastNameNoMiddleCapitalized;
      oneStudent.img = `${lastNameNoMiddleCapitalized.toLowerCase()}_${trimmedName.substring(0, 1).toLowerCase()}.png`;
      oneStudent.house = houseNameCapitalized;
      oneStudent.expelled = false;
      oneStudent.prefect = false;
    } else if (trimmedName.indexOf(" ", firstSpace + 1) !== -1 && trimmedName.indexOf('"') == -1) {
      oneStudent.firstName = firstNameCapitalized;
      oneStudent.middleName = middleNameCapitalized;
      oneStudent.nickName = "";
      oneStudent.lastName = lastNameCapitalized;
      oneStudent.img = `${lastNameCapitalized.toLowerCase()}_${trimmedName.substring(0, 1).toLowerCase()}.png`;
      oneStudent.house = houseNameCapitalized;
      oneStudent.expelled = false;
      oneStudent.prefect = false;
    }
    if (trimmedName.indexOf(" ") == -1) {
      oneStudent.firstName = trimmedName;
      oneStudent.middleName = "";
      oneStudent.lastName = "";
      oneStudent.nickName = "";
      oneStudent.img = "anon.png";
      oneStudent.house = houseNameCapitalized;
      oneStudent.expelled = false;
      oneStudent.prefect = false;
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

  buildList(studentList);
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

    if (oneStudent.expelled) {
      clone.querySelector(".student_expelled_list").classList.remove("hide");
    } else {
      clone.querySelector(".student_expelled_list").classList.add("hide");
    }

    if (oneStudent.prefect) {
      clone.querySelector(".student_prefect_list").classList.remove("hide");
    } else {
      clone.querySelector(".student_prefect_list").classList.add("hide");
    }

    clone.querySelector("article").addEventListener("click", () => showDetails(oneStudent));

    container.appendChild(clone);
  });
}

//EXPELLING & PREFECTS
function trophyClicked(selectedAnimal) {
  const animalStatus = checkWinnerStatus(selectedAnimal);
  const winnerArray = allAnimals.filter((arrayObject) => arrayObject.winner);
  const otherWinnerAnimal = winnerArray.filter((animal) => animal.type === selectedAnimal.type).shift();
  console.log(otherWinnerAnimal);

  const checkForSameType = winnerArray.some((arrayObject) => arrayObject.type === selectedAnimal.type);

  console.log(checkForSameType);

  if (animalStatus === true) {
    toggleTrophy(selectedAnimal);
  } else if (checkForSameType === true) {
    removeOther(otherWinnerAnimal);
    console.log("Can't have multiple of the same type as winners");
  } else if (winnerArray.length >= 2) {
    console.log("There are to many winners");
    removeAorB(winnerArray[0], winnerArray[1]);
  } else {
    toggleTrophy(selectedAnimal);
  }

  function removeOther(other) {
    // Ask the use to ignore, or remove 'other'
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

    // show name of winner to remove
    document.querySelector("#remove_other [data-field=winnerOther]").textContent = other.name;

    // If ignore, do nothing
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
    }

    // If remove other:
    function clickRemoveOther() {
      removeWinner(other);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }

  function removeAorB(winnerA, winnerB) {
    //ask the user to ignore, or remove a or b
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", removeA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", removeB);

    // show name on buttons
    document.querySelector("#remove_aorb [data-field=winnerA]").textContent = winnerA.name;
    document.querySelector("#remove_aorb [data-field=winnerB]").textContent = winnerB.name;
    // If ignore, do nothing
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #removea").removeEventListener("click", removeA);
      document.querySelector("#remove_aorb #removeb").removeEventListener("click", removeB);
    }
    //if remove A:
    function removeA() {
      removeWinner(winnerA);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
    //else - if removeB
    function removeB() {
      removeWinner(winnerB);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }

  function removeWinner(winnerAnimal) {
    winnerAnimal.winner = false;
  }

  function makeWinner(currentAnimal) {
    currentAnimal.winner = true;
  }

  buildList();
}

function checkWinnerStatus(animal) {
  return animal.winner;
}

function toggleTrophy(animal) {
  animal.winner = !animal.winner;
  buildList();
}

function expelStudent(student) {
  student.expelled = !student.expelled;
  buildList();
}

//POPUP

function showDetails(oneStudent) {
  document.querySelector(".modal").classList.remove("hide");

  document.querySelector("#details_popup .student_img").src += oneStudent.img;
  document.querySelector("#details_popup .student_firstname").textContent = oneStudent.firstName;
  document.querySelector("#details_popup .student_nickname").textContent = oneStudent.nickName;
  document.querySelector("#details_popup .student_lastname").textContent = oneStudent.lastName;
  document.querySelector("#details_popup .student_house").src += `house_shield_${oneStudent.house.toLowerCase()}.png`;

  if (oneStudent.expelled) {
    document.querySelector(".student_expelled").classList.remove("hide");
  } else {
    document.querySelector(".student_expelled").classList.add("hide");
  }

  document.querySelector("#expel_button").addEventListener("click", expelClicked);
  function expelClicked() {
    expelStudent(oneStudent);
  }

  //winners
  document.querySelector("#prefect_button").addEventListener("click", startTrophyClicked);
  function startTrophyClicked() {
    trophyClicked(oneStudent);
  }

  document.querySelector("#details_popup .closebutton").addEventListener("click", closeDetails);

  function closeDetails() {
    document.querySelector("#details_popup .student_img").src = "images/";
    document.querySelector("#details_popup .student_house").src = "images/";
    document.querySelector("#details_popup .closebutton").removeEventListener("click", closeDetails);
    document.querySelector("#expel_button").removeEventListener("click", expelClicked);
    document.querySelector(".modal").classList.add("hide");
  }
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
