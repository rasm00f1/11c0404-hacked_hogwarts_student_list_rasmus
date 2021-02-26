"use strict";

window.addEventListener("DOMContentLoaded", init);

function hackTheSystem() {
  if (settings.isHacked === false) {
    settings.isHacked = true;
    const insertMe = {
      firstName: "Rasmus",
      lastName: "Petersen",
      middleName: "",
      nickName: "Fatterhatter",
      img: "petersen_r.png",
      house: "all",
      prefect: false,
      expelled: false,
      inqSquad: false,
      bloodStatus: "muggle",
    };

    document.querySelector("#fatter_hatter").play();
    studentList.push(insertMe);
    buildList();
  } else {
    alert(
      "HAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHA"
    );
  }
}

function hackArray() {
  const insertMe = {
    firstName: "Rasmus",
    lastName: "Petersen",
    middleName: "",
    nickName: "Fatterhatter",
    img: "petersen_r.png",
    house: "all",
    prefect: false,
    expelled: false,
    inqSquad: false,
    bloodStatus: "muggle",
  };

  setInterval(() => {
    if (studentList.length < 100) {
      console.log("working");

      studentList.unshift(insertMe);
      studentList.unshift(insertMe);
      studentList.pop();
      buildList();
    }
  }, 1000);
}

const studentList = [];
const expelledStudentList = [];
let familyData = null;

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
  inqSquad: false,
  bloodStatus: "muggle",
  wasPure: false,
};

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDirection: "asc",
  isHacked: false,
};

function init() {
  // load JSON
  registerButtons();
  loadJSON("https://petlatkea.dk/2021/hogwarts/students.json", prepareStudentData);
}

function registerButtons() {
  // set eventlisteners
  document.querySelector("#search_field").addEventListener("keyup", searchNames);

  filterButtons.forEach((button) => {
    button.addEventListener("click", selectFilter);
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", clickSortButton);
  });

  const inputField = document.querySelector("#search_field");
  inputField.addEventListener("keyup", searchFieldHack);

  function searchFieldHack() {
    if (inputField.value === "hackrid") {
      document.querySelector("#search_field").removeEventListener("keyup", searchFieldHack);
      document.querySelector("body").classList.add("shake");
      hackTheSystem();
    }
  }
}

async function loadJSON(url, callback) {
  const JSONData = await fetch(url);
  const studentData = await JSONData.json();

  const JSONDataFamily = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
  familyData = await JSONDataFamily.json();

  Promise.all([JSONData, JSONDataFamily, studentData, familyData]).then(() => {
    console.log(studentData);
    console.log(familyData);
    callback(studentData);
  });
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
    } else {
      console.log("all good");
    }
  });

  studentList.forEach((student) => {
    for (let i = 0; i < familyData.pure.length; i++) {
      let studentLastName = student.lastName;

      const familyLastNamePure = familyData.pure[i];
      const familyLastNameHalf = familyData.half[i];

      if (studentLastName === familyLastNameHalf) {
        student.bloodStatus = "halfblood";
      } else if (studentLastName === familyLastNamePure && student.bloodStatus != "halfblood") {
        student.bloodStatus = "pure";
        student.wasPure = true;
      }
    }
  });

  buildList(studentList);
}

function displayStudents(buildList) {
  if (settings.isHacked === true) {
    for (let i = 0; i < buildList.length; i++) {
      const currentStudent = buildList[i];
      const decider = Math.round(Math.random());
      if (currentStudent.wasPure === true && decider === 0) {
        currentStudent.bloodStatus = "halfblood";
      } else if (currentStudent.wasPure === true && decider === 1) {
        currentStudent.bloodStatus = "muggle";
      } else {
        currentStudent.bloodStatus = "pure";
      }
    }
  }

  const container = document.querySelector("#list");
  const studentTemplate = document.querySelector("template");

  container.innerHTML = "";

  buildList.forEach((oneStudent) => {
    let clone = studentTemplate.cloneNode(true).content;
    clone.querySelector(".student_firstname").textContent += oneStudent.firstName;
    clone.querySelector(".student_lastname").textContent += oneStudent.lastName;
    clone.querySelector(".student_img").src += oneStudent.img;
    clone.querySelector(".student_bloodstatus_list").src += `${oneStudent.bloodStatus}.png`;

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

    if (oneStudent.inqSquad) {
      clone.querySelector(".student_inq_list").classList.remove("hide");
    } else {
      clone.querySelector(".student_inq_list").classList.add("hide");
    }

    clone.querySelector("article").addEventListener("click", () => showDetails(oneStudent));

    container.appendChild(clone);
  });
}

//EXPELLING & PREFECTS & INQSQUAD
function prefectClicked(selectedStudent) {
  console.log(selectedStudent);
  const studentStatus = checkPrefectStatus(selectedStudent);
  const prefectArray = studentList.filter((arrayObject) => arrayObject.prefect);
  console.log(prefectArray);
  const otherPrefectStudent = prefectArray.filter((student) => student.house === selectedStudent.house).shift();
  console.log(otherPrefectStudent);

  const checkForSameHouse = prefectArray.some((arrayObject) => arrayObject.house === selectedStudent.house);

  console.log(checkForSameHouse);

  if (studentStatus === true) {
    prefectStudent(selectedStudent);
  } else if (checkForSameHouse === true) {
    removeOther(otherPrefectStudent);
    console.log("Can't have multiple of the same type as winners");
  } else if (prefectArray.length >= 2) {
    console.log("There are to many winners");
    removeAorB(prefectArray[0], prefectArray[1]);
  } else {
    prefectStudent(selectedStudent);
  }

  function removeOther(other) {
    // Ask the use to ignore, or remove 'other'
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

    // show name of winner to remove
    document.querySelector("#remove_other [data-field=winnerOther]").textContent = other.lastName;

    // If ignore, do nothing
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
    }

    // If remove other:
    function clickRemoveOther() {
      removeWinner(other);
      makeWinner(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removeAorB(prefectA, prefectB) {
    //ask the user to ignore, or remove a or b
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", removeA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", removeB);

    // show name on buttons
    document.querySelector("#remove_aorb [data-field=winnerA]").textContent = prefectA.lastName;
    document.querySelector("#remove_aorb [data-field=winnerB]").textContent = prefectB.lastName;
    // If ignore, do nothing
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #removea").removeEventListener("click", removeA);
      document.querySelector("#remove_aorb #removeb").removeEventListener("click", removeB);
    }
    //if remove A:
    function removeA() {
      removeWinner(prefectA);
      makeWinner(selectedStudent);
      buildList();
      closeDialog();
    }
    //else - if removeB
    function removeB() {
      removeWinner(prefectB);
      makeWinner(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removeWinner(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makeWinner(currentStudent) {
    currentStudent.prefect = true;
  }

  buildList();
}

function checkPrefectStatus(student) {
  return student.prefect;
}

function prefectStudent(student) {
  student.prefect = !student.prefect;
  buildList();
}

function expelWarning(student) {
  // Ask the user if want to expel:
  document.querySelector("#expel_student").classList.remove("hide");

  document.querySelector("#expel_student .closebutton").addEventListener("click", closeDialog);
  document.querySelector("#expel_student #expel_button_modal").addEventListener("click", expelStudent);

  // show name of the student:
  document.querySelector("#expel_student [data-field=expelledStudent]").textContent = student.lastName;

  // If ignore, do nothing
  function closeDialog() {
    document.querySelector("#expel_student").classList.add("hide");
    document.querySelector("#expel_student .closebutton").removeEventListener("click", closeDialog);
    document.querySelector("#expel_student #expel_button_modal").removeEventListener("click", expelStudent);
  }

  // If expel is chosen:

  function expelStudent() {
    if (settings.isHacked === true && student.lastName === "Petersen") {
      document.querySelector("#hacker_haha").play();
      document.querySelector(".hacked_animation_container").classList.remove("hide");
      document.querySelector(".hacked_animation_container").classList.add("blink");
      document.querySelector(".hacked_animation_container").addEventListener("animationend", () => {
        document.querySelector(".hacked_animation_container").classList.add("hide");
        document.querySelector(".hacked_animation_container").classList.remove("blink");

        closeDialog();
        hackArray();
      });
    } else {
      console.log("is running");
      student.expelled = !student.expelled;
      const expelledStudent = studentList.splice(studentList.indexOf(student), 1);
      expelledStudentList.push(expelledStudent[0]);
      buildList();
      closeDialog();
    }
  }
}

function inqStudent(oneStudent) {
  oneStudent.inqSquad = !oneStudent.inqSquad;
  buildList();
}

function inqWarning() {
  // Ask the user if want to expel:
  document.querySelector("#inq_student").classList.remove("hide");

  document.querySelector("#inq_student .closebutton").addEventListener("click", closeDialog);

  // If ignore, do nothing
  function closeDialog() {
    document.querySelector("#inq_student").classList.add("hide");
    document.querySelector("#inq_student .closebutton").removeEventListener("click", closeDialog);
  }
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
    document.querySelector("#expel_button").classList.add("hide");
    document.querySelector("#prefect_button").classList.add("hide");
    document.querySelector("#inq_button").classList.add("hide");
  } else {
    document.querySelector(".student_expelled").classList.add("hide");
  }

  if (oneStudent.prefect) {
    document.querySelector(".student_prefect").classList.remove("hide");
  } else {
    document.querySelector(".student_prefect").classList.add("hide");
  }

  if (oneStudent.inqSquad) {
    document.querySelector(".student_inq").classList.remove("hide");
  } else {
    document.querySelector(".student_inq").classList.add("hide");
  }

  //expelling eventlistener
  document.querySelector("#expel_button").addEventListener("click", expelClicked);
  function expelClicked() {
    expelWarning(oneStudent);
    if (oneStudent.expelled) {
      document.querySelector(".student_expelled").classList.remove("hide");
    } else {
      document.querySelector(".student_expelled").classList.add("hide");
    }
    closeDetails();
  }

  //PREFECT
  document.querySelector("#prefect_button").addEventListener("click", startPrefectClicked);
  function startPrefectClicked() {
    prefectClicked(oneStudent);
    if (oneStudent.prefect) {
      document.querySelector(".student_prefect").classList.remove("hide");
    } else {
      document.querySelector(".student_prefect").classList.add("hide");
    }
  }

  //InqSquad eventlistener
  document.querySelector("#inq_button").addEventListener("click", inqClicked);
  function inqClicked() {
    if (oneStudent.bloodStatus === "pure" || oneStudent.house === "Slytherin") {
      inqStudent(oneStudent);
      document.querySelector(".student_inq").classList.remove("hide");
      if (settings.isHacked === true) {
        document.querySelector(".student_inq").classList.add("blink_fast");

        setTimeout(() => {
          document.querySelector(".student_inq").classList.remove("blink_fast");
          document.querySelector(".student_inq").classList.add("hide");
          inqStudent(oneStudent);
        }, 2000);
      }
    } else {
      document.querySelector(".student_inq").classList.add("hide");
      inqWarning();
      closeDetails();
    }

    if (oneStudent.inqSquad === false) {
      document.querySelector(".student_inq").classList.add("hide");
    }
  }

  document.querySelector("#details_popup .closebutton").addEventListener("click", closeDetails);

  function closeDetails() {
    //reset student picture and houes shield
    document.querySelector("#details_popup .student_img").src = "images/";
    document.querySelector("#details_popup .student_house").src = "images/";

    //remove eventlisteners from popup buttons
    document.querySelector("#details_popup .closebutton").removeEventListener("click", closeDetails);
    document.querySelector("#expel_button").removeEventListener("click", expelClicked);
    document.querySelector("#inq_button").removeEventListener("click", inqClicked);
    document.querySelector("#prefect_button").removeEventListener("click", startPrefectClicked);

    //hide modal, prefect & expel elements
    document.querySelector(".modal").classList.add("hide");
    document.querySelector(".student_prefect").classList.add("hide");
    document.querySelector(".student_expelled").classList.add("hide");
    document.querySelector(".student_inq").classList.add("hide");

    document.querySelector("#expel_button").classList.remove("hide");
    document.querySelector("#prefect_button").classList.remove("hide");
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
  console.log(filter);
  if (filter === "expelled") {
    buildList();
  } else {
    buildList();
  }
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
  } else if (settings.filterBy === "expelled") {
    filteredStudentList = expelledStudentList.filter(isExpelled);
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

function isExpelled(student) {
  return student.expelled;
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

  if (settings.filterBy === "expelled") {
    buildExpelledList();
  } else {
    buildList();
  }
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

//Searchbar
function searchNames() {
  let input = document.querySelector("#search_field");
  let filtering = input.value.toUpperCase();

  let list = document.querySelectorAll("#list article");
  console.log(list);

  for (let i = 0; i < list.length; i++) {
    let studentFirst = list[i].querySelectorAll("h2")[0];
    let studentLast = list[i].querySelectorAll("h2")[1];
    let searchedName = studentFirst.textContent + studentLast.innerText;

    if (searchedName.toUpperCase().indexOf(filtering) === -1) {
      list[i].style.display = "none";
    } else {
      list[i].style.display = "";
    }
  }
}
//BUILD THE NEW LIST
function buildList() {
  if (settings.filterBy === "expelled") {
    const currentList = filterList(expelledStudentList);
    const sortedList = sortList(currentList);

    displayStudents(sortedList);
    updateInfoList(sortedList);
  } else {
    const currentList = filterList(studentList);
    const sortedList = sortList(currentList);

    displayStudents(sortedList);
    updateInfoList(sortedList);
  }
}

function updateInfoList(sortedList) {
  document.querySelector("span[data-info='gryffindor']").innerText = "";
  document.querySelector("span[data-info='gryffindor']").innerText += ` ${studentList.filter(isGriffendor).length}`;

  document.querySelector("span[data-info='hufflepuff']").innerText = "";
  document.querySelector("span[data-info='hufflepuff']").innerText += ` ${studentList.filter(isHufflepuff).length}`;

  document.querySelector("span[data-info='slytherin']").innerText = "";
  document.querySelector("span[data-info='slytherin']").innerText += ` ${studentList.filter(isSlytherin).length}`;

  document.querySelector("span[data-info='ravenclaw']").innerText = "";
  document.querySelector("span[data-info='ravenclaw']").innerText += ` ${studentList.filter(isRavenclaw).length}`;

  document.querySelector("span[data-info='notexpelled']").innerText = "";
  document.querySelector("span[data-info='notexpelled']").innerText += ` ${studentList.length}`;

  document.querySelector("span[data-info='expelled']").innerText = "";
  document.querySelector("span[data-info='expelled']").innerText += ` ${expelledStudentList.length}`;

  document.querySelector("span[data-info='current']").innerText = "";
  document.querySelector("span[data-info='current']").innerText += ` ${sortedList.length}`;
  console.log(sortedList);
}
