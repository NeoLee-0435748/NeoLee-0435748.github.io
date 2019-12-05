/*
    Title:          NSCC Application Form (Final Project)
    Author:         Neo Lee (W0435748)
    Date:           Nov 21, 2019
    Description:    Create NSCC application form and related with server
                    Check the validataions
                    
 */

// Initialize ================================================================
// when date is onload, set default date to today
let eleBody = document.getElementsByTagName("body")[0];

eleBody.onload = function() { initDate(); };

function initDate() {
    document.getElementsByName("appl_date")[0].value = new Date().toISOString().substr(0, 10);
}

// Common functions ===========================================================
/*
   Function name:  checkBeforeSubmit
   Input:          none
   return:         true - check validation is OK
                   false - check validation is failed
   Description:    Check a general rules
                   1) Gender
                   2) English Language
                   3) Citizenship
                   4) credit card number
                   5) credit card exp. date
                   6) credit card cardholder name
                   7) health & human services applicants first question
                   8) health & human services applicants second question
                   9) health & human services applicants third question
                   
*/
function checkBeforeSubmit() {
    let comElement = null; // use for every element of check

    // 1) check Gender radio button
    comElement = document.getElementsByName("gender");
    // both radio button unchecked
    if (comElement[0].checked === false && comElement[1].checked === false) {
        comElement[0].setCustomValidity("One of gender should be checked.");
        return false;
    }
    // validation is OK
    else {
        comElement[0].setCustomValidity("");
    }

    // 2) check English is first language
    comElement = document.getElementsByName("eng_fst_lang");
    // both radio button unchecked
    if (comElement[0].checked === false && comElement[1].checked === false) {
        comElement[0].setCustomValidity("One of options should be checked.");
        return false;
    }
    // validation is OK
    else {
        comElement[0].setCustomValidity("");
    }

    // 3) check Citizenship
    comElement = document.getElementsByName("citizenship");
    // four radio button unchecked
    if (comElement[0].checked === false && comElement[1].checked === false &&
        comElement[2].checked === false && comElement[3].checked === false) {
        comElement[0].setCustomValidity("One of options should be checked.");
        return false;
    }
    // validation is OK
    else {
        comElement[0].setCustomValidity("");
    }

    // check Application fee
    comElement = document.getElementsByName("app_fee");
    // four radio button unchecked
    if (comElement[0].checked === false && comElement[1].checked === false &&
        comElement[2].checked === false && comElement[3].checked === false &&
        comElement[4].checked === false) {
        comElement[0].setCustomValidity("One of options should be checked.");
        return false;
    }
    // validation is OK
    else {
        comElement[0].setCustomValidity("");
    }

    /* validation role
        Visa :- Starting with 4, length 13 or 16 digits.
        MasterCard :- Starting with 51 through 55, length 16 digits.
        Discover :- Starting with 6011, length 16 digits or starting with 5, length 15 digits.
        American Express :- Starting with 34 or 37, length 15 digits.
    */
    // get credit card information
    let strCCNO = document.getElementsByName("cc_no")[0].value;

    // 4) check Visa credit card validation
    if (comElement[0].checked === true) {
        let chkRegExp = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;

        if (!strCCNO.match(chkRegExp)) {
            comElement[0].setCustomValidity("Visa credit card number is not valid.");
            return false;
        } else {
            comElement[0].setCustomValidity("");
        }
    }
    // check Mastercard credit card validation
    else if (comElement[1].checked === true) {
        let chkRegExp = /^(?:5[1-5][0-9]{14})$/;

        if (!strCCNO.match(chkRegExp)) {
            comElement[1].setCustomValidity("Mastercard credit card number is not valid.");
            return false;
        } else {
            comElement[1].setCustomValidity("");
        }
    }
    // check Discover credit card validation
    else if (comElement[2].checked === true) {
        let chkRegExp = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;

        if (!strCCNO.match(chkRegExp)) {
            comElement[2].setCustomValidity("Discover credit card number is not valid.");
            return false;
        } else {
            comElement[2].setCustomValidity("");
        }
    }
    // check American Express credit card validation
    else if (comElement[3].checked === true) {
        let chkRegExp = /^(?:3[47][0-9]{13})$/;

        if (!strCCNO.match(chkRegExp)) {
            comElement[3].setCustomValidity("American Express credit card number is not valid.");
            return false;
        } else {
            comElement[3].setCustomValidity("");
        }
    }

    // 5) check credit card exp. date validataion
    let dateReg = /^\d{2}[./-]\d{2}$/;
    let edtCCExpDt = document.getElementsByName("cc_exp_dt")[0];

    if (!edtCCExpDt.value.match(dateReg)) {
        edtCCExpDt.setCustomValidity("Please input date propery.");
        return false;
    } else {
        edtCCExpDt.setCustomValidity("");
    }

    // 6) check credit card cardholder name validation
    if (!checkName(document.getElementsByName("cc_hold_name")[0], "2")) {
        return false;
    }

    // 7) health & human services applicants first question
    comElement = document.getElementsByName("hhsa_qus1");
    // both radio button unchecked
    if (comElement[0].checked === false && comElement[1].checked === false) {
        comElement[0].setCustomValidity("One of options should be checked.");
        return false;
    }
    // validation is OK
    else {
        comElement[0].setCustomValidity("");
    }

    // 8) health & human services applicants second question
    comElement = document.getElementsByName("hhsa_qus2");
    // both radio button unchecked
    if (comElement[0].checked === false && comElement[1].checked === false) {
        comElement[0].setCustomValidity("One of options should be checked.");
        return false;
    }
    // validation is OK
    else {
        comElement[0].setCustomValidity("");
    }

    // 9) health & human services applicants third question
    comElement = document.getElementsByName("hhsa_qus3");
    // both radio button unchecked
    if (comElement[0].checked === false && comElement[1].checked === false) {
        comElement[0].setCustomValidity("One of options should be checked.");
        return false;
    }
    // validation is OK
    else {
        comElement[0].setCustomValidity("");
    }
    return true; // every validation is OK
}

/*
   Function name:  initCardInfo
   Input:          inFlag - enable or disable elements
   return:         none
   Description:    enable or disable all card information elements depends on selecting 
                   
*/
function initCardInfo(inFlag) {
    // declare variables for the elements
    let edtCCNO = document.getElementsByName("cc_no")[0];
    let edtCCExpDt = document.getElementsByName("cc_exp_dt")[0];
    let edtCCHoldName = document.getElementsByName("cc_hold_name")[0];
    let edtCCHoldSign = document.getElementsByName("cc_hold_sign")[0];

    // enable all card information elements
    if (inFlag === "1") {
        edtCCNO.disabled = false;
        edtCCNO.required = true;
        edtCCExpDt.disabled = false;
        edtCCExpDt.required = true;
        edtCCHoldName.disabled = false;
        edtCCHoldName.required = true;
    }
    // disable all card information elements
    else {
        edtCCNO.disabled = true;
        edtCCNO.required = false;
        edtCCExpDt.disabled = true;
        edtCCExpDt.required = false;
        edtCCHoldName.disabled = true;
        edtCCHoldName.required = false;

    }

    // clear all card information elements
    edtCCNO.value = "";
    edtCCExpDt.value = "";
    edtCCHoldName.value = "";
    edtCCHoldSign.value = "";
}

/*
   Function name:  clearCustomValidity
   Input:          none
   return:         none
   Description:    clear CustomValidity 
                   
*/
function clearCustomValidity() {
    // clear Gender radio button
    document.getElementsByName("gender")[0].setCustomValidity("");
    // clear English is first language
    document.getElementsByName("eng_fst_lang")[0].setCustomValidity("");
    // clear Citizenship
    document.getElementsByName("citizenship")[0].setCustomValidity("");
    // clear Application fee
    let rdoAppFee = document.getElementsByName("app_fee");
    for (let i = 0; i < rdoAppFee.length; i++) {
        rdoAppFee[i].setCustomValidity("");
    }
    // clear exp. date
    document.getElementsByName("cc_exp_dt")[0].setCustomValidity("");
    // clear cardholder name
    document.getElementsByName("cc_hold_name")[0].setCustomValidity("");
    // clear health & human services applicants first question
    comElement = document.getElementsByName("hhsa_qus1")[0].setCustomValidity("");
    // clear health & human services applicants second question
    comElement = document.getElementsByName("hhsa_qus2")[0].setCustomValidity("");
    // clear health & human services applicants third question
    comElement = document.getElementsByName("hhsa_qus3")[0].setCustomValidity("");
}

/*
   Function name:  checkName
   Input:          inElement - a element is being checked
                   inCondition - 1: check firstname or lastname
                                 2: check fullname
   return:         true - validation is OK
                   false - validation is not OK
   Description:    Check a name rules
                   1) not null - check in html (no need to act here)
                   2) first letter is a Capital letter
                   3) first letter is not a space
                   4) do not have any spaces (for only in condition 1)
                   
*/
function checkName(inElement, inCondition) {
    let name = inElement.value;
    let alphaExp = ""

    // check regular expression
    // check condition 1
    if (inCondition === "1") {
        chkNameExp = /^[A-Z][a-zA-Z]+$/;
    }
    // check condition 2
    else if (inCondition === "2") {
        chkNameExp = /^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+$/;
    }

    if (!name.match(chkNameExp)) {
        inElement.setCustomValidity("Please input name properly.");
        return false;
    } else {
        inElement.setCustomValidity("");
        return true;
    }
}

/*
   Function name:  setDateToday
   Input:          inElement - a element is being setted
   return:         none
   Description:    set default date to today
                   format - mm/dd/yyyy
                   
*/
function setDateToday(inElement) {
    let today = new Date();

    inElement.value = ('0' + (today.getMonth() + 1)).slice(-2) + '/' + ('0' + today.getDate()).slice(-2) + '/' + today.getFullYear();
}

// Event driven functions =====================================================
// When press 'Apply' button, check validation
let form = document.getElementsByTagName("form")[0];

form.addEventListener("submit",
    function(event) {
        if (!checkBeforeSubmit()) {
            // And we prevent the form from being sent by canceling the event
            event.preventDefault();
        }
    },
    false
);

// Check first name (fname)
let edtFname = document.getElementsByName("fname")[0];

edtFname.addEventListener("input",
    function(event) {
        checkName(edtFname, "1");
    },
    false
);

// Check first name (fname)
let edtLname = document.getElementsByName("lname")[0];

edtLname.addEventListener("input",
    function(event) {
        checkName(edtLname, "1");
    },
    false
);

// select English language radio button
let rdoGender = document.getElementsByName("gender");

// select male radio button
rdoGender[0].addEventListener("change",
    function(event) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select female radio button
rdoGender[1].addEventListener("change",
    function(event) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select English language radio button
let rdoEngFstLang = document.getElementsByName("eng_fst_lang");

// select yes radio button
rdoEngFstLang[0].addEventListener("change",
    function(event) {
        let edtProofEng = document.getElementsByName("proof_eng")[0];

        edtProofEng.value = "";
        edtProofEng.required = false;
        edtProofEng.disabled = true;

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select no radio button
rdoEngFstLang[1].addEventListener("change",
    function(event) {
        let edtProofEng = document.getElementsByName("proof_eng")[0];

        edtProofEng.value = "";
        edtProofEng.required = true;
        edtProofEng.disabled = false;

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select Citizenship radio button
let rdoCitizenship = document.getElementsByName("citizenship");

// select Canadian Citizen radio button
rdoCitizenship[0].addEventListener("change",
    function(event) {
        let edtOtherCizen = document.getElementsByName("other_citizenship")[0];

        edtOtherCizen.value = "";
        edtOtherCizen.required = false;
        edtOtherCizen.disabled = true;

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select Permnnent Resisent radio button
rdoCitizenship[1].addEventListener("change",
    function(event) {
        let edtOtherCizen = document.getElementsByName("other_citizenship")[0];

        edtOtherCizen.value = "";
        edtOtherCizen.required = false;
        edtOtherCizen.disabled = true;

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select Refugee radio button
rdoCitizenship[2].addEventListener("change",
    function(event) {
        let edtOtherCizen = document.getElementsByName("other_citizenship")[0];

        edtOtherCizen.value = "";
        edtOtherCizen.required = false;
        edtOtherCizen.disabled = true;

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select Other radio button
rdoCitizenship[3].addEventListener("change",
    function(event) {
        let edtOtherCizen = document.getElementsByName("other_citizenship")[0];

        edtOtherCizen.value = "";
        edtOtherCizen.required = true;
        edtOtherCizen.disabled = false;

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select application fee radio button
let rdoAppFee = document.getElementsByName("app_fee");

// select Visa radio button
rdoAppFee[0].addEventListener("change",
    function(event) {
        // enable card information elements
        initCardInfo("1");

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select Mastercard radio button
rdoAppFee[1].addEventListener("change",
    function(event) {
        // enable card information elements
        initCardInfo("1");

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select Discover radio button
rdoAppFee[2].addEventListener("change",
    function(event) {
        // enable card information elements
        initCardInfo("1");

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select American Express radio button
rdoAppFee[3].addEventListener("change",
    function(event) {
        // enable card information elements
        initCardInfo("1");

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select Cheque/Money radio button
rdoAppFee[4].addEventListener("change",
    function(event) {
        // enable card information elements
        initCardInfo("2");

        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// input Credit card number
let edtCCNO = document.getElementsByName("cc_no")[0];

edtCCNO.addEventListener("input",
    function(event) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// input Credit card holder name
let edtCCHoldName = document.getElementsByName("cc_hold_name")[0];

edtCCHoldName.addEventListener("input",
    function(event) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// input Credit card exp. date
let edtCCExpDt = document.getElementsByName("cc_exp_dt")[0];

edtCCExpDt.addEventListener("input",
    function(evnet) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select health & human services applicants first question
let rdoHHSAFst = document.getElementsByName("hhsa_qus1");

rdoHHSAFst[0].addEventListener("change",
    function(event) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

rdoHHSAFst[1].addEventListener("change",
    function(event) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select health & human services applicants second question
let rdoHHSASnd = document.getElementsByName("hhsa_qus2");

rdoHHSASnd[0].addEventListener("change",
    function(event) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

rdoHHSASnd[1].addEventListener("change",
    function(event) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

// select health & human services applicants third question
let rdoHHSATrd = document.getElementsByName("hhsa_qus3");

rdoHHSATrd[0].addEventListener("change",
    function(event) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);

rdoHHSATrd[1].addEventListener("change",
    function(event) {
        // Clear Custom Validity settings
        clearCustomValidity();
    },
    false
);