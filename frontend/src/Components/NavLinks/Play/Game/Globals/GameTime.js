var map_time = {'1 min':[60,0],'2 min': [120,0], '3 min':[180,0],'5 min': [300,0], '10 min':[600,0],'30 min': [1800,0],'1|2':[60,2], '3|2':[180,2], '5|2':[300,2],'unlimited':[-1,0] };

export var GameTime = [-1,0];

export function setGameTime(id) {
    GameTime = map_time[id]

}
