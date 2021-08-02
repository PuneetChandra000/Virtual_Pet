var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed, lastFed;
var feedtime;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  feed = createButton("Feed the dog");
  feed.position(900, 95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read feedtime value from the database 
  var feedtime = database.ref("feedtime");
  feedtime.on("value", function(data){lastFed = data.val()} );

  // var food = database.ref("food");
  // food.on("value", readStock, addFoods);

  //write code to display text lastFed time here
  if (lastFed>=12){
    text("Last Feed : 11pm "+lastFed,350, 30);
  }else if (lastFed == 0){
    text("Last Feed : 12am"+lastFed, 350, 30);
  }else{
    text("Last Feed : 11am"+lastFed, 350, 30);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  console.log("Entered feed dog");
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var food_stock_val = foodObj.getFoodStock();
  if (food_stock_val <= 0){
    foodObj.updateFoodStock(food_stock_val * 0);

  }else{
    foodObj.updateFoodStock(food_stock_val -1);
  }
  console.log("exiting feed dog");
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedtime:hour()
  })
}

//function to add food in stock
function addFoods(){
  console.log("entering add foods");
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
  console.log("exiting add foods");
}
