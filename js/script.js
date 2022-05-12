let ul = document.getElementById("students");
let apiUrl = "http://localhost:15781/students";

function strToDateString(str) {
    let date = new Date(str);
    return date.toDateString();
}

function studentListItem(obj) {
    let li = document.createElement("li");
    li.innerText = `${obj.id} ${obj.name}  ${obj.lastName} ${
        obj.group
    } ${strToDateString(obj.birthDate)}`;
    return li;
}

async function FillList() {
    if (!Number.isInteger(Number.parseInt(getStudentId().id))) {
        FillListNoId();
        return;
    }
    FillListId();
}

async function FillListNoId() {
    ul.innerHTML = "";
    let students;

    await GetFetch(null, apiUrl, (data) => {
        students = data;
    });

    if (students !== null) {
        students.forEach((student) => {
            ul.appendChild(studentListItem(student));
        });
    }
}

async function FillListId() {
    ul.innerHTML = "";
    let student;

    await GetFetch(null, `${apiUrl}/${getStudentId().id}`, (data) => {
        student = data;
    });

    if (student !== null) {
        ul.appendChild(studentListItem(student));
    }
}

function hideElement(elementName) {
    getElement(elementName).classList.add("hidden");
}
function showElement(elementName) {
    getElement(elementName).classList.remove("hidden");
}
function getStudentId() {
    return { id: getElementValue("studentId") };
}

function createStudentWithId() {
    let obj = createStudent();
    obj.id = getStudentId().id;
    return obj;
}

function createStudent() {
    return {
        id: 0,
        name: getElementValue("name"),
        birthDate: getElementValue("birthDate"),
        lastName: getElementValue("lastName"),
        group: getElementValue("group"),
    };
}

function getElement(name) {
    return document.getElementById(name);
}

function getElementValue(name) {
    return getElement(name).value;
}

function setElementText(name, value) {
    getElement(name).innerText = value;
}

function setResult(value) {
    setElementText("result", value);
}

function checkStatus(data) {
    console.log(data);
    return (data.status ?? 200) < 400;
}

function onStatusCheck(data, truecond, falsecond) {
    return checkStatus(data) ? truecond : falsecond;
}

function setResultStatus(data, truecond, falsecond) {
    setResult(onStatusCheck(data, truecond, falsecond));
}

async function AddStudent(e) {
    await AbstractFetch(e, createStudent, apiUrl, "POST", (data) => {
        setResult(`Added ${data}`);
    });
}

async function EditStudent(e) {
    await AbstractFetch(e, createStudentWithId, apiUrl, "PUT", (data) => {
        setResultStatus(data, "Edited successfully", "Failed to edit");
    });
}

async function DeleteStudent(e) {
    await AbstractFetch(
        e,
        null,
        `${apiUrl}/${getStudentId().id}`,
        "DELETE",
        (data) => {
            setResultStatus(data, "Deleted successfully", "Failed to delete");
        }
    );
}

async function GetFetch(e, url, after) {
    e?.preventDefault();
    await fetch(url)
        .then((response) => {
            return response.json();
        })
        .then(after);
}

async function AbstractFetch(e, dataGenerator, url, apiMethod, after) {
    e?.preventDefault();
    let firstData = dataGenerator == null ? null : dataGenerator();
    console.log(firstData);

    await fetch(url, {
        method: apiMethod,
        body: firstData == null ? undefined : JSON.stringify(firstData),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            return response.json();
        })
        .then(after);
}
