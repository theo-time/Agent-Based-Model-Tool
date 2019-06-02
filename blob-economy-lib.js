function StateCreator (x, y) {
	this.x = x;
	this.y = y;
	this.size = 100;
	this.type = "State";
	this.money = 100;
	this.clor = [250,150,0];

	// Economic Variables // 
	this.food = 2;
	this.needs = 2;
	this.consumption = 0.25;
	this.demand = 0;
	this.income = 50;
	this.price = 10;
	this.price_adj = 1;

	this.Tax_Collect = function() {
		var count = 0
		for (p=0; p<nbr_blobs; p++) {
			agent = Blobs[p]
			this.money = this.money + agent.income * tax_rate
			agent.money = agent.money - agent.income * tax_rate
			count = count + agent.income * tax_rate
		}
		for (p=0; p < Firms.length; p++) {
			agent = Blobs[p]
			this.money = this.money + agent.income * tax_rate
			agent.money = agent.money - agent.income * tax_rate
			count = count + agent.income * tax_rate
		}
		this.income = count 
		Total_tax_collected =+ count 
		console.log(Total_tax_collected) 
	}

	// Common Buying & Pricing Methods //

	this.buy = function () {
				let s_id = 0;
				for(l = 1; l < Market.Offers.length; l++) {
					if (Market.Offers[0][0] > Market.Offers[l][0]) {s_id = l}
					else if (Market.Offers[0][0] == Market.Offers[l][0]) {s_id = Math.floor(random(1.99))}
					console.log("Best seller " + s_id)
				}
				buy(this, Firms[s_id], Firms[s_id].price)
	}

	this.pricing = function(/*price, need, physics*/) {
	}
		
	this.demandUpdate = function() {
		this.demand = this.needs - this.food 
	}

	this.consume = function () {
			this.food = this.food - this.consumption
	}

}


function FirmCreator (x, y, id) {
		// General and Geographic Variables // 
		this.id = id
		this.x = x;
		this.y = y ;
		this.size = 100;
		this.clor = [random(255),random(255),random(255)]
		this.type = "Firm";

		//General Economic Variables // 
		this.money = 1000;
		this.stock = 1;
		this.demand = 0;
		
		// Firm Specific Variables // 
		this.salary = 10;
		this.productivity = 1;
		this.price_adj = 1
		this.profits = []
		this.workers = []
		this.price = 10;
		this.bankrupt = false;


		this.pricing = function () {
		//Market.quantity = this.stock // à remplacer plus tard par un système où le marché est un array d'offres
			if(this.stock > 5 && this.price > 1) { 
				this.price = this.price - this.price_adj
				console.log("firm "+ this.id +" lowered price - too much stock")
			}
		}

		

		this.offer = function () {
				Market.Offers[i] = [this.price, this.stock, this.id]
		}

		this.check_bankruptcy = function() {
			if(this.money < this.salary && this.stock < 1) {this.bankrupt = true; this.clor = [250,0,0]}
		}
}	

	function MarketCreator (x,y) {
			// General and Geographic vVariables // 
			this.type = "Market"
			this.x = x;
			this.y = y;
			this.clor = [200,200,0]
			this.size = 100;

			// Economic Variables // 
			this.price = 10;
			this.quantity = 0;
			this.Offers = [];

			this.aggregates = function() {
				count = 0
				if(tick % 30 == 0) {
					for(p=0; p < this.Offers.length; p++) {
					count = count + this.Offers[p][1]
			 		}
			 	this.quantity = count
				}
			}
		}

		function BlobCreator (x,y,id) {
			// General and Geographic Variables // 
			this.id = id
			this.type = "Blob"
			this.x = x
			this.y = y
			this.clor = [0,200,0]

			// General Economic Variables // 
			this.money = 0
			this.income = 0
			this.consumption = 0.2
			this.price = Market.price//this.income / this.consumption 
			this.demand = 0
			this.food = 5
			this.need = 5
			this.price_adj = 1

			// Blob Specific Variables
			this.direction = (0,0)
			this.vitx = random(1);
	        this.vity = 1 - this.vitx;
			this.speed = 1
			this.employer = Firms[Math.floor(random(1.999))];
			this.target = this.employer
			this.alive = true
			this.state = 0

			this.pricing = function(/*price, need, physics*/) {
				if(this.food<0 && tick % 200 ==0){
					this.price = this.price + this.price_adj*1
				}
			}
			
			this.demandUpdate = function() {
				this.demand =  this.need - this.food
			}
			
			this.move = function (place) {
	      // head toward the place
				//console.log(this.toward(place))
				//console.log(this.vitx)
				this.x = this.x - this.vitx
				this.y = this.y - this.vity
				
				if (this.x > width - 20 || this.y > height || this.y < 0 || this.x < 0) {
					this.vitx =  - this.vitx
					this.vity =  - this.vity
				}
			}

			this.Consumption = function () {
				this.food = this.food - this.consumption
			}
			
			
			this.toward = function () {
			//var dist = sqrt(sq((target.x - this.x)) + sq(target.y - this.y))
			var dx = this.x - (this.target.x+this.target.size/2);
	        var dy = this.y - (this.target.y+this.target.size/2);
	        var  angle = atan2(dy, dx)
			this.vitx = this.speed * cos(angle)
		    this.vity = this.speed * sin(angle)
		  //console.log(this.direction)
			//console.log("hey")
			}
			
			this.in = function() {
				
			}
			
			this.act = function () {
				if(this.target.x < this.x && this.x < (this.target.x + this.target.size*1) && this.target.y < this.y && this.y < (this.target.y + this.target.size * 0.5) ) {
			  	if (this.target == Market) {
						this.buy(this.target);
						this.target = this.employer
					}
					// when they arrive at the Firm they work and go back to Market //
					else if (this.target.type == "Firm") {
						this.work(this.employer);
						this.target = Market;
					}
				}
			}

			this.buy = function () {
				let s_id = null;
				for(l = 1; l < Market.Offers.length; l++) {
					if (Market.Offers[0][0] > Market.Offers[l][0] && Market.Offers[1][1] > 0) {s_id = l}
					if(Market.Offers[0][0] < Market.Offers[l][0] && Market.Offers[1][1] > 0) {s_id = 0}
					else if (Market.Offers[0][0] == Market.Offers[l][0] 
								&& Market.Offers[1][1] > 0 && Market.Offers[1][1] > 0)  {s_id = Math.floor(random(1.99))}
					else{ return "no seller" ; console.log("no seller ----------")}
				}
				buy(this, Firms[s_id], Firms[s_id].price)
			}

			this.work = function (firm) {
				if (firm.money > firm.salary) {
				this.money = this.money + firm.salary;
				firm.money = firm.money - firm.salary;
				Wages_Array.push(firm.salary);
				firm.stock = firm.stock + 1;
				this.income = firm.salary
				}
		    }

		    this.check_death = function () {
		    	var g = map(this.food, 0, 10, 0, 250 )
		    	var r = map(this.food, 0, 10, 0, 250)
		    	this.clor=[250-r,g,0]
		    	if (this.food < 0) {
		    		this.alive = false
		    		this.clor = [200,0,0]
		    	}
		    }
	}
