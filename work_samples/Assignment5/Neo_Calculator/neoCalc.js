/* 
    Title:          Neo Calulator javascript
    Author:         Neo Lee (W0435748)
    Date:           Nov 19, 2019
    Description:    My first simple calculator

 */

// Declare variables
let cal_display = document.querySelector("#cal_display");
let current_input = ""; // for display current input from user
let btn_num0 = document.querySelector("#num0");
let btn_num1 = document.querySelector("#num1");
let btn_num2 = document.querySelector("#num2");
let btn_num3 = document.querySelector("#num3");
let btn_num4 = document.querySelector("#num4");
let btn_num5 = document.querySelector("#num5");
let btn_num6 = document.querySelector("#num6");
let btn_num7 = document.querySelector("#num7");
let btn_num8 = document.querySelector("#num8");
let btn_num9 = document.querySelector("#num9");
let btn_plus = document.querySelector("#plus");
let btn_minus = document.querySelector("#minus");
let btn_multi = document.querySelector("#multi");
let btn_divide = document.querySelector("#divide");
let btn_answer = document.querySelector("#answer");
let btn_clear = document.querySelector("#clear");

// Declare functions (listener)
btn_num0.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_num1.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }

);

btn_num2.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_num3.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_num4.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_num5.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_num6.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_num7.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_num8.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_num9.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_plus.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_minus.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_multi.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_divide.addEventListener("click",
    function(e) {
        btn_click_common(e);
    }
);

btn_answer.addEventListener("click",
    function(e) {
        cal_display.textContent = eval(current_input);
        current_input = cal_display.textContent;
    }
);

btn_clear.addEventListener("click",
    function(e) {
        current_input = "";
        cal_display.textContent = current_input
    }
);

// Declare functions
function btn_click_common(inE) {
    current_input += inE.target.textContent;
    cal_display.textContent = current_input;
}