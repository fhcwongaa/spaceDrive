

// ---------------Router for SPA ----------- 
var gameRouter = Backbone.Router.extend({
	routes:{
		"chatroom": "showChatRoom",
		"practice": "showPractice",
		"settings": "showSettings"
	},
	showChatRoom: function(){
		$("#practice").removeClass("active");
		$("#chatroom").addClass("active");
		console.log("chattttttttt")
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
	// $("#display-content").toggleClass('loading');
	//load for three seconds and start game
	setTimeout(function(){
		$("#display-content").empty();


			/*****************************************GAME***********************************/
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
			 var Weapon = {};

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
			var game = new Phaser.Game(1000, 600, Phaser.AUTO, "display-content", { preload: preload, create: create, update: update, render:render });

			function preload(){
				 game.load.image("car", "/img/spacedrive_car.png", 111, 61);
			     game.load.image("track", "/img/spacedrive_bg.png");
			     game.load.image("trackTop", "/img/track_top.png");
			     game.load.image("trackBottom", "/img/track_bottom.png");
			     game.load.image("start", "/img/start.png");
			     game.load.image("trackRight", "/img/track_right.png");
			     game.load.image("trackLeft", "/img/track_left.png");
			     game.load.image("laser", "/img/greenLaser.png", 30, 10);
			     game.load.image("barrier","/img/track_1.png",1500, 500)

			}


			// new Ellipse(x, y, width, height)
			var raceTrack;
			var player;
			var cursors;
			var platforms;
			var ACCLERATION = 600;
			var DRAG = 400;
			var MAXSPEED = 500;
			var weapons = [];


			function create(){
				//create physics system
				game.physics.startSystem(Phaser.Physics.ARCADE);
				//add background
				game.add.tileSprite(0, 0, 2020,1100,"track");
			    //set the bound of the game world
			    game.world.setBounds(0,0,2020,1100);
			    
			    // The player and its settings
			    player = game.add.sprite(1100, game.world.height - 150, "car");
			    player.anchor.setTo(0.5, 0.5);

			    platforms = game.add.group();
			    platforms.enableBody = true;
			    start = game.add.group();
			    start.enableBody = true;


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


			    // Set default physics attributes
			    game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
			    player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
			    player.body.drag.setTo(DRAG, DRAG);
			    player.body.collideWorldBounds = true;

			    //push first weapon into weapon array
			    weapons.push(new Weapon.SingleBullet(game));

			    //  Our controls.
			    cursors = game.input.keyboard.createCursorKeys();
			    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

			    //set up camera follow
			    game.camera.follow(player);

			    //set up time
			    timer = game.time.create(false);
			  
			}

			function update(){
				//set up collision 
			    game.physics.arcade.collide(player, platforms); 
			    game.physics.arcade.overlap(player, start, startLap, null, this);

			    player.body.velocity.x = 0;
			    player.body.velocity.y = 0;
			    player.body.acceleration.x = 0;
			    player.body.angularVelocity = 0;
			    player.body.maxVelocity.x= 500;
			    player.body.maxVelocity.y= 500;


			    if (cursors.left.isDown)
			    {
			        //  Move to the left
			        player.body.angularVelocity = -150;
			    }
			    else if (cursors.right.isDown)
			    {
			        //  Move to the right
			        player.body.angularVelocity = 150;
			    }
			    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
			    {
			    	
			        game.physics.arcade.velocityFromAngle(player.angle, 450, player.body.velocity);
			        game.physics.arcade.accelerationFromRotation(player.rotation, 200, player.body.acceleration);
			    }
			    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
			    {
			        
			        game.physics.arcade.velocityFromAngle(player.angle, -450, player.body.velocity);
			        game.physics.arcade.accelerationFromRotation(player.rotation, 200, player.body.acceleration);
			    }
			    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
			    {
			        //fire bullet from weapon
			        weapons[0].fire(player);
			    }


			    // Stop at screen width

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
	},1000)
	

	}


})


//start Router
 var myRouter = new gameRouter();

 Backbone.history.start();
