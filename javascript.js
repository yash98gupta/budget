//budget controller
var budgetController = (function(){

var expense = function(id,description,value)
{
  this.id=id;
  this.description=description;
  this.value=value;
  this.percentage=-1;
};

expense.prototype.calcPercentage = function(totalIncome)
{
  if (totalIncome > 0) {
              this.percentage = Math.round((this.value / totalIncome) * 100);
          } else {
              this.percentage = -1;
          }
};

expense.prototype.getPercentage = function() {
        return this.percentage;
    };

var income = function(id,description,value)
{
  this.id=id;
  this.description=description;
  this.value=value;
};

var budgetTotal = function(type)
{
  var sum=0;
  data.allItems[type].forEach(function(current)
{
  sum+=current.value;
});
data.totals[type]=sum;
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
        budget : 0,
        percentage: -1
      };
var ID,newitem;
return {
  addItem: function(type,des,val)
  {
    var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                newItem = new expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new income(ID, des, val);
            }

        data.allItems[type].push(newItem);

        return newItem;
  },

  calcbudget: function()
  {
    budgetTotal('inc');
    budgetTotal('exp');

    // budget hota hai income-expense

    data.budget = data.totals.inc - data.totals.exp;
    if(data.totals.inc>0)
    {
    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    }
    else {
      {
        data.percentage= -1;
      }
    }
  },

  getbudget: function()
  {
    return{
    totalbuget:data.budget,
    totalinc:data.totals.inc,
    totalexp:data.totals.exp,
    totalpercentage:data.percentage
  };
},
  deleteItem: function(type, id) {
    var ids, index;

    ids = data.allItems[type].map(function(current) {
        return current.id;
    });

    index = ids.indexOf(id);

    if (index !== -1) {
        data.allItems[type].splice(index, 1);
    }
  },
  calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.totals.inc);
            });
        },


        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        }
};

})();

//UI controller
var UIController = (function(){

// defined all the classes in one place so that kabhi future mai
//if i want to change the class name i doont have to make changes everywhere
      var DOMstrings = {
          inputType: '.add__type',
          inputDescription: '.add__description',
          inputValue: '.add__value',
          inputBtn: '.add__btn',
          incomeContainer: '.income__list',
          expensesContainer: '.expenses__list',
          budgetLabel: '.budget__value',
          incomeLabel: '.budget__income--value',
          expensesLabel: '.budget__expenses--value',
          percentageLabel: '.budget__expenses--percentage',
          container: '.container',
          expensesPercLabel: '.item__percentage',
          currmonthyear:'.budget__title--month'

        };

          return {
              getInput: function() {
                  return {
                      type: document.querySelector(DOMstrings.inputType).value,
                      description: document.querySelector(DOMstrings.inputDescription).value,
                      value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
                  };
              },


              addListItem: function(obj, type) {
                  var html, newHtml, element;

                  if (type === 'inc') {
                      element = DOMstrings.incomeContainer;

                      html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                  } else if (type === 'exp') {
                      element = DOMstrings.expensesContainer;
                      html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                  }
                  newHtml = html.replace('%id%', obj.id);
                  newHtml = newHtml.replace('%description%', obj.description);
                  newHtml = newHtml.replace('%value%',obj.value);

                  document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
              },

                getDOMstrings: function() {
                    return DOMstrings;
                },

                 clearItems: function() {
                   var fields,fieldArr;
                   fields=document.querySelectorAll(DOMstrings.inputDescription + ',' +DOMstrings.inputValue);
                   console.log(fields) ;
                   fieldArr=Array.prototype.slice.call(fields);

                   fieldArr.forEach(function(current,index,array)
                 {
                   current.value="";
                 });
                 fieldArr[0].focus();
               },

               showbudget : function(obj)
               {
                 document.querySelector(DOMstrings.budgetLabel).textContent=obj.totalbuget;
                 document.querySelector(DOMstrings.incomeLabel).textContent='+'+obj.totalinc;
                 document.querySelector(DOMstrings.expensesLabel).textContent='-'+obj.totalexp;
                 if(obj.percentage >0)
                 {
                   document.querySelector(DOMstrings.percentageLabel).textContent=obj.totalpercentage+'%';
                 }
                 else
                   {
                     document.querySelector(DOMstrings.percentageLabel).textContent='---';
                   }

               },
               deleteListItem: function(SelectorId)
               {
                 var el = document.getElementById(SelectorId);
                 el.parentNode.removeChild(el);
               },
               displayperc: function(percentage)
               {
                 var totalexpperc=document.querySelector(DOMstrings.percentageLabel);
                  var percfields = document.querySelectorAll(DOMstrings.expensesPercLabel);
                  var percfieldArr=Array.prototype.slice.call(percfields);
                  var sum=0;
                  percfieldArr.forEach(function(current,index)
                {
                  if (percentage[index] > 0) {
                    current.textContent = percentage[index] + '%';
                    sum = sum + parseInt(current.textContent);
                } else {
                    current.textContent = '---';
                }
              });
              totalexpperc.textContent= '-' + sum + '%';
            },

            currentdate: function()
            {
              var month, year;
              var now = new Date();
              var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              month=now.getMonth();
              year=now.getFullYear();
              document.querySelector(DOMstrings.currmonthyear).textContent= months[month] + ' ' + year;

            }

          };

})();

//main controller

var controller = (function(uictr , budgetctr){

function budgetadd()
{
  //Calculate the budget
    budgetctr.calcbudget();
 //get budget total ,total income , total expense , percentage
    var budget=budgetctr.getbudget();

    uictr.showbudget(budget);
};

var percentageupdate = function()
{
  budgetctr.calculatePercentages();
  var percentage = budgetctr.getPercentages();
  uictr.displayperc(percentage);

};

function controladditems()
{
       var input, newItem;

        // 1. Get the field input data
        input = uictr.getInput();

          if(input.description !== "" && !isNaN(input.value) && input.value>0)
            {
            // 2. Add the item to the budget controller
            newItem = budgetctr.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            uictr.addListItem(newItem, input.type);
            //4.clear description and value fiels after submitted
            uictr.clearItems();
            //call budgetadd function
            budgetadd();
            percentageupdate();
          };
    };

var eventlisteners = function()
{
  var dom = uictr.getDOMstrings();

  document.querySelector(dom.inputBtn).addEventListener('click',controladditems);

  document.addEventListener('keypress',function(event){
  if(event.keyCode === 13)
  {
    controladditems();
  }
});

  document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);

};

var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

//parent pe ja ja ke fir se immediate child par aayegay and then delete karegay
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {

        //inc-1
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        // 1. delete the item from the data structure
        budgetctr.deleteItem(type, ID);

        // 2. Delete the item from the UI
        uictr.deleteListItem(itemID);

        // 3. Update and show the new budget
          budgetadd();

    }
};
return{
  init: function()
  {
    eventlisteners();
    uictr.currentdate();
    uictr.showbudget({
                totalbudget: 0,
                totalinc: 0,
                totalexp: 0,
                totalpercentage: -1
    });
  }
};

})(UIController,budgetController);

//for calling my main controller(module)
controller.init();
