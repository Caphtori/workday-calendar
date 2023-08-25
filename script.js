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

  
let headerEl = $("#header-div");
let containerEl = $("#container");

let todoMaster = [];
let pageDay = dayjs();



// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  renderHeader()
  renderSchedule();
  
  function renderHeader(){
    
    let dateCard = $("<div>");
    let dateTxt = $("<h3>");
    let leftArrow = $("<i>");
    let rightArrow = $("<i>");
    let revert = $("<i>");
    let calendar = $("<i>");
    
    // let dateCardCont = $("<div>");
    // let calendarCard = $("<div>");
    // let dayDM = $("<div>");
    // let dayA = $("<a>");
    // let dayDiv = $("<div>");
    // let monthDM = $("<div>");
    // let monthA = $("<a>");
    // let monthDiv = $("<div>");
    // let yearDM = $("<div>");
    // let yearA = $("<a>");
    // let yearDiv = $("<div>");

    // dayDiv.addClass("dropdown-menu");
    // monthDiv.addClass("dropdown-menu");
    // yearDiv.addClass("dropdown-menu");



  
    // dateCardCont.addClass("dateCardCont");
    // calendarCard.addClass("calendarCard NV");


    dateCard.addClass("dateCard");
    leftArrow.addClass("fas fa-arrow-left customIcon arrowI");
    rightArrow.addClass("fas fa-arrow-right customIcon arrowI");
    revert.addClass("fa fa-refresh customIcon");
    calendar.addClass("far fa-calendar-alt customIcon");
    calendar.attr("id", "datepicker");
  
  
    writeDate()
  
    dateCard.append(revert);
    dateCard.append(dateTxt);
    dateCard.append(calendar);
    headerEl.append(leftArrow);

    // calendarCard.append(dayDiv);
    // calendarCard.append(monthDiv);
    // calendarCard.append(yearDiv);
    // dateCardCont.append(dateCard);
    // dateCard.append(calendarCard);
    // headerEl.append(dateCardCont);

    headerEl.append(dateCard);
    headerEl.append(rightArrow);
  
    leftArrow.on("click", ()=>{
      pageDay = pageDay.subtract(1, 'day');
      containerEl.html('');
      writeDate()
      renderSchedule()
    })
  
    rightArrow.on("click", ()=>{
      pageDay = pageDay.add(1, 'day');
      containerEl.html('');
      writeDate();
      renderSchedule();
    })
  
    revert.on("click", ()=>{
      pageDay=dayjs();
      writeDate()
      containerEl.html('');
      renderSchedule();
    })
  
    function writeDate(){
      dateTxt.text(pageDay.format("MMMM D, YYYY (ddd)"));
    };


    function calendarFn(){

    }



  }
  
  function renderSchedule(){
    let dayStart = pageDay.hour(9).minute(0).second(0);
    let dayEnd = pageDay.hour(17).minute(0).second(0);
  
    //FOR TESTING PURPOSES ONLY
    // dayStart = pageDay.hour(0).minute(0).second(0);
    // dayEnd = pageDay.hour(23).minute(0).second(0);
    // 
  
  
    let dayLength = dayEnd.diff(dayStart, "hour")+1;
    for (let i=0; i<dayLength; i++){
      if (pageDay.day()===0 || pageDay.day()===6){
        RenderWeekend(i, dayStart, dayEnd);
      } else {
        renderHour(i, dayStart, dayEnd);
      }
      
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
        if (dayjs(todoMaster[i].hour).isSame(hourObject.hour, "year")&&dayjs(todoMaster[i].hour).isSame(hourObject.hour, "date")&&dayjs(todoMaster[i].hour).isSame(hourObject.hour, "hour")){
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
  
    timeDiv.addClass("col-2 col-md-1 hour text-center py-3");
    timeDiv.text(hourLabel);
    if (hour.hour()===endDay.hour()){
      timeDiv.addClass("bottomDiv")
    };
  
    hourDiv.addClass("row time-block");
    
  
    areaDiv.addClass("col-8 col-md-10 description areaDiv");
    areaDiv.attr("rows", "3");
  
    textarea.addClass("col-8 col-md-10 description ph1");
    textarea.attr("rows", "3");
    textarea.attr("placeholder", "Body...");
  
  
    button.addClass("btn btnCustom col-2 col-md-1");
    
    idiom.addClass("fas fa-plus ariaEl");
    idiom.attr("aria-hidden", "true");
  
    closeBtn.addClass("btn btnCustom col-2 col-md-1 closeBtn");
    closeIdiom.addClass("fa fa-close ariaEl");
    closeIdiom.attr("aria-hidden", "true");
  
  
    
    if (hour.isAfter(now)||hour.isSame(now, "hour")){
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
    btnListen(false);
  
    // Checks the hour every minute to make sure the schedule is correct.
    function initHourcheck(){
      let wait = (60-dayjs().second())*1000;
      setTimeout(checkHourInt, wait);
    };
  
    function checkHourInt(){
      let chInterval = setInterval(()=>{
       
        now = dayjs();
        
        checkHour();
  
        if (hour.isBefore(now, "hour")){
          clearInterval(chInterval);
          btnListen(false)
          containerEl.html('');
          renderSchedule();
        }
  
      }, 60000);
      
    };
    // 
  
    // Checks the hour of the current slot v IRL time and renders elements accordingly.
    
    function checkHour(){
      if (hour.isBefore(now, "hour")){
        hourDiv.addClass("past").removeClass("present").removeClass("future").removeClass("present");
        button.html('');
        button.addClass("noBtnMP")
      } else{
        if (hour.isAfter(now, "hour")){
          hourDiv.addClass("future").removeClass("past").removeClass("present");
        } else {
          hourDiv.addClass("present").removeClass("past").removeClass("future");
        }
        if (!isWrite){
          button.addClass("addBtn");
          button.attr("aria-label", "plus")
        }
        
      };
    };
    //
  
    // Render Elements
    function renderTodos(){
      let ul = $("<ul>");
      for (let i=0; i<hourObject.todos.length; i++){
        renderSingle(hourObject.todos[i], hourObject);
      };
  
      function renderSingle (todo, todoObj) {
        let li = $("<li>");
        // let card = $("<div>");
        let todoEnd = $("<i>");
        let checkbox = $("<input>");
        let title = $("<p>");
        let changeBox = $("<div>");
        let openI = $("<i>");
        let trash = $("<i>");
  
        ul.addClass("todoUl");
  
        li.addClass("todoLi");
  
        todoEnd.addClass("todoEnd");
        
        checkbox.addClass("form-check-input checkBox");
        checkbox.attr("type", "checkbox");

        title.text(todo.title);
  
        changeBox.addClass("changeBox");
  
        openI.addClass("fas fa-book-open changeIcon");
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
  
            changeBox.append(openI);
            changeBox.append(trash);
            li.append(checkbox);
            li.append(title);
            li.append(changeBox);
            ul.append(li);
            areaDiv.append(ul);
  
            
  
            
            
            checkbox.one("change", checkBoxFn);
  
            trash.one("click", deleteTodo);
          };
          
          
        };
        function openIDeletable(){
          readMode(todo);
        };
        openI.one("click", openIDeletable);
  
        function checkBoxFn (){
          todo.isDone = true;
          todoMaster.splice(todoObj.index, 1, todoObj);
          localStorage.setItem("masterList", JSON.stringify(todoMaster));
          areaDiv.html('')
          renderTodos();
        };
  
        function deleteTodo(){
          for (let i=0; i<todoObj.todos.length; i++){
            if (todo.index===i){
              todoObj.todos.splice(i, 1);
            }
          };
          
          localStorage.setItem("masterList", JSON.stringify(todoMaster));
          areaDiv.html('')
          renderTodos();
        };
  
  
        function renderDone (){
          // REMOVE EVENTLISTENERS
          openI.off("click", openIDeletable);
          checkbox.off("change", checkBoxFn);
  
          changeBox.append(openI);
          li.append(todoEnd);
          li.append(title);
          li.append(changeBox);
          ul.append(li);
          areaDiv.append(ul);
        };
        
      };
  
      
      appendEls ();
    };
    
    function appendEls (){
      hourDiv.append(timeDiv);
      hourDiv.append(areaDiv);
      hourDiv.append(button);
      
    }
    //
  
    function readMode(todoVar){
      btnListen(true);
      let titleLen = todoVar.title.length;
  
      areaDiv.html('');
  
      textarea.attr("readonly", true);
      titlearea.attr("readonly", true);
  
      titeLabel.text("Title ("+titleLen+"/50 chars):");
      titlearea.val(todoVar.title);
      
      textarea.val(todoVar.txt);
  
      
      button.addClass("RO");
      if (hour.isBefore(now, "hour")){
        button.removeClass("noBtnMP");
      };
      button.attr("aria-label", "close");
      idiom.addClass("fa fa-close").removeClass("fa-plus");
      
      
      hourDiv.addClass("writable").removeClass("past").removeClass("present").removeClass("future");
      areaDiv.html('');
      button.append(idiom);
      areaDiv.append(inputDiv)
      areaDiv.append(inputDiv);
  
      button.one("click", ()=>{
        textarea.attr("readonly", false);
        titlearea.attr("readonly", false);
  
        button.removeClass('RO');
        button.attr("aria-label", "plus");
        idiom.addClass("fa-plus").removeClass('fa-close');
        hourDiv.removeClass("writable");
        areaDiv.html('');
        areaDiv.removeClass("focus");
        checkHour();
        renderTodos();
  
        checkHour();
  
        btnListen(false);
      })
    }
  
  
    // Event Listeners
    function btnListen(isRO){
      if (isRO){
        button.off("click", btnDeletable);
      } else {
        if (hour.isAfter(now, "hour")||hour.isSame(now, "hour")){
          button.one("click", btnDeletable);
          function btnDeletable (){
            btnClick('', '');
          };
        } else {
          button.off("click", btnDeletable);
        };
      };
      
    };
  
  
    // ADD IN EDIT BUTTON
    function btnClick (titleVal, value) {
      let titleLen = 0;
      let isSavable = false;
      let saveSwitch = false;
  
  
      titlearea.val(titleVal);
      textarea.val(value);
  
  
  
      idiom.addClass("fa-save").removeClass("fa-plus");
      if (titlearea.val()!==''&&titlearea.val()!==null&&titlearea.val()!==undefined){
        isSavable = true;
        button.addClass("saveBtn").removeClass("addBtn").removeClass("nsBtn");
        idiom.addClass("nsAria").removeClass("ariaEl");
      } else {
        button.addClass("nsBtn").removeClass("addBtn");
      }
      titeLabel.text("Title ("+titleLen+"/50 chars):");
      
      button.attr("aria-label", "save")
      
      areaDiv.html('');
  
      if (hour.isAfter(now, "hour")){
        hourDiv.removeClass("future");
      } else if (hour.isSame(now, "hour")){
        hourDiv.removeClass("present");
      };
      hourDiv.addClass("writable");
      isWrite = true;
      areaDiv.html('');
      areaDiv.append(inputDiv);
      areaDiv.append(closeBtn);
      titlearea.focus();
      areaDiv.addClass("focus");
  
      function saveClick(){
        if (isSavable){
            button.one("click", saveDeletable);
          };
      };
  
      saveClick();
      
      closeBtn.one("click", ()=>{
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
        btnListen(true);
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
  
            button.addClass("saveBtn").removeClass("nsBtn");
            idiom.addClass("ariaEl").removeClass("nsAria");
            if (!saveSwitch){
              saveClick()
              saveSwitch=true;
            }
            
            
          } else {
            button.addClass("nsBtn").removeClass("saveBtn");
            saveSwitch=false;
            if (saveSwitch){
              saveClick()
              saveSwitch=false;
            }
          }
        });
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
  
        hourDiv.removeClass("writable");
        isWrite = false;
        areaDiv.html('');
        areaDiv.removeClass("focus");
        checkHour();
          
        hourObject.todos.push(todoObject);
        if (!todoMaster.includes(hourObject)){
          hourObject.index = todoMaster.length;
          todoMaster.push(hourObject);
        } else {
          
          todoMaster.splice(hourObject.index, 1, hourObject)
        };
        localStorage.setItem("masterList", JSON.stringify(todoMaster));
        renderTodos();
        btnListen(false);
        
      
      };
      
  
    };
    //
  
  };
  
  
  
  
  function RenderWeekend(iHour, startDay, endDay){
    let hour = startDay.add(iHour, "hour");
    let hourLabel = hour.format('hA');
  
    let hourDiv = $("<div>");
    let timeDiv = $("<div>");
    let areaDiv = $("<div>");
    let falseBtn = $("<div>");
    let h4 = $("<h4>");
  
    hourDiv.addClass("row time-block past");
  
    timeDiv.addClass("col-2 col-md-1 hour text-center py-3");
    timeDiv.text(hourLabel);
    if (hour.hour()===endDay.hour()){
      timeDiv.addClass("bottomDiv")
    };
  
    falseBtn.addClass("btn btnCustom col-2 col-md-1 noBtnMP");
  
    h4.text("Weekend");
  
    areaDiv.addClass("col-8 col-md-10 description areaDiv");
    areaDiv.attr("rows", "3");
  
    areaDiv.append(h4);
    hourDiv.append(timeDiv);
    hourDiv.append(areaDiv);
    hourDiv.append(falseBtn);
  
    containerEl.append(hourDiv);
  
    
  
  };


});


    

// function buttonClick(event, )

