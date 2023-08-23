let containerEl = $("#container");

let todoMaster = [];
let today = dayjs();
let pageDay = today;

let dayStart = dayjs().hour(9).minute(0).second(0);
let dayEnd = dayjs().hour(17).minute(0).second(0);
let dayLength = dayEnd.diff(dayStart, "hour")+1;


// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  renderSchedule();
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});



function renderSchedule(){
  for (let i=0; i<dayLength; i++){
    let now = dayjs();

    // FOR TESTING PURPOSES ONLY
    now = dayjs().hour(13).minute(0).second(0);
    // 


    let hour = dayStart.add(i, "hour");
    let hourLabel = hour.format('hA');

    let storedTodos = JSON.parse(localStorage.getItem("todoList"))

    let hourObject = {
      hour: hour,
      day: pageDay,
      // index: todoMaster.length,
      todos: [],
    };

    if (storedTodos!==null){
      hourObject.todos = storedTodos;
    };

    let hourDiv = $("<div>");
    let titleDiv = $("<div>");
    let textarea = $("<textarea>");
    let button = $("<button>");
    let idiom = $("<i>");

    // Checks the hour every minute to make sure the schedule is correct.
    function checkHourInt(){
      setInterval(checkHour, 60000)
    };

    function checkHour(){
      if (hour.isBefore(now, "hour")){
        hourDiv.attr("class", "row time-block past");
      } else if (hour.isAfter(now, "hour")){
        hourDiv.attr("class", "row time-block future");
      } else{
        hourDiv.attr("class", "row time-block present");
      };
    };

    function renderTodos(){

    }


    if (hour.isBefore(now, "hour")){
      hourDiv.addClass("row time-block past");
      button.addClass("btn noBtn col-2 col-md-1");
      // textarea.readOnly=true;
      // textarea.attr("readonly", true)
    } else{
      if (hour.isAfter(now, "hour")){
        hourDiv.addClass("row time-block future");
      } else {
        hourDiv.addClass("row time-block present");
        
      }
      button.addClass("btn addBtn col-2 col-md-1");
      button.attr("aria-label", "plus")
    };

    checkHourInt();

    textarea.attr("readonly", true);

    titleDiv.addClass("col-2 col-md-1 hour text-center py-3");
    titleDiv.text(hourLabel);

    textarea.addClass("col-8 col-md-10 description");
    textarea.attr("rows", "3")
    
    if (hour.isBefore(now, "hour")){
      
    } else {
      
    }
    
    // button.attr("aria-label", "save")
    
    // idiom.addClass("fas fa-save");
    
    idiom.addClass("fas fa-plus ariaEl");
    idiom.attr("aria-hidden", "true");
    
    if (hour.isAfter(now, "hour")||hour.isSame(now, "hour")){
      button.append(idiom);
    }
    hourDiv.append(titleDiv);
    hourDiv.append(textarea);
    hourDiv.append(button);
    containerEl.append(hourDiv);
    btnListen()

    function btnListen(){
      button.one("click", function () {
        // element = event.taget;
  
  
        button.addClass("saveBtn").removeClass("addBtn");
        button.attr("aria-label", "save")
        idiom.addClass("fa-save").removeClass("fa-plus");
        textarea.html('');
        textarea.attr("readonly", false);

        if (hour.isAfter(now, "hour")){
          hourDiv.removeClass("future");
        } else if (hour.isSame(now, "hour")){
          hourDiv.removeClass("present");
        };
        hourDiv.addClass("writable");
  
        button.one("click", function () {
          let todoObject = {
            txt: textarea.val(),
            index: hourObject.todos.length,
            isDone: false,
            isFail: false,
            title: () => {
              let words = [];
              let word1 = [];
              let word3 = [];
              this.txt.each(()=>{
                let spaceCount = 0;
                
              })
            }
          };
  
          button.addClass("addBtn").removeClass('saveBtn');
          button.attr("aria-label", "plus");
          idiom.addClass("fa-plus").removeClass('fa-save');
          textarea.val('');
          textarea.attr("readonly", true);

          hourDiv.removeClass("writable");
          checkHour();
          if (todoObject.txt!==''&&todoObject.txt!==undefined){
            hourObject.todos.push(todoObject);
            localStorage.setItem("todoList", JSON.stringify(hourObject.todos))
            if (!todoMaster.includes(hourObject)){
              let storedMasters = JSON.parse(localStorage.getItem("masterList"));
              if (storedTodos!==null){
                todoMaster = storedMasters;
              };
              todoMaster.push(hourObject);
              localStorage.setItem("masterList", JSON.stringify(todoMaster));
            };
          }
          

          btnListen();
        });
      });
    }
  };
    }
    

// function buttonClick(event, )

