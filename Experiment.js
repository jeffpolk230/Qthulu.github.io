
var s = "c";

switch(s){
    case 12:
        console.log("\tNumber");
        break;
    case "c":
    case "b":
        console.log("\tLetter: "+s);
        break;
    default:
        console.log("\tDEFAULT");
        break;
}

list = [1,2,3,4,5];

list.shift();

for(var x in list){
    console.log(list[x]);
}

x = {a:"hej"};

if(x.a){
    console.log(x.a);
}
if(x.b){
    console.log("DONT PRINT ME");
}
