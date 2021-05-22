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

  var calculateTotal = function(type){
    sum = 0;
    data.allItems[type].forEach(function(cur){
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {

    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
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


    deleteItem: function(type , id) {
      var ids , index;

      ids = data.allItems[type].map(function(current){
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1) {
        data.allItems[type].splice(index , 1);
      }

    }, 


    calculateBudget: function(){
      // calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }
      else{
        data.percentage = -1;
      }
      
    },

    getBudget: function(){
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
      
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
  expenseContainer: '.expenses__list',
  budgetLabel: '.budget__value',
  incomeLabel: '.budget__income--value',
  expenseLabel: '.budget__expenses--value',
  percentageLabel: '.budget__expenses--percentage',
  container: '.container'
 };

 return {
  getItem: function(){
   return {
    type: document.querySelector(DOMstrings.inputType).value, // will be either 'inc' or 'exp'
    description: document.querySelector(DOMstrings.inputDescription).value,
    value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
   };
  },

  addListItem: function(obj , type) {
    var html , newHtml , element;
    // create HTML strings with place holders

  if(type === 'inc') {
    element = DOMstrings.incomeContainer;

    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
  }
  else if(type === 'exp') {
    element = DOMstrings.expenseContainer;

    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
  }
   
    // replace the placeholders with some actual data

    newHtml = html.replace('%id%' , obj.id);
    newHtml = newHtml.replace('%description%' , obj.description);
    newHtml = newHtml.replace('%value%' , obj.value);

    // insert the html into the DOM 

    document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);

  },

  deleteListItem: function(selectorID) {

    var el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);

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

  displayBudget: function(obj){

    document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
    document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
    document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
    
    if(obj.percentage > 0){
      document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
    }
    else{
      document.querySelector(DOMstrings.percentageLabel).textContent = "---";
    }
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

  document.querySelector(DOM.container).addEventListener('click' , ctrlDeleteItem);

 };

 var updateBudget = function(){
   // 1. calculate the budget
        budgetCtrl.calculateBudget();
   // 2. return the budget
        var budget = budgetCtrl.getBudget();
   // 3. display the budget on the UI
        UICtrl.displayBudget(budget);
 };

 var ctrlAddItem = function(){
  var input , newItem ;

  // 1. Get the filed input data
   input = UICtrl.getItem(); 
   
   if(input.description !== "" && !isNaN(input.value) && input.value > 0){
   
    // 2. Add items to the budget Controll
   newItem = budgetCtrl.addItem(input.type, input.description, input.value);
   // 3. Add items to the UI
    UICtrl.addListItem(newItem , input.type)
 
    // 4. clear the fields
    UICtrl.clearFields();
 
    // 5. calculate and display budget
    updateBudget();

   }
  
 };

 var ctrlDeleteItem = function(event) {
  var itemID , splitID , type , ID;

  itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    
  if(itemID) {

    // inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete the item from the data structure.
      budgetCtrl.deleteItem(type , ID);

      // 2. delete the item from the user iterface.
      UICtrl.deleteListItem(itemID);

      // 3. update the budget in the user interface.
      updateBudget();
    }

 };

 return {
  init: function(){
   console.log('Application has started.');
   setupEventListener();
  }
 };

})(budgetController, UIController);

controller.init();