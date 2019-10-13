$(function () {

    //Copy only the valid data to the new Array
    let currentDate = new Date();
    let currenDateWithoutSeconds = new Date();
    currenDateWithoutSeconds.setMinutes(currenDateWithoutSeconds.getMinutes() + minuteLimit, 0, 0);
    let filteredData = [];
    for (let i = 0; i < data.length; i++) {
        if (currenDateWithoutSeconds <= new Date(data[i].arrivalTime)) {
            filteredData.push(data[i]);
        }
    }

    //Generate rows for every entry
    let table = document.getElementById("table-main");
    for (let i = 0; i < filteredData.length; i++) {
        let tr = table.getElementsByTagName("tbody")[0].insertRow(-1);
        tr.classList.add("tr-content");
        let td = [];
        for (let j = 0; j < 6; j++) {
            td[j] = tr.insertCell(j);
        }
        let dataDate = new Date(filteredData[i].arrivalTime);
        let hour = dataDate.getHours();
        let minute = dataDate.getMinutes();

        td[0].innerHTML = `<div class='div-height'>${hideIcons ? "" : "<img src='" + getImageSrc(data[i].type) + "'>"}</div>`;
        td[1].innerHTML = data[i].number;
        td[2].innerHTML = data[i].from;
        td[3].innerHTML = data[i].to;
        td[4].innerHTML = getLeadingZero(hour) + ":" + getLeadingZero(minute);
        td[5].innerHTML = Math.ceil((dataDate.getTime() - currentDate.getTime()) / 1000 / 60);

        if(!disableAnimation) {
            const isEven = (i + 1) % 2 === 0;
            createMarquee(td[2], isEven);
            createMarquee(td[3], isEven);
        }

        //Set the backgroundcolor of every second row
        if ((i + 1) % 2 === 0) {
            tr.style.backgroundColor = tbodySecondBackgroundColor;
        }
    }

    let nextMinuteDate = new Date();
    nextMinuteDate.setMinutes(currentDate.getMinutes() + 1, 0, 0);
    let waitTime = nextMinuteDate.getTime() - currentDate.getTime();
    //Wait for the minute to finish and count down
    setTimeout(() => {
        countDown();
        //Count down every minute if entry has been expired, animate it out
        setInterval(countDown, 1000 * 60);
    }, waitTime);
});

function countDown() {
    let tableRows = document.getElementById("table-main").rows;
    let minuteIndex = 5;
    for (let i = 1; i < tableRows.length; i++) {
        if (parseInt(tableRows[i].cells[minuteIndex].innerHTML) === minuteLimit) {
            $(`#table-main tr:eq(${i})`)
                .children("td")
                .animate({paddingBottom: 0, paddingTop: 0})
                .wrapInner("<div />")
                .children()
                .slideUp(function () {
                    $(this).closest("tr").remove();
                });
        } else {
            tableRows[i].cells[minuteIndex].innerHTML--;
        }
    }
}

function getImageSrc(type) {
    let src = "";
    switch (type) {
        case "tram":
            src = tram;
            break;
        case "motorbus":
            src = motorbus;
            break;
        case "citybus":
            src = citybus;
            break;
        case "train":
            src = train;
            break;
        case "underground":
            src = underground;
            break;
        default:
            src = "";
    }
    return src;
}

function getLeadingZero(number) {
    return number < 10 ? "0" + number : number;
}

function createMarquee(td, isEven) {
    if (isOverflown(td)) {
        td.innerHTML = `
            <div class="fade-out">
                <span class='marquee'>${td.innerHTML}</span>
                <div class="${isEven ? "fade-out-even" : "fade-out-odd"}"></div>
            </div>
        `;
    }
}

function isOverflown(element) {
    return element.scrollWidth > element.clientWidth;
}
