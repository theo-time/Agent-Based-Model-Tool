blobInfoElt = document.getElementById('blobInfos')
newPopButton = document.getElementById('newPop')
frameCountElt = document.getElementById('frame_Count')
globalElt = document.getElementById('Globals')
var globalData = document.createElement('p')
	globalElt.appendChild(globalData)

function keyPressed() {
	if(keyCode == 32) {play=!play}
	if(keyCode == DOWN_ARROW || keyCode == UP_ARROW) {
		blobSelecter(keyCode);
	}
	if(keyCode == 77) { 
		if(selectMode == "blobs") {selectMode = "pads"}
		else{selectMode = "blobs"}
	}
}


function mouseClicked(mode) {
  if( mouseX > 0 && mouseX < width  && mouseY > 0 && mouseY < height) {
	  if(selectMode == "pads") {
		  selection = check_in2(mouseX,mouseY);
		  selection.neighbors.map(function(d) {d.clor=[0,0,0]})
		  selection.blobs_inside();
		  if(document.getElementsByTagName("p")[0]) {document.getElementsByTagName("p")[0].remove()}
		  	createP(  "x : " + selection.x 
		        + "   y : " + selection.y 
		        + "   food : " + selection.y 
		        + "   grow_chance : " + selection.grow_chance)
		  }
	  if(selectMode = "blobs") {
	  	if(check_in2(mouseX,mouseY).blobs_in.length > 0) {
	  		selectBlob();
	  		printInfos();
			console.log(selectedBlob); 
		}
	  }
	}
} 


function Mouse_check() {
  for(i=0; i < Terrain.Pads.length; i++) {
    for (j=0; j < Terrain.Pads[i].length; j++) {
      pad = Terrain.Pads[i][j];
      if(check_in(mouseX, mouseY, i, j)) {
        //pad.food = 250
        //pad.clor = [pad.food,20,0]
        show_panel(i,j)
      }
    }
  }
  fill(250)
  text(mouseX, 20, 20, 20)
  text(mouseY, 20, 40, 20)
}

function printAllBlobs_in() {
	arr = []
	for (i=0; i < nbr_rows;i++) {
      for(p=0; p < nbr_columns; p++) {
      	inside = Terrain.Pads[i][p].blobs_inside()
        if(inside.length > 0) {arr.push(Terrain.Pads[i][p]);arr.push(inside);}
      }
    }
	return arr
}


function selectBlob() {
		// undo previous selected blob style //
		if(selectedBlob != 0) {
			selectedBlob.clor = selectedBlob.DNA.clor;
			selectedBlob.stroke = 1;
		}


		selectedBlob = random(check_in2(mouseX,mouseY).blobs_in);

		// Style the new selected blob//
		selectedBlob.clor = [100,100,100];
		selectedBlob.stroke = 3;

}


function show_panel (im, jn) {
  showPad = Terrain.Pads[im][jn];
  fill(200)
  push()
  translate(mouseX, mouseY)
  rect(0, 0, 100, 100)
  fill(0)
  text("food:" + Math.round(showPad.food*100)/100, 10, 20, 20)
  text("grow_chance:" + Math.floor(showPad.grow_chance), 10, 40, 20)
  pop()
}

function printInfos() {
	blobInfos.textContent = 
	" ID  :  "+"  " + selectedBlob.id + "" +
	" Life  :  "+"" + Math.floor(selectedBlob.life) +
	" Maxlife  :  "+"" + selectedBlob.Maxlife
}

function printGlobals() {
	globalData.textContent = " Number of Blobs " + Pop.Blobs.length;
}

newPopButton.addEventListener('click', generate)

function generate() {
	console.log('check')
	Pop.generatePop(10)
}


