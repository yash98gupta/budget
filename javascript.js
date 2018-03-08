//budget controller
var budgetController = (function(){

var expense = function(id,description,value)
{
  this.id=id;
  this.description=description;
  this.value=value;
}

var income = function(id,description,value)
{
  this.id=id;
  this.description=description;
  this.value=value;
}

var data = { allitems: {exp:[],inc:[]} , total: {exp:0,inc:0} }
var Id,newitem;
return {
  additem: function(type,description,value)
  {
    if(data.allitems[type].length>0)
    {
      Id=data.allitems[type][data.allitems[type].length - 1].id + 1;
    }
    else {
      Id=0;
    }
    if(type==='exp'){
      newitem = new expense(Id,description,value);
    }
    else{
      newitem = new income(Id,description,value);
    }
  }

}

})();

//UI controller
var UIController = (function(){

var domstr =
{
  plusminus: '.add__type',
  inputdescription: '.add__description',
  inputvalue: '.add__value',
  inputtick:'.add__btn',
  incomecontainer: '.income__list',
  expensecontainer: 'expenses__list'
}

  return
    {

      getinput: function()
      {
        return
        {
          type:document.querySelector(domstr.plusminus).value,
          description:document.querySelector(domstr.inputdescription).value,
          value:document.querySelector(domstr.inputvalue).value
        }
      },

      addlistitem: function(obj,type)
      {
        var html,newhtml,element;
        if(type === 'inc')
        {
          element=document.querySelector(domstr.incomecontainer);
          html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        else {
          element=document.querySelector(domstr.expensecontainer);
          html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        newhtml=html.replace('%id%',obj.id);
        newhtml=newhtml.replace('%description%',obj.description);
        newhtml=newhtml.replace('%value%',obj.value);

        element.insertAdjacentHTML('beforeend',newhtml);
      },

      domstrings: function()
      {
        return domstr;
      }

    }

})();

//main controller
var controller = (function(uictr,budgetctr){

var input,newitem;

function eventlisten()
{
  //get input the plus/minus description value
  input=uictr.getinput();
  //store the above input in a the table
  newitem=budgetController.additem(input.type,input.description,input.value);
  //display the input in the table using UI controller
  diaply=uictr.addlistitem(newitem,input.type);

}

var eventlisteners = function()
{
  var dom=uictr.domstrings();

  document.querySelector(dom.inputtick).addEventListener('click',eventlisten);

  document.addEventListener('keypress',function(event){
  if(event.keycode === 13)
  {
    eventlisten();
  }
});

}
return{
  init: function()
  {
    eventlisteners();
  }
}

})(UIController,budgetController);
controller.init();
