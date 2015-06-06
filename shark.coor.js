//Colin Peter cypeter@ucsc.edu
//Nikita Sokolnikov nsokolni@ucsc.edu
//6/6/15
//Final Project
//Implements shadow volumes and a mirror

shark_coords = [
	null,
	[1,1,1],
	[1,1,-1],
	[1,-1,1],
	[1,-1,-1],
	[-1,1,1],
	[-1,1,-1],
	[-1,-1,1],
	[-1,-1,-1],
];
console.log("preprocessing shitty shark model...");

//this removes duplicate coordinates
var count = 0;
for (var i = 1; i < shark_coords.length; i++) {
	for (var j = i+1; j < shark_coords.length; j++) {
		var eq = true;
		for (var k = 0; k < 3; k++) {
			if (shark_coords[i][k] != shark_coords[j][k]) {
				eq = false;
				break;
			}
		}
		if (eq) {
			var final_id = i;
			while (shark_coords[final_id][4]) {
				//console.log(final_id);
				final_id = shark_coords[final_id][4];
			}
			shark_coords[j][4] = final_id;
			count++;
		}
	}
}
console.log("done! Logged " + count + " duplicates");

for (var i = 1; i < shark_coords.length; i++) {
	for (var j = i+1; j < shark_coords.length; j++) {
		var i2 = i;
		if (shark_coords[i2][4]) {
			i2 = shark_coords[i2][4];
		}
		var j2 = j;
		if (shark_coords[j2][4]) {
			j2 = shark_coords[j2][4];
		}
		if (i2 != j2) {
			var eq = true;
			for (var k = 0; k < 3; k++) {
				if (shark_coords[i2][k] != shark_coords[j2][k]) {
					eq = false;
					break;
				}
			}
			if (eq) {
				console.log("OH SHIT");
			}
		}
	}
}

function gen() {
	var coor = [];
	var poly = [];
	for (var pitch = -Math.PI/2; pitch < Math.PI/2; pitch += Math.PI/16) {
		for (var yaw = 0; yaw < Math.PI; yaw += Math.PI/32) {
			var x1 = Math.cos(yaw) * Math.cos(pitch);
			var y1 = Math.sin(yaw) * Math.cos(pitch);
			var z1 = Math.sin(pitch);
			
			var x2 = Math.cos(yaw+Math.PI/32) * Math.cos(pitch);
			var y2 = Math.sin(yaw+Math.PI/32) * Math.cos(pitch);
			var z2 = Math.sin(pitch);
			
			var x3 = Math.cos(yaw+Math.PI/32) * Math.cos(pitch+Math.PI/16);
			var y3 = Math.sin(yaw+Math.PI/32) * Math.cos(pitch+Math.PI/16);
			var z3 = Math.sin(pitch+Math.PI/16);
			
			var x4 = Math.cos(yaw) * Math.cos(pitch+Math.PI/16);
			var y4 = Math.sin(yaw) * Math.cos(pitch+Math.PI/16);
			var z4 = Math.sin(pitch+Math.PI/16);
			
			var i = coor.length;
			coor.push([x1, y1, z1]);
			coor.push([x2, y2, z2]);
			coor.push([x3, y3, z3]);
			coor.push([x4, y4, z4]);
			
			poly.push(["foo", i, i+1, i+2, i+3]);
		}
	}
	
	var out = "COOR\n";
	for (var i = 0; i < coor.length; i++) {
		out += "[";
		var comma = "";
		for (var j = 0; j < coor[i].length; j++) {
			out += comma;
			out += coor[i][j];
			comma = ",";
		}
		
		out += "],\n";
	}
	console.log(out);
	
	var out = "POLY\n";
	for (var i = 0; i < poly.length; i++) {
		out += "[";
		var comma = "";
		out += "\"";
		out += poly[i][0];
		out += "\",";
		for (var j = 1; j < poly[i].length; j++) {
			out += comma;
			out += poly[i][j];
			comma = ",";
		}
		
		out += "],\n";
	}
	console.log(out);
}
