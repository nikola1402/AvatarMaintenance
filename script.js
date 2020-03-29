const colorMain = "rgb(255, 255, 255) none repeat scroll 0% 0%";
const colorSuccess = "rgb(34, 139, 34) none repeat scroll 0% 0%";
const colorFail = "rgb(204, 51, 51) none repeat scroll 0% 0%";

const tableSuccess = document.getElementById("table-success");
const tableMain = document.getElementById("table-main");
const tableFail = document.getElementById("table-fail");

function Setup() {
    GetData();
}

function GetData() {

    
    var url = "../robot_runs_maintenance.xlsx";

    /* set up async GET request */
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";

    var jsonArray;
    req.onload = function(e) {
        var data = new Uint8Array(req.response);
        var workbook = XLSX.read(data, {type:"array"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        jsonArray = XLSX.utils.sheet_to_json(worksheet);

        PopulateTable(jsonArray);
    }
    req.send();
}


function PopulateTable(jsonArray) {
    var row;
    var cell;
    var i = 0;
    jsonArray.forEach(element => {
        i++;

        row = document.createElement("TR");

        cell = document.createElement("TH");
        cell.setAttribute("scope", "row");
        cell.setAttribute("class", "col-1");
        cell.innerHTML = i;
        row.appendChild(cell);

        cell = document.createElement("TD");
        cell.setAttribute("class", "col-4");
        cell.innerHTML = element.RobotName;
        row.appendChild(cell);

        cell = document.createElement("TD");
        cell.setAttribute("class", "col-6");
        cell.innerHTML = element.ScheduleName;
        row.appendChild(cell);
        
        cell = document.createElement("TD");
        cell.setAttribute("class", "exec-day col-1");
        cell.innerHTML = element.ExecutionDay;
        row.appendChild(cell);

        row.style.display = "none";

        tableMain.appendChild(row);
    });

    ListAvatars();
    AddRowListeners();
}


// When we select row it will change background color based on current color
// Calls function to move row according to current background color
async function SelectRow(row) {  

    if (row.style.background.includes("rgb(255, 255, 255)")  || row.style.background == "") {
        row.style.background = colorSuccess;
        row.style.color = "#fff";
    } else if (row.style.background.includes("rgb(34, 139, 34)")) {
        row.style.background = colorFail;
        row.style.color = "#fff";
    } else if (row.style.background.includes("rgb(204, 51, 51)")) {
        row.style.background = colorMain;
        row.style.color = "#000";
    }

    await Sleep(1200);
    MoveRow(row);
}

// Detaches selected row and moves it to a table according to current row background color
function MoveRow(row) {

    var color = row.style.background;
    row.remove();

    if (color.includes("rgb(34, 139, 34)")) {
        document.getElementById("table-success").appendChild(row);
    } else if (color.includes("rgb(204, 51, 51)")) {
        document.getElementById("table-fail").appendChild(row);
    } else {
        document.getElementById("table-main").appendChild(row);
    }
}

// Populates table based on selected day
function ListAvatars(day) {

    var d;

    if (day) {
        d = day;
    } else {
        var date = new Date();
        d = date.getDay();
        if (d===0) {
            d = 7;
        }
    }
    
    var executionDays = document.getElementsByClassName("exec-day");
    var daysStr, daysArr, row;

    for (i=0; i < executionDays.length; i++) {
        daysStr = executionDays[i].innerHTML;
        daysArr = daysStr.split(",");
        row = executionDays[i].closest("tr");
        row.style.display = "none";

        if (d > 0) {
            daysArr.forEach(element => {
                if (element == d) {
                    row.style.display = "flex";
                }
            });
        } else {
            row.style.display = "flex";
        }

    }
}

function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

 // Add listeners to all table rows
function AddRowListeners() {

    var rows = tableMain.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        rows[i].addEventListener("click", function() {
            SelectRow(this);
        });
    }
}
