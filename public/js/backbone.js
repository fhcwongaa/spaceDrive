

// ---------------Router for SPA ----------- 
var gameRouter = Backbone.Router.extend({
	routes:{
		"chatroom": "showChatRoom",
		"practice": "showPractice",
		"settings": "showSettings"
	},
	showChatRoom: function(){
		$("#display-content").empty();
		$("#practice").removeClass("active");
		$("#chatroom").addClass("active");
		$("#display-content").empty();
		var chatRoom = '<div class="chat-window row"><div class="chat-header row"><h1>Chatroom</h1> </div><div class="chat-messages row" id="messages"></div></div><div class="row"><div class="input-group chat-input"><form action=""><input class="form-control" placeholder="Enter Your Message" aria-describedby="sizing-addon1"autocomplete="off"id="m"></form><span class="input-group-addon" id="sizing-addon1">Send</span></div></div>';
      $("#display-content").append(chatRoom);
	},
	showPractice: function(){

	// ----------------Start Phaser Game-------------------
	console.log("hit practice");
	$("#chatroom").removeClass("active");
	$("#practice").addClass("active");
	$("#display-content").empty();
	// new Ellipse(x, y, width, height)
	var raceTrack;
	var player;
	var cursors;
	var platforms;
	var ACCLERATION = 600;
	var DRAG = 400;
	var MAXSPEED = 500;
	var carList;
	var bullets;
	var fireRate = 100;
	var nextFire = 0;
	var weapons = [];
	var myId = 0;
	var Weapon = {};
	var car;
	var carList = [];



	//create a projectile
	var Bullet = function (game, key){
	    Phaser.Sprite.call(this, game, 0, 0, key);

	    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

	    this.anchor.set(0.5);

	    this.checkWorldBounds = true;
	    this.outOfBoundsKill = true;
	    this.exists = false;

	    this.tracking = false;
	    this.scaleSpeed = 0;
	}

	//create a bullet prototype
	Bullet.prototype = Object.create(Phaser.Sprite.prototype);
	Bullet.prototype.constructor = Bullet;

	Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

	        gx = gx || 0;
	        gy = gy || 0;

	        this.reset(x, y);
	        this.scale.set(1);
	        //bullet angular velocity
	        this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

	        this.angle = angle;
	        //set bullet gravity when fired
	        this.body.gravity.set(gx, gy);

	    };

	Bullet.prototype.update = function () {

	    if (this.tracking)
	    {
	        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
	    }

	    if (this.scaleSpeed > 0)
	    {
	        this.scale.x += this.scaleSpeed;
	        this.scale.y += this.scaleSpeed;
	    }

	};
	//declare weapon object

	Weapon.SingleBullet = function (game) {

	    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

	    this.nextFire = 0;
	    this.bulletSpeed = 600;
	    this.fireRate = 150;

	    for (var i = 0; i < 64; i++)
	    {
	        this.add(new Bullet(game, 'laser'), true);
	    }

	    return this;

	};

	Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
	Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;
	Weapon.SingleBullet.prototype.fire = function (source) {

	    if (this.game.time.time < this.nextFire) { return; }

	    var x = source.x + 10;
	    var y = source.y + 10;

	    this.getFirstExists(false).fire(x, y, player.angle, this.bulletSpeed, 0, 0);

	    this.nextFire = this.game.time.time + this.fireRate;

	};



	//--------Make a Car Class---------

	Car = function (index,game,player){
		//set user input
		this.cursor = {
			left:false,
			right:false,
			up:false,
			down:false,
			fire:false
		}


		//set user input
		this.input = {
			left:false,
			right:false,
			up:false,
			down:false,
			fire:false
		}
		//location of car
		var x = 0;
		var y = 0;

		this.game = game;
		this.player = player;
		this.car = game.add.sprite(x,y,'enemy','car1');
	   this.car.anchor.set(0.5);
	   // this.car.body.bounce.setTo(0, 0);


		this.car.id = index;
		game.physics.enable(this.car, Phaser.Physics.ARCADE);
		this.car.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
		this.car.body.collideWorldBounds = true;
		// this.car.body.bounce.setTo(0, 0);
		this.car.body.drag.setTo(DRAG, DRAG);
		this.car.body.velocity.x = 0;
		this.car.body.velocity.y = 0;
		this.car.body.acceleration.x = 0;
		this.car.body.angularVelocity = 0;
		this.car.body.maxVelocity.x = 500;
		this.car.body.maxVelocity.y = 500;
		game.physics.arcade.velocityFromRotation(this.car.rotation, 0, this.car.body.velocity);

	}

	Car.prototype.update = function(){
		//set cursor to the inputs
		for (var i in this.input) this.cursor[i] = this.input[i];	

			    if (this.cursor.left)
			    {
			    	console.log("hit");
			        //  Move to the left
			        this.car.body.angularVelocity = -150;
			    }
			    else if (this.cursor.right)
			    {
			    				    	console.log("hit");

			        //  Move to the right
			        this.car.body.angularVelocity = 150;
			    }
			    if (this.cursor.up)
			    {
			    				    	console.log("hit");

			    	
			        game.physics.arcade.velocityFromAngle(this.car.angle, 450, this.car.body.velocity);
			        game.physics.arcade.accelerationFromRotation(this.car.rotation, 200, this.car.body.acceleration);
			    }
			    if (this.cursor.down)
			    {
			        			    	console.log("hit");

			        game.physics.arcade.velocityFromAngle(this.car.angle, -450, this.car.body.velocity);
			        game.physics.arcade.accelerationFromRotation(this.car.rotation, 200, this.car.body.acceleration);
			    }
			    if (this.cursor.fire)
			    {
			    			console.log(weapons[0]);	
			    			weapons[0].fire(this.car);
			        
			    }

	}

	//Create an instance of a game
	var game = new Phaser.Game(1000, 600, Phaser.AUTO, "display-content", { preload: preload, create: create, update: update, render:render });

	function preload(){
		  game.load.image("car", "/img/spacedrive_car.png", 111, 61);
		  game.load.image("enemy", "/img/spacedrive_enemy.png", 111, 61);
	     game.load.image("track", "/img/spacedrive_bg.png");
	     game.load.image("trackTop", "/img/track_top.png");
	     game.load.image("trackBottom", "/img/track_bottom.png");
	     game.load.image("start", "/img/start.png");
	     game.load.image("trackRight", "/img/track_right.png");
	     game.load.image("trackLeft", "/img/track_left.png");
	     game.load.image("laser", "/img/greenLaser.png", 30, 10);
	     game.load.image("barrier","/img/track_1.png",1500, 500)

	}





	function create(){
		//create physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//add background
		game.add.tileSprite(0, 0, 2020,1100,"track");
	    //set the bound of the game world
	    game.world.setBounds(0,0,2020,1100);
	    
	    // // The player and its settings
	    // player = game.add.sprite(1100, game.world.height - 150, "car");
	    // player.anchor.setTo(0.5, 0.5);

	    weapons.push(new Weapon.SingleBullet(game));

	    platforms = game.add.group();
	    platforms.enableBody = true;
	    start = game.add.group();
	    start.enableBody = true;
	    carList = {}


	    //create center barrier
	    var track1 = platforms.create(430,320, "barrier");
	    track1.body.immovable = true;
	    var trackTop = platforms.create(0,0, "trackTop");
	    trackTop.body.immovable = true;
	    var trackBottom = platforms.create(0,1020, "trackBottom");
	    trackBottom.body.immovable = true;
	    var trackLeft = platforms.create(0,0, "trackLeft");
	    trackLeft.body.immovable = true;
	    var trackRight = platforms.create(1950,0,"trackRight");
	    trackRight.body.immovable = true;

	    //add starting point object
	    var startingPoint = start.create(1200,800,"start");
	    startingPoint.body.immovable = true;

	    //create instance of a player
	    player = new Car(myId, game, car);
	    carList[myId] = player;
	    car = player.car;
	    car.x = 1100;
	    car.y = game.world.height - 150;



	    //push first weapon into weapon array
	    
	    //  Our controls.
	    cursors = game.input.keyboard.createCursorKeys();
	    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

	    //set up camera follow
	    game.camera.follow(car);

	    //set up time
	    timer = game.time.create(false);
	  
	}

	function update(){
		//set up collision 
		game.physics.arcade.collide(player, platforms); 
		game.physics.arcade.overlap(player, start, startLap, null, this);

		player.input.left = cursors.left.isDown;
		player.input.right = cursors.right.isDown;
		player.input.up = cursors.up.isDown;
		player.input.down = cursors.down.isDown;
		player.input.fire = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);

    for (var i in carList)
    {
		if (!carList[i]) continue;
		
		var currentCar = carList[i].car;
		for (var j in carList)
		{
			if (!carList[j]) continue;

			if (j!=i){
			
				var targetCar = carList[j].car;
				
				// game.physics.arcade.overlap(curBullets, targetTank, bulletHitPlayer, null, this);
			
			}
			
				carList[j].update();
	
		}
    }

	}

	function startLap(){
	    //create a timer
	    if(timer.running === false){
	        //star the timer
	        timer.start();    
	    }
	    console.log("hello");
	}
	function render() {
	    //adjust timer display
	    mins = Math.floor(timer.seconds/60);
	    secs = Math.floor(timer.seconds)%60;
	    tenths =  Math.round((timer.ms)/10);
	    if(mins < 10){
	        mins = "0" + mins;
	    }
	    if(secs < 10){
	        secs = "0" + secs;
	    }

	    var output = "Time: " + mins + ":" + secs + ":" + tenths%100;

	    game.debug.text(output, 32, 32);



	}

			//-----------end phase game-----------
	

	}


})


//start Router
 var myRouter = new gameRouter();

 Backbone.history.start();
