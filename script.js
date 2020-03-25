// Get list of rows in the table
var table = document.getElementById("table-main");
var rows = table.getElementsByTagName("tr");

const blue = "rgb(0, 102, 204) none repeat scroll 0% 0%";
const white = "white none repeat scroll 0% 0%";
const red = "rgb(204, 51, 51) none repeat scroll 0% 0%";

// When we select row it will change background color based on current color
// Calls function to move row according to current background color
async function SelectRow(row) {  

    if (row.style.background == blue  || row.style.background == "") {
        row.style.background = white;
        row.style.color = "#000";
    } else if (row.style.background == white) {
        row.style.background = red;
        row.style.color = "#fff";
    } else if (row.style.background == red) {
        row.style.background = blue;
        row.style.color = "#fff";
    }

    await Sleep(1200);
    MoveRow(row);
}

// Detaches selected row and moves it to a table according to current row background color
function MoveRow(row) {
    var color = row.style.background;
    row.remove();

    if (color === white) {
        document.getElementById("table-success").appendChild(row);
    } else if (color === red) {
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
    }
    console.log(d);
    
    var executionDays = document.getElementsByClassName("exec-day");
    var daysStr, daysArr, row;

    for (i=0; i < executionDays.length; i++) {
        // console.log(executionDays[i].innerHTML);
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
for (var i = 0; i < rows.length; i++) {
    rows[i].addEventListener("click", function() {
        SelectRow(this);
    });
}
