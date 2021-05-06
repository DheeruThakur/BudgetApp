// budget Controller
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value; 
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value; 
  };

  var data = {

    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
     addItem: function(type, des, val) {
      var newItem, ID;

      // create new ID
      
      if( data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }
      else {
        ID = 0;
      }
      

      // create new item  based on 'inc' or 'exp'
      if(type === 'exp'){
        newItem = new Expense(ID, des, val)
      }else if(type === 'inc'){
        newItem = new Income(ID, des, val)
      }

      // push it into data structure
      data.allItems[type].push(newItem);
      // return the new item 
      return newItem;
    },
    testing: function(){
      console.log(data);
    }
  };


})();


// UI Controller
var UIController = (function() {

 var DOMstrings = {
  inputType: '.add__type',
  inputDescription: '.add__description',
  inputValue: '.add__value',
  inputBtn: '.add__btn',
  incomeContainer: '.income__list',
  expenseContainer: '.expenses__list'
 };

 return {
  getItem: function(){
   return {
    type: document.querySelector(DOMstrings.inputType).value, // will be either 'inc' or 'exp'
    description: document.querySelector(DOMstrings.inputDescription).value,
    value: document.querySelector(DOMstrings.inputValue).value
   };
  },

  addListItem: function(obj , type) {
    var html , newHtml , element;
    // create HTML strings with place holders

  if(type === 'inc') {
    element = DOMstrings.incomeContainer;

    html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
  }
  else if(type === 'exp') {
    element = DOMstrings.expenseContainer;

    html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
  }
   
    // replace the placeholders with some actual data

    newHtml = html.replace('%id%' , obj.id);
    newHtml = newHtml.replace('%description%' , obj.description);
    newHtml = newHtml.replace('%value%' , obj.value);

    // insert the html into the DOM 

    document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);

  },

  clearFields: function(){
    var fields, fieldArr;

    fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
    fieldArr = Array.prototype.slice.call(fields);

    fieldArr.forEach(function(current, index, array){
      current.value = "";
    });

    fieldArr[0].focus();

  },

   getDOMstrings: function(){
    return DOMstrings;
   }
 };


})();



// Global Controller
var controller = (function(budgetCtrl, UICtrl){

 var setupEventListener = function(){
  var DOM = UICtrl.getDOMstrings();
  document.querySelector(DOM.inputBtn).addEventListener('click' , ctrlAddItem);
  
  document.addEventListener('keypress' , function(event){
  
  if(event.keycode === 13 || event.which === 13){
   ctrlAddItem();
   }
  });
 };


 var ctrlAddItem = function(){
  var input , newItem ;

  // 1. Get the filed input data
   input = UICtrl.getItem();     

  // 2. Add items to the budget Controll
   newItem = budgetCtrl.addItem(input.type, input.description, input.value);
  // 3. Add items to the UI
   UICtrl.addListItem(newItem , input.type)

   // 4. clear the fields
   UICtrl.clearFields();

  // 4. calculate the budget

  // 5. display the budget on the UI
  
 };

 return {
  init: function(){
   console.log('Application has started.');
   setupEventListener();
  }
 };

})(budgetController, UIController);

controller.init();