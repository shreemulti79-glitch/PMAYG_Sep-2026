const form = document.getElementById("form");
const appNo = document.getElementById("appNo");

function generateAppNo(){
  const d = new Date();

  const year = d.getFullYear();
  const month = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");

  const random = Math.floor(1000 + Math.random()*9000);

  return "PMAYG-" + year + month + day + "-" + random;
}

function setAppNo(){
  let no = localStorage.getItem("pmayg_current_app");

  if(!no){
    no = generateAppNo();
    localStorage.setItem("pmayg_current_app",no);
  }

  appNo.textContent = "अर्ज क्र.: " + no;
}

function saveForm(){

  if(!form.reportValidity()){
    alert("कृपया सर्व आवश्यक माहिती भरा.");
    return;
  }

  const data = {};

  const elements = form.querySelectorAll("input,select,textarea");

  elements.forEach(el => {

    if(el.type === "radio"){
      if(el.checked){
        data[el.name] = el.value;
      }
    }

    else if(el.type === "checkbox"){
      data[el.name] = el.checked;
    }

    else{
      data[el.name] = el.value;
    }

  });

  localStorage.setItem("pmayg_form_data",JSON.stringify(data));

  alert("अर्ज यशस्वीरित्या जतन झाला.");
}

function loadForm(){

  const saved = localStorage.getItem("pmayg_form_data");

  if(!saved) return;

  try{

    const data = JSON.parse(saved);

    Object.keys(data).forEach(name => {

      const elements = form.querySelectorAll('[name="'+name+'"]');

      elements.forEach(el => {

        if(el.type === "radio"){
          el.checked = el.value === data[name];
        }

        else if(el.type === "checkbox"){
          el.checked = data[name] === true;
        }

        else{
          el.value = data[name];
        }

      });

    });

  }catch(e){

    console.log("Saved data load error",e);

  }

}

function newForm(){

  if(confirm("नवीन अर्ज सुरू करायचा आहे का? जुनी माहिती साफ होईल.")){

    form.reset();

    localStorage.removeItem("pmayg_form_data");

    const newNo = generateAppNo();

    localStorage.setItem("pmayg_current_app",newNo);

    appNo.textContent = "अर्ज क्र.: " + newNo;
  }
}

function printForm(){

  if(!form.reportValidity()){
    alert("कृपया सर्व आवश्यक माहिती भरा.");
    return;
  }

  window.print();
}

function submitForm(){

  if(!form.reportValidity()){
    alert("कृपया सर्व आवश्यक माहिती पूर्ण भरा.");
    return;
  }

  saveForm();

  /*
    Browser print dialog मधून:
    Destination → Save as PDF
    Paper size → A4
    Pages → All
  */

  alert(
    "अर्ज तयार आहे.\n\n" +
    "आता Print मध्ये 'Save as PDF' निवडा.\n" +
    "PDF फक्त 2 पानांची असेल."
  );

  window.print();
}

document.addEventListener("DOMContentLoaded",function(){

  setAppNo();
  loadForm();

});
