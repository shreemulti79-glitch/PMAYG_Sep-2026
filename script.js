const form = document.getElementById("form");


/* =====================================
   अर्जदाराचे नाव Automatic भरायचे
===================================== */

function syncApplicantName(){

  const applicantName =
    document.getElementById("applicantName");

  const affidavitName =
    document.getElementById("affName");

  const signatureName =
    document.getElementById("affSignName");


  if(!applicantName){

    return;
  }


  const name =
    applicantName.value;


  if(affidavitName){

    affidavitName.value =
      name;
  }


  if(signatureName){

    signatureName.value =
      name;
  }

}


/* =====================================
   आजची तारीख
===================================== */

function setToday(){

  const dateInput =
    document.getElementById("affDate");


  if(!dateInput){

    return;
  }


  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(2,"0");


  const day =
    String(
      today.getDate()
    ).padStart(2,"0");


  dateInput.value =
    `${year}-${month}-${day}`;

}


/* =====================================
   FORM DATA SAVE
===================================== */

function saveFormData(){

  const data = {};


  const elements =
    form.querySelectorAll(
      "input, select, textarea"
    );


  elements.forEach(function(el){

    if(el.type === "radio"){

      if(el.checked){

        data[el.name] =
          el.value;

      }

    }

    else if(el.type === "checkbox"){

      data[el.name] =
        el.checked;

    }

    else{

      data[el.name] =
        el.value;

    }

  });


  localStorage.setItem(
    "pmayg_form_data",
    JSON.stringify(data)
  );

}


/* =====================================
   SAVED DATA LOAD
===================================== */

function loadFormData(){

  const saved =
    localStorage.getItem(
      "pmayg_form_data"
    );


  if(!saved){

    return;
  }


  try{

    const data =
      JSON.parse(saved);


    Object.keys(data).forEach(
      function(name){

        const elements =
          form.querySelectorAll(
            '[name="' + name + '"]'
          );


        elements.forEach(
          function(el){

            if(el.type === "radio"){

              el.checked =
                el.value === data[name];

            }

            else if(
              el.type === "checkbox"
            ){

              el.checked =
                data[name] === true;

            }

            else{

              el.value =
                data[name];

            }

          }
        );

      }
    );


  }

  catch(error){

    console.log(
      "Saved data load error:",
      error
    );

  }

}


/* =====================================
   PDF GENERATE + DOWNLOAD
===================================== */

async function submitForm(){


  /* नाव आधी Sync */

  syncApplicantName();


  /* Required fields तपासा */

  if(!form.reportValidity()){

    alert(
      "कृपया अर्जातील सर्व आवश्यक माहिती पूर्ण भरा."
    );

    return;
  }


  /* Data Save */

  saveFormData();


  /* PDF Library Check */

  if(
    typeof html2canvas === "undefined" ||
    typeof window.jspdf === "undefined"
  ){

    alert(
      "PDF प्रणाली लोड झाली नाही. इंटरनेट सुरू करून पुन्हा प्रयत्न करा."
    );

    return;
  }


  /* Submit Button तात्पुरते hide */

  const submitArea =
    document.querySelector(
      ".submit-area"
    );


  if(submitArea){

    submitArea.style.visibility =
      "hidden";

  }


  try{


    const { jsPDF } =
      window.jspdf;


    /* A4 PDF */

    const pdf =
      new jsPDF({

        orientation:"portrait",

        unit:"mm",

        format:"a4",

        compress:true

      });


    /* दोन Pages */

    const pages =
      document.querySelectorAll(
        ".page"
      );


    for(
      let i = 0;
      i < pages.length;
      i++
    ){


      const page =
        pages[i];


      /* Page ला Canvas मध्ये convert */

      const canvas =
        await html2canvas(
          page,
          {

            scale:2,

            useCORS:true,

            allowTaint:true,

            backgroundColor:"#ffffff",

            logging:false,

            windowWidth:
              page.scrollWidth,

            windowHeight:
              page.scrollHeight

          }
        );


      const imgData =
        canvas.toDataURL(
          "image/jpeg",
          0.92
        );


      /* दुसऱ्या Page साठी नवीन A4 */

      if(i > 0){

        pdf.addPage(
          "a4",
          "portrait"
        );

      }


      /* पूर्ण A4 Page */

      pdf.addImage(

        imgData,

        "JPEG",

        0,

        0,

        210,

        297,

        undefined,

        "FAST"

      );

    }


    /* =================================
       PDF FILE NAME
    ================================= */

    let name =
      document
        .getElementById(
          "applicantName"
        )
        .value
        .trim();


    if(!name){

      name =
        "अर्जदार";

    }


    /* चुकीची चिन्हे remove */

    name =
      name.replace(
        /[\\\/:*?"<>|]/g,
        "_"
      );


    /* PDF Download */

    pdf.save(
      "PMAYG_" +
      name +
      ".pdf"
    );


    alert(
      "अर्ज यशस्वीरित्या PDF मध्ये तयार झाला."
    );


  }

  catch(error){

    console.error(error);


    alert(
      "PDF तयार करताना समस्या आली. कृपया पुन्हा प्रयत्न करा."
    );

  }


  finally{


    /* Button परत दिसू द्या */

    if(submitArea){

      submitArea.style.visibility =
        "visible";

    }

  }

}


/* =====================================
   PAGE LOAD
===================================== */

document.addEventListener(
  "DOMContentLoaded",
  function(){

    /* जुनी माहिती load */

    loadFormData();


    /* आजची तारीख */

    setToday();


    /* नाव sync */

    syncApplicantName();


    /* नाव टाइप करताना Automatic */

    const applicant =
      document.getElementById(
        "applicantName"
      );


    if(applicant){

      applicant.addEventListener(
        "input",
        syncApplicantName
      );

    }

  }
);
