const display=document.getElementById("display");
function visible(input){
    display.value+=input;
}
function cleardata(){
    display.value="";
}
function Cal(){
    try{
    display.value = eval(display.value);
    }
    catch(error){
        display.value="error";
    }
}