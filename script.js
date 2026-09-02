const form = document.getElementById("form");

const appNo = document.getElementById("appNo");

const applicantName =
  document.getElementById("applicantName");

const affName =
  document.getElementById("affName");

const signName =
  document.getElementById("signName");

const affSignName =
  document.getElementById("affSignName");



/* ================= अर्ज क्रमांक ================= */

function generateAppNo(){

  const d = new Date();

  const year = d.getFullYear();

  const month =
    String(d.getMonth()+1).padStart(2,"0");

  const day =
    String(d.getDate()).padStart(2,"0");

  const random =
    Math.floor(1000 + Math.random()*9000);

  return "PMAYG-" +
    year +
    month +
    day +
    "-" +
    random;
}


function setAppNo(){

  let no =
    localStorage.getItem("pmayg_current_app");

  if(!no){

    no = generateAppNo();

    localStorage.setItem(
      "pmayg_current_app",
      no
    );

  }

  appNo.textContent =
    "अर्ज क्र.: " + no;
}



/* ================= नाव Automatic ================= */

function syncName(){

  const name =
    applicantName.value.trim();

  affName.value = name;

  signName.value = name;

  affSignName.value = name;
}


/* अर्जदाराचे नाव टाइप करताना लगेच बदलावे */

applicantName.addEventListener(
  "input",
  syncName
);



/* ================= PDF ================= */

async function submitForm(){

  syncName();


  /* सर्व required माहिती तपासा */

  if(!form.reportValidity()){

    alert(
      "कृपया अर्जातील सर्व आवश्यक माहिती पूर्ण भरा."
    );

    return;
  }


  /* PDF library तपासा */

  if(
    typeof html2canvas === "undefined" ||
    typeof window.jspdf === "undefined"
  ){

    alert(
      "PDF प्रणाली लोड झाली नाही. कृपया इंटरनेट तपासा आणि पुन्हा प्रयत्न करा."
    );

    return;
  }


  const button =
    document.querySelector(".topbar button");

  button.disabled = true;

  button.textContent =
    "PDF तयार होत आहे...";


  document.body.classList.add("pdf-mode");


  try{

    const {
      jsPDF
    } = window.jspdf;


    const pdf =
      new jsPDF({
        orientation:"portrait",
        unit:"mm",
        format:"a4",
        compress:true
      });


    const pages =
      document.querySelectorAll(".page");


    for(let i=0; i<pages.length; i++){

      const page = pages[i];


      const canvas =
        await html2canvas(
          page,
          {
            scale:2,
            useCORS:true,
            backgroundColor:"#ffffff",
            logging:false
          }
        );


      const imgData =
        canvas.toDataURL(
          "image/jpeg",
          0.95
        );


      if(i > 0){

        pdf.addPage();

      }


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


    const name =
      applicantName.value.trim()
        .replace(/[\\/:*?"<>|]/g,"_")
        .replace(/\s+/g,"_");


    const fileName =
      name
        ? "PMAYG_" + name + ".pdf"
        : "PMAYG_Application.pdf";


    pdf.save(fileName);


    /* PDF तयार झाल्यावर */

    button.textContent =
      "PDF डाउनलोड झाले ✓";


    setTimeout(() => {

      button.textContent =
        "अर्ज जमा करा";

      button.disabled = false;

    },2000);


  }catch(error){

    console.error(error);

    alert(
      "PDF तयार करताना समस्या आली. कृपया पुन्हा प्रयत्न करा."
    );

    button.textContent =
      "अर्ज जमा करा";

    button.disabled = false;

  }


  document.body.classList.remove("pdf-mode");

}
