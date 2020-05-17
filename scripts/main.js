
const csv_trainees = 
[
  [1, "Esther Yu", "Huace Pictures", "t"],
  [2,"XIN Liu","AMG Asia Music Group","t"],
  [3,"Yan Yu","Joinhall Media","t"],
  [4,"Shaking","JNERA","t"],
  [5,"Xiaotang Zhao","Mountaintop Entertainment","t"],
  [6,"Babymonster An","Star Master Entertainment","t"],
  [7,"Kiki Xu","Shanghai Star48 Culture Media Group","t"],
  [8,"Snow Kong","Mountaintop Entertainment","t"],
  [9,"Aria Jin","Yuehua Entertainment","t"],
  [10,"Lingzi Liu","OACA",""],
  [11,"NINEONE","WR/OC",""],
  [12,"Sharon Wang","TPG Culture",""],
  [13,"K Lu","TOV Entertainment",""],
  [14,"Frhanm Shangquan","Star Master Entertainment",""],
  [15,"Three","Shanghai Star48 Culture Media Group",""],
  [16,"Jenny Zheng","OACA",""],
  [17,"Flora Dai","Cool Young Entertainment",""],
  [18,"Xinran Song","Shanghai Star48 Culture Media Group",""],
  [19,"Roada Xu","Hot Idol",""],
  [20,"Diamond","Shanghai Star48 Culture Media Group",""],
  [21,"Xu Xinwen","Show City Times",""],
  [22,"Momo","Shanghai Star48 Culture Media Group",""],
  [23,"Eliwa Xu","Shanghai Star48 Culture Media Group",""],
  [24,"Tako Zhang","Shanghai Star48 Culture Media Group",""],
  [25,"Marco Lin","TOV Entertainment",""],
  [26,"JOEY CHUA","Maninquin Entertainment",""],
  [27,"Bubble Zhu","Independent Trainee",""],
  [28,"Yu Zhang","D.Wang Entertainment",""],
  [29,"Gia Ge","Gramarie Entertainment",""],
  [30,"DDD","Shanghai Star48 Culture Media Group",""],
  [31,"Bunny Zhang","Jaywalk Newjoy",""],
  [32,"Meddhi Fu","M.Nation",""],
  [33,"Hana Lin","Good@ Media",""],
  [34,"Jue Chen","Independent Trainee",""],
  [35,"Juicy Zuo","Bymoon Entertainment",""]
];

function readFromCSV() {
  let trainees = convertCSVArrayToTraineeData(csv_trainees);
  console.log(trainees);
  populateTable(trainees);
}

function findTraineeById(id) {
  for (let i = 0; i < trainees.length; i++) {
    if (id === trainees[i].id) { // if trainee's match
      return trainees[i];
    }
  }
  return newTrainee();
}

// If the user has saved a ranking via id, then recover it here
function getRanking() {
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("r")) {
    let rankString = atob(urlParams.get("r")) // decode the saved ranking
    let rankingIds = [];
    for (let i = 0; i < rankString.length; i += 2) {
      let traineeId = rankString.substr(i, 2); // get each id of the trainee by substringing every 2 chars
      rankingIds.push(parseInt(traineeId));
    }
    console.log(rankingIds);
    // use the retrieved rankingIds to populate ranking
    for (let i = 0; i < rankingIds.length; i++) {
      traineeId = rankingIds[i];
      if (traineeId < 0) {
        ranking[i] = newTrainee();
      } else {
        let trainee = findTraineeById(rankingIds[i])
        // let trainee = trainees[rankingIds[i]];
        trainee.selected = true;
        ranking[i] = trainee;
      }
    }
    // refresh table to show checkboxes
    rerenderTable();
    // refresh ranking to show newly inserted trainees
    rerenderRanking();
    console.log(ranking);
  }
}

function convertCSVArrayToTraineeData(csvArrays) {
  trainees = csvArrays.map(function(traineeArray, index) {
    trainee = {};
    trainee.id = parseInt(traineeArray[0]); // trainee id is the original ordering of the trainees in the first csv
    trainee.name = traineeArray[1];
    trainee.company = traineeArray[2];
    trainee.top9 = traineeArray[3] === 't'; // sets trainee to top 9 if 't' appears in 3th column  
    trainee.image =
      trainee.name + ".jpg";
    return trainee;
  });
  filteredTrainees = trainees;
  console.log(trainees)
  return trainees;
}

// Constructor for a blank trainee
function newTrainee() {
  return {
    id: -1, // -1 denotes a blank trainee spot
    name: '&#8203;', // this is a blank character
    company: '&#8203;', // this is a blank character
    image: 'emptyrank.png',
  };
}

// Constructor for a blank ranking list
function newRanking() {
  // holds the ordered list of rankings that the user selects
  let ranking = new Array(9);
  for (let i = 0; i < ranking.length; i++) {
    ranking[i] = newTrainee();
  }
  return ranking;
}

// rerender method for table (search box)
// TODO: this site might be slow to rerender because it clears + adds everything each time
function rerenderTable() {
  clearTable();
  populateTable(filteredTrainees);
  populateRanking();
}

// rerender method for ranking
function rerenderRanking() {
  clearRanking();
  populateRanking();
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Clears out the table
function clearTable() {
  let table = document.getElementById("table__entry-container");
  removeAllChildren(table);
}

// Clears out the ranking
function clearRanking() {
  // Currently just duplicates first ranking entry
  let ranking_chart = document.getElementById("ranking__pyramid");
  let rankRows = Array.from(ranking_chart.children).slice(1); // remove the title element
  // let rankEntry = rankRows[0].children[0];
  for (let i = 0; i < rowNums.length; i++) {
    let rankRow = rankRows[i];
    for (let j = 0; j < rowNums[i]; j++) {
      removeAllChildren(rankRow);
    }
  }
}

// Uses populated local data structure from readFromCSV to populate table
function populateTable(trainees) {
  // Currently just duplicates the first table entry
  let table = document.getElementById("table__entry-container");
  exampleEntry = table.children[0];
  for (let i = 0; i < trainees.length; i++) {
    // generate and insert the html for a new trainee table entry
    table.insertAdjacentHTML("beforeend", populateTableEntry(trainees[i]));
    // add the click listener to the just inserted element
    let insertedEntry = table.lastChild;
    insertedEntry.addEventListener("click", function (event) {
      tableClicked(trainees[i]);
    });
  }
}

function populateTableEntry(trainee) {
  let top9 = (showTop9 && trainee.top9) && "top9";
  const tableEntry = `
  <div class="table__entry">
    <div class="table__entry-icon">
      <img class="table__entry-img" src="assets/trainees/${trainee.image}" />
      <div class="table__entry-icon-border-rank-border"></div>
      ${
        top9 ? '<div class="table__entry-icon-crown"></div>' : ''
      }
      ${
        trainee.selected ? '<img class="table__entry-check" src="assets/check.png"/>' : ""
      }
    </div>
    <div class="table__entry-text">
      <span class="name"><strong>${trainee.name}</strong></span>
      <span class="company">${trainee.company.toUpperCase()}</span>
    </div>
  </div>`;
  return tableEntry;
}

// Uses populated local data structure from getRanking to populate ranking
function populateRanking() {
  // Currently just duplicates first ranking entry
  let ranking_chart = document.getElementById("ranking__pyramid");
  let rankRows = Array.from(ranking_chart.children).slice(1); // remove the title element
  // let rankEntry = rankRows[0].children[0];
  let currRank = 1;
  for (let i = 0; i < rowNums.length; i++) {
    let rankRow = rankRows[i];
    for (let j = 0; j < rowNums[i]; j++) {
      let currTrainee = ranking[currRank-1];
      rankRow.insertAdjacentHTML("beforeend", populateRankingEntry(currTrainee, currRank))

      let insertedEntry = rankRow.lastChild;
      let dragIcon = insertedEntry.children[0].children[0]; // drag icon is just the trainee image and border
      let iconBorder = dragIcon.children[1]; // this is just the border and the recipient of dragged elements
      // only add these event listeners if a trainee exists in this slot
      if (currTrainee.id >= 0) {
        // add event listener to remove item
        insertedEntry.addEventListener("click", function (event) {
          rankingClicked(currTrainee);
        });
        // add event listener for dragging
        //TODO: fix drag drop
        dragIcon.setAttribute('draggable', true);
        dragIcon.classList.add("drag-cursor");
        dragIcon.addEventListener("dragstart", createDragStartListener(currRank - 1));
      }
      // add event listeners for blank/filled ranking entries
      iconBorder.addEventListener("dragenter", createDragEnterListener());
      iconBorder.addEventListener("dragleave", createDragLeaveListener());
      iconBorder.addEventListener("dragover", createDragOverListener());
      iconBorder.addEventListener("drop", createDropListener());
      // }
      currRank++;
    }
  }
}

const abbreviatedCompanies = {
  "AMG ASIA MUSIC GROUP": "AMG",
  "SHANGHAI START48 CULTURE MUSIC GROUP": "SNH48",
  "INDEPENDENT TRAINEE": "INDEPENDENT",
}

function populateRankingEntry(trainee, currRank) {
  let modifiedCompany = trainee.company.toUpperCase();
  modifiedCompany = modifiedCompany.replace("ENTERTAINMENT", "ENT.");
  if (abbreviatedCompanies[modifiedCompany]) {
    modifiedCompany = abbreviatedCompanies[modifiedCompany];
  }
  let top9 = (showTop9 && trainee.top9) && "top9";
  const rankingEntry = `
  <div class="ranking__entry">
    <div class="ranking__entry-view">
      <div class="ranking__entry-icon">
        <img class="ranking__entry-img" src="assets/trainees/${trainee.image}" />
        <div class="ranking__entry-icon-border-rank-border" data-rankid="${currRank-1}"></div>
      </div>
      <div class="ranking__entry-icon-badge bg-">${currRank}</div>
      ${
        top9 ? '<div class="ranking__entry-icon-crown"></div>' : ''
      }
    </div>
    <div class="ranking__row-text">
      <div class="name"><strong>${trainee.name}</strong></div>
      <div class="company">${modifiedCompany}</div>
    </div>
  </div>`;
  return rankingEntry;
}

// Event handlers for table
function tableClicked(trainee) {
  if (trainee.selected) {
    // Remove the trainee from the ranking
    let success = removeRankedTrainee(trainee);
    if (success) { // if removed successfully
      trainee.selected = !trainee.selected;
    } else {
      return;
    }
  } else {
    // Add the trainee to the ranking
    let success = addRankedTrainee(trainee);
    if (success) { // if added successfully
      trainee.selected = true;
    } else {
      return;
    }
  }
  rerenderTable();
  rerenderRanking();
}

// Event handler for ranking
function rankingClicked(trainee) {
	if (trainee.selected) {
    trainee.selected = !trainee.selected;
    // Remove the trainee from the ranking
    removeRankedTrainee(trainee);
  }
  rerenderTable();
	rerenderRanking();
}

function swapTrainees(index1, index2) {
  tempTrainee = ranking[index1];
  ranking[index1] = ranking[index2];
  ranking[index2] = tempTrainee;
  rerenderRanking();
}

// Controls alternate ways to spell trainee names
// to add new entries use the following format:
// <original>: [<alternate1>, <alternate2>, <alternate3>, etc...]
// <original> is the original name as appearing on csv
// all of it should be lower case
const alternateRomanizations = {
  'esther yu': ['yu shuxin'],
  'shaking': ['xie keyin', 'xie xue'],
  'babymonster an': ['an qi', 'babymonster'],
  'kiki xu': ['xu jiaqi'],
  'nineone': ['nai wan'],
  'k lu': ['lu keran'],
  'snow kong': ['kong xueer', 'kong seol a'],
  'aria jin': ['jin zihan'],
  'tako zhang': ['zhang yuge'],
  'marco lin': ['lin fan'],
  'frhanm shangquan': ['shangguan xiai'],
  'roada xu': ['xu ziyin'],
  'diamond': ['dai meng'],
  'sharon wang': ['wang chengxuan'],
  'flora dai': ['dai yanni'],
  'ddd': ['duan yixuan'],
  'three': ['sun rui'],
  'momo': ['mo han'],
  'eliwa xu': ['yangyuzhuo xu'],
  'bubble zhang': ['bubble zhu', 'zhu linyu'],
  'hana lin': ['lin xiaozhai'],
  'juicy zuo': ['zuo zhuo'],
  'gia ge': ['ge zinyi'],
  'meddhi fu': ['fu ruqiao'],
  'joey chua': ['chua zhuoyi']
};

// uses the current filter text to create a subset of trainees with matching info
function filterTrainees(event) {
  let filterText = event.target.value.toLowerCase();
  // filters trainees based on name, alternate names, and company
  filteredTrainees = trainees.filter(function (trainee) {
    let initialMatch = includesIgnCase(trainee.name, filterText) || includesIgnCase(trainee.company, filterText);
    // if alernates exists then check them as well
    let alternateMatch = false;
    let alternates = alternateRomanizations[trainee.name.toLowerCase()]
    if (alternates) {
      for (let i = 0; i < alternates.length; i++) {
        alternateMatch = alternateMatch || includesIgnCase(alternates[i], filterText);
      }
    }
    return initialMatch || alternateMatch;
  });
  filteredTrainees = sortedTrainees(filteredTrainees);
  rerenderTable();
}

// Checks if mainString includes a subString and ignores case
function includesIgnCase(mainString, subString) {
  return mainString.toLowerCase().includes(subString.toLowerCase());
}

// Finds the first blank spot for
function addRankedTrainee(trainee) {
  for (let i = 0; i < ranking.length; i++) {
    if (ranking[i].id === -1) { // if spot is blank denoted by -1 id
      ranking[i] = trainee;
      return true;
    }
  }
  return false;
}

function removeRankedTrainee(trainee) {
  for (let i = 0; i < ranking.length; i++) {
    if (ranking[i].id === trainee.id) { // if trainee's match
      ranking[i] = newTrainee();
      return true;
    }
  }
  return false;
}

const currentURL = "http://apham.me/youthwithyou2/";
// Serializes the ranking into a string and appends that to the current URL
function generateShareLink() {
  let shareCode = ranking.map(function (trainee) {
    let twoCharID = ("0" + trainee.id).slice(-2); // adds a zero to front of digit if necessary e.g 1 --> 01
    return twoCharID;
  }).join("");
  console.log(shareCode);
  shareCode = btoa(shareCode);
  shareURL = currentURL + "?r=" + shareCode;
  showShareLink(shareURL);
}

function showShareLink(shareURL) {
  let shareBox = document.getElementById("getlink-textbox");
  shareBox.value = shareURL;
  document.getElementById("getlink-textbox").style.display = "block";
  document.getElementById("copylink-button").style.display = "block";
}

function copyLink() {
  let shareBox = document.getElementById("getlink-textbox");
  shareBox.select();
  document.execCommand("copy");
}

// holds the list of all trainees
var trainees = [];
// holds the list of trainees to be shown on the table
var filteredTrainees = [];
// holds the ordered list of rankings that the user selects
var ranking = newRanking();
const rowNums = [1, 2, 3, 3];
populateRanking();
readFromCSV();
// checks the URL for a ranking and uses it to populate ranking
getRanking();
