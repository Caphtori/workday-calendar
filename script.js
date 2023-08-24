let containerEl = $("#container");

let todoMaster = [];
let today = dayjs();
let pageDay = today;




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
  let dayStart = pageDay.hour(9).minute(0).second(0);
  let dayEnd = pageDay.hour(17).minute(0).second(0);
  let dayLength = dayEnd.diff(dayStart, "hour")+1;
  for (let i=0; i<dayLength; i++){
    renderHour(i,dayStart);
  };
    }


function renderHour (iHour, start) {
  let now = dayjs();

  // FOR TESTING PURPOSES ONLY
  now = dayjs().hour(13).minute(0).second(0);
  // 


  let hour = start.add(iHour, "hour");
  let hourLabel = hour.format('hA');

  let storedMasters = JSON.parse(localStorage.getItem("masterList"));
  if (storedMasters!==null){
    todoMaster = storedMasters;
  };

  // let storedTodos = JSON.parse(localStorage.getItem("todoList"))

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
  console.log(hourObject.hour.format("hA"), hourObject.index+", "+hourObject.todos.length);

  // if (storedTodos!==null){
  //   hourObject.todos = storedTodos;
  // };
  let isWrite = false;
  let hourDiv = $("<div>");
  let titleDiv = $("<div>");
  let areaDiv = $("<div>");
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
    let ul = $("<ul>");
    // hourObject.todos.forEach(renderSingle(this));
    for (let i=0; i<hourObject.todos.length; i++){
      // console.log(hourObject.todos.title)
      // if (hourObject.hour===hour){
      //   console.log(hourObject.hour.format("hA")+", "+hourObject.index+", "+hourObject.todos.length, "bub")
      //   renderSingle(hourObject.todos[i]);
      // }
      renderSingle(hourObject.todos[i]);
    };

    function renderSingle (todo) {
      console.log('bub')
      let li = $("<li>");
      let card = $("<div>");
      let todoEnd = $("<i>");
      let checkbox = $("<input>");
      let title = $("<p>");
      let changeBox = $("<div>");
      let edit = $("<i>");
      let trash = $("<i>");

      let todoTitle = function() {
        if (todo.txt.length>20){
          let word = '';
          for (let i=0; i<20; i++){
            word+=todo.txt[i];
          }
          return word.trimEnd()+"..."
        } else {
          return todo.txt.trimEnd();
        };
      }

      li.addClass("todoLi");

      card.addClass("card");
      
      checkbox.addClass("form-check-input");
      checkbox.attr("type", "checkbox");

      // title.text(todo.title);
      title.text(todoTitle);

      changeBox.addClass("changeBox");

      edit.addClass("far fa-edit");
      trash.addClass("fa fa-trash-o");


      
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
          renderDone();
        } else {
          console.log("Am I here?")
          changeBox.append(edit);
          changeBox.append(trash);
          card.append(checkbox);
          card.append(title);
          card.append(changeBox);
          li.append(card);
          ul.append(li);
          areaDiv.append(ul);

          edit.one("click", editDeletable);

          function editDeletable(){
            btnClick(todo.title);
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

  // textarea.attr("readonly", true);

  titleDiv.addClass("col-2 col-md-1 hour text-center py-3");
  titleDiv.text(hourLabel);

  areaDiv.addClass("col-8 col-md-10 description areaDiv");
  areaDiv.attr("rows", "3");

  textarea.addClass("col-8 col-md-10 description");
  textarea.attr("rows", "3");
  
  // if (hour.isBefore(now, "hour")){
    
  // } else {
    
  // }
  
  // button.attr("aria-label", "save")
  
  // idiom.addClass("fas fa-save");
  
  idiom.addClass("fas fa-plus ariaEl");
  idiom.attr("aria-hidden", "true");


  
  if (hour.isAfter(now, "hour")||hour.isSame(now, "hour")){
    button.append(idiom);
  }

  if (hourObject.todos.length>0){
    renderTodos();
  };

  function appendEls (){
    hourDiv.append(titleDiv);
    if (isWrite){
      hourDiv.append(textarea);
    } else {
      hourDiv.append(areaDiv);
    };
    hourDiv.append(button);
    
  }
  
  // if (hour.isAfter(now, "hour")||hour.isSame(now, "hour")){
  //   button.append(idiom);
  // }

  // if (hourObject.todos.length>0){
  //   renderTodos();
  // };

  // hourDiv.append(titleDiv);
  // hourDiv.append(textarea);
  // hourDiv.append(button);
  // containerEl.append(hourDiv);
  appendEls()
  containerEl.append(hourDiv);
  btnListen()

  function btnListen(){
    button.one("click", btnDeletable);
    function btnDeletable (){
      btnClick('');
    };
  };

  function btnClick (value) {
    button.addClass("saveBtn").removeClass("addBtn");
    button.attr("aria-label", "save")
    idiom.addClass("fa-save").removeClass("fa-plus");
    areaDiv.html('');
    // textarea.attr("readonly", false);

    if (hour.isAfter(now, "hour")){
      hourDiv.removeClass("future");
    } else if (hour.isSame(now, "hour")){
      hourDiv.removeClass("present");
    };
    hourDiv.addClass("writable");
    isWrite = true;
    appendEls();

    button.one("click", saveDeletable);

    function saveDeletable (){
      // let word = '';
      // let taInput = textarea.val();

      // if (taInputt.length>20){
      //   for (let i=0; i<20; i++){
      //     word+=taInput[i];
      //   }
      //   word = word.trimEnd()+"..."
      // } else {
      //   word = taInput.trimEnd();
      // };

         
      let todoObject = {
        txt: textarea.val(),
        index: hourObject.todos.length,
        isDone: false,
        isFail: false,
        // title: function() {
        //   if (this.txt.length>20){
        //     let word = '';
        //     for (let i=0; i<20; i++){
        //       word+=this.txt[i];
        //     }
        //     return word.trimEnd()+"..."
        //   } else {
        //     return this.txt.trimEnd();
        //   };
        // }
      };

      
      

      button.addClass("addBtn").removeClass('saveBtn');
      button.attr("aria-label", "plus");
      idiom.addClass("fa-plus").removeClass('fa-save');
      textarea.val(value);
      // textarea.attr("readonly", true);

      hourDiv.removeClass("writable");
      isWrite = false;
      appendEls();
      checkHour();
      if (todoObject.txt!==''&&todoObject.txt!==undefined){
        
        hourObject.todos.push(todoObject);
        
        console.log(todoMaster.length);
        // localStorage.setItem("todoList", JSON.stringify(hourObject.todos))
        if (!todoMaster.includes(hourObject)){
          hourObject.index = todoMaster.length;
          todoMaster.push(hourObject);
        } else {
          
          todoMaster.splice(hourObject.index, 1, hourObject)
        };
        localStorage.setItem("masterList", JSON.stringify(todoMaster));
      };
      renderTodos();
      btnListen();
      
    
    };


  };
};


function deleteListeners(){

}
    

// function buttonClick(event, )

