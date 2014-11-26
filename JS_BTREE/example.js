// EXAMPLE
var tree = BTREE(3);
var source = [1,3,4,5,6,9,10,2,7,8,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
var arr = tree.build(source.sort(function(a,b){
    return a-b;
}))

var div = document.getElementById('output');
div.innerHTML = div.innerHTML + JSON.stringify(arr);