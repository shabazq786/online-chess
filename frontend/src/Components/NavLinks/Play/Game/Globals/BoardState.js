let position_arr = [];

for(var i = 0; i < 64; i++) {
    var row = 7 - Math.floor(i / 8);
    var col = 7 - (i % 8);
    position_arr.push([i,8*row + col]);
}

export const BoardState = position_arr;

