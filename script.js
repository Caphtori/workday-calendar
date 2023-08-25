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

  

let containerEl = $("#container");

let todoMaster = [];
let today = dayjs();
let pageDay = today;

let testN = 0;



// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  renderSchedule();
  
});



function renderSchedule(){
  let dayStart = pageDay.hour(9).minute(0).second(0);
  let dayEnd = pageDay.hour(17).minute(0).second(0);

  //FOR TESTING PURPOSES ONLY
  dayStart = pageDay.hour(0).minute(0).second(0);
  dayEnd = pageDay.hour(23).minute(0).second(0);
  // 


  let dayLength = dayEnd.diff(dayStart, "hour")+1;
  for (let i=0; i<dayLength; i++){
    renderHour(i, dayStart, dayEnd);
  };
    }


function renderHour (iHour, startDay, endDay) {
  let now = dayjs();
  let hour = startDay.add(iHour, "hour");
  let hourLabel = hour.format('hA');

  let storedMasters = JSON.parse(localStorage.getItem("masterList"));
  if (storedMasters!==null){
    todoMaster = storedMasters;
  };

  let hourObject = {
    hour: hour,
    index: null,
    todos: [],
  };

  if (todoMaster.length>0){
    for (let i=0; i<todoMaster.length; i++){
      // .format("D hA")
      if (dayjs(todoMaster[i].hour).isSame(hourObject.hour, "day")&&dayjs(todoMaster[i].hour).isSame(hourObject.hour, "hour")){
        hourObject=todoMaster[i];
        hourObject.hour=dayjs(hourObject.hour)
      }
    };
  };


  let isWrite = false;
  let hourDiv = $("<div>");
  
  let inputDiv = $("<div>");

  let timeDiv = $("<div>");
  let areaDiv = $("<div>");
  let titlearea = $("<input>");
  let titeLabel = $("<label>");
  let titleWrapper = $("<div>");

  let closeBtn = $("<button>");
  let closeIdiom = $("<i>");
  // let afterLabel = $("<label>");
  
  let titleID = String("timeDiv-"+hour.format("hA"))
  let textarea = $("<textarea>");
  let button = $("<button>");
  let idiom = $("<i>");

  titlearea.addClass("formcontrol-lg ph1 titlearea");
  titlearea.attr("placeholder", "Required...");
  titlearea.attr("id", titleID);
  titlearea.attr("maxlength", "50");

  titeLabel.addClass("titleLabel");
  titeLabel.attr("for", titleID);
  

  inputDiv.addClass("inputDiv");

  titleWrapper.addClass("titleWrapper");

  // afterLabel.addClass("afterLabel");
  // afterLabel.attr("for", titleID);

  timeDiv.addClass("col-2 col-md-1 hour text-center py-3");
  timeDiv.text(hourLabel);
  if (hour.hour()===endDay.hour()){
    timeDiv.addClass("bottomDiv")
  };
  

  areaDiv.addClass("col-8 col-md-10 description areaDiv");
  areaDiv.attr("rows", "3");

  textarea.addClass("col-8 col-md-10 description ph1");
  textarea.attr("rows", "3");
  textarea.attr("placeholder", "Don't forget to set the time...");


  button.addClass("btn btnCustom col-2 col-md-1");
  
  idiom.addClass("fas fa-plus ariaEl");
  idiom.attr("aria-hidden", "true");

  closeBtn.addClass("btn btnCustom col-2 col-md-1 closeBtn");
  closeIdiom.addClass("far fa-trash-alt ariaEl");
  closeIdiom.attr("aria-hidden", "true");


  
  if (hour.isAfter(now, "hour")||hour.isSame(now, "hour")){
    button.append(idiom);
  };

  if (hourObject.todos.length>0){
    renderTodos();
  };

  checkHour();
  if (hour.isSame(now, "hour")){
    initHourcheck();
  };
  closeBtn.append(closeIdiom)
  titleWrapper.append(titeLabel);
  titleWrapper.append(titlearea);
  inputDiv.append(titleWrapper);
  inputDiv.append(textarea);
  appendEls();
  containerEl.append(hourDiv);
  btnListen();

  // Checks the hour every minute to make sure the schedule is correct.
  function initHourcheck(){
    let wait = (60-dayjs().second())*1000;
    setTimeout(checkHourInt, wait);
  };

  function checkHourInt(){
    let chInterval = setInterval(()=>{
     
      now = dayjs();
      testN++;
      console.log("Now: "+now.format("h:mm:ssA"))
      console.log(hour.format("hA")+" test: "+ testN);
      
      checkHour();

      if (hour.isBefore(now, "hour")){
        console.log(hour.format("hA")+": I'm off.")
        clearInterval(chInterval);
        btnListen()
        containerEl.html('');
        renderSchedule();
      }

    }, 60000);
    
  };
  // 

  // Checks the hour of the current slot v IRL time and renders elements accordingly.
  
  function checkHour(){
    if (hour.isBefore(now, "hour")){
      hourDiv.addClass("row time-block past");
      button.addClass("noBtn");
    } else{
      if (hour.isAfter(now, "hour")){
        hourDiv.addClass("row time-block future");
      } else {
        hourDiv.addClass("row time-block present");
      }
      button.addClass("addBtn");
      button.attr("aria-label", "plus")
    };
  };
  //

  // Render Elements
  function renderTodos(){
    let ul = $("<ul>");
    for (let i=0; i<hourObject.todos.length; i++){
      renderSingle(hourObject.todos[i]);
    };

    function renderSingle (todo) {
      let li = $("<li>");
      // let card = $("<div>");
      let todoEnd = $("<i>");
      let checkbox = $("<input>");
      let title = $("<p>");
      let changeBox = $("<div>");
      let edit = $("<i>");
      let trash = $("<i>");

      // let todoTitle = function() {
      //   if (todo.txt.length>20){
      //     let word = '';
      //     for (let i=0; i<20; i++){
      //       word+=todo.txt[i];
      //     }
      //     return word.trimEnd()+"..."
      //   } else {
      //     return todo.txt.trimEnd();
      //   };
      // }

      ul.addClass("todoUl");

      li.addClass("todoLi");

      todoEnd.addClass("todoEnd");

      // card.addClass("card");
      
      checkbox.addClass("form-check-input checkBox");
      checkbox.attr("type", "checkbox");

      // title.text(todo.title);
      title.text(todo.title);

      changeBox.addClass("changeBox");

      edit.addClass("far fa-edit changeIcon");
      trash.addClass("far fa-trash-alt changeIcon");


      
      if (hour.isBefore(now, "hour")){
        if (todo.isDone){
          todoEnd.addClass("fa fa-check");
          li.addClass("success");
        } else {
          todoEnd.addClass("fa fa-close");
          li.addClass("fail");
        };
        renderDone();
      } else {
        if (todo.isDone){
          todoEnd.addClass("fa fa-check");
          renderDone();
        } else {
          
          changeBox.append(edit);
          changeBox.append(trash);
          li.append(checkbox);
          li.append(title);
          li.append(changeBox);
          // li.append(card);
          ul.append(li);
          areaDiv.append(ul);

          edit.one("click", editDeletable);

          function editDeletable(){
            btnClick(todo.title, todo.txt);
          };
          
          checkbox.one("change", checkBoxFn);
        };
        
        
        };

        function checkBoxFn (){
          todo.isDone = true;
          renderSingle(todo);
        };


        function renderDone (){
          // REMOVE EVENTLISTENERS
          // titlearea.off("keydown", charCounter);
          edit.off("click", editDeletable);
          checkbox.off("change", checkBoxFn);
          li.append(todoEnd);
          li.append(title);
          ul.append(li);
          areaDiv.append(ul);
        };
    };
    // hourDiv.remove(textarea);
    // hourDiv.remove(button);
    appendEls ();
  };
  
  function appendEls (){
    hourDiv.append(timeDiv);
    
    // if (isWrite){
    //   hourDiv.append(textarea);
    // } else {
    //   hourDiv.append(areaDiv);
    // };
    // hourDiv.append(textarea);
    hourDiv.append(areaDiv);
    hourDiv.append(button);
    
  }
  //

  // Event Listeners
  function btnListen(){
    if (hour.isAfter(now, "hour")||hour.isSame(now, "hour")){
      button.one("click", btnDeletable);
      function btnDeletable (){
        btnClick('', '');
      };
    } else {
      button.off("click", btnDeletable);
    };
  };

  function btnClick (titleVal, value) {
    let titleLen = 0;
    let isSavable = false;
    idiom.addClass("fa-save").removeClass("fa-plus");
    if (titlearea.val()!==''&&titlearea.val()!==null&&titlearea.val()!==undefined){
      isSavable = true;
      button.addClass("saveBtn").removeClass("addBtn");
      idiom.addClass("nsAria").removeClass("ariaEl");
    } else {
      button.addClass("nsBtn").removeClass("addBtn");
    }
    titeLabel.text("Title ("+titleLen+"/50 chars):");
    
    button.attr("aria-label", "save")
    
    areaDiv.html('');
    // textarea.attr("readonly", false);

    if (hour.isAfter(now, "hour")){
      hourDiv.removeClass("future");
    } else if (hour.isSame(now, "hour")){
      hourDiv.removeClass("present");
    };
    hourDiv.addClass("writable");
    isWrite = true;
    // hourDiv.html('');
    areaDiv.html('');
    areaDiv.append(inputDiv);
    areaDiv.append(closeBtn);
    // areaDiv.append(titleWrapper);
    titlearea.focus();
    // areaDiv.append(textarea);
    areaDiv.addClass("focus");


    // MAYBE: Remove the charcounter on the button click (make the one function anonymous)
    if (isSavable){
      button.one("click", saveDeletable);
    }
    closeBtn.one("click", ()=>{
      // REMOVE EVENT LISTENERS
      button.addClass("addBtn").removeClass('saveBtn');
      button.attr("aria-label", "plus");
      idiom.addClass("fa-plus").removeClass('fa-save');
      button.off("click", saveDeletable);
      titlearea.off("keydown", charCounter);
      hourDiv.removeClass("writable");
      isWrite = false;
      areaDiv.html('');
      areaDiv.removeClass("focus");
      checkHour();
      renderTodos();
      btnListen();
    });
    titlearea.on("keydown", charCounter);

    function charCounter(event){
      if (titlearea.val().length<=50){
        titleLen = titlearea.val().length;
        titeLabel.text("Title ("+titleLen+"/50 chars):");
      } else {
        let key = event.keyCode || event.charCode;
        
        if ( key !== 8 && key !== 46 ){
          titlearea.addClass("maxEx");
          
        };
        titlearea.one("keyup", ()=>{
          titlearea.removeClass("maxEx");
        });
        
      }
      titlearea.one("keyup", ()=>{
        let titleCheck = titlearea.val();
        if (titleCheck!==''&&titleCheck!==null&&titleCheck!==undefined){
          isSavable = true;
          // ADD BUTTON STUFF
          button.addClass("saveBtn").removeClass("nsBtn");
          idiom.addClass("ariaEl").removeClass("nsAria");
        }
      });
    }

    function setTodoTime(){
      now = dayjs;
      if (hour.isSame(no, "hour")){

      }
    }


    function saveDeletable (){

         
      let todoObject = {
        txt: textarea.val(),
        index: hourObject.todos.length,
        isDone: false,
        isFail: false,
        title: titlearea.val(),
      };

      
      

      button.addClass("addBtn").removeClass('saveBtn');
      button.attr("aria-label", "plus");
      idiom.addClass("fa-plus").removeClass('fa-save');
      titlearea.val(titleVal);
      textarea.val(value);

      hourDiv.removeClass("writable");
      isWrite = false;
      areaDiv.html('');
      areaDiv.removeClass("focus");
      // hourDiv.html('');
      // appendEls();
      checkHour();
      // if (todoObject.txt!==''&&todoObject.txt!==undefined){
        
      hourObject.todos.push(todoObject);
        // localStorage.setItem("todoList", JSON.stringify(hourObject.todos))
      if (!todoMaster.includes(hourObject)){
        hourObject.index = todoMaster.length;
        todoMaster.push(hourObject);
      } else {
        
        todoMaster.splice(hourObject.index, 1, hourObject)
      };
      localStorage.setItem("masterList", JSON.stringify(todoMaster));
      // };
      renderTodos();
      btnListen();
      
    
    };
    

  };
  //


};


function deleteListeners(){

}
    

// function buttonClick(event, )

