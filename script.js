const form = document.getElementById("form");


/* ==========================
   नाव Automatic
========================== */

function syncName(){

    const name =
        document.getElementById("applicantName").value;

    document.getElementById("introName").value = name;

    document.getElementById("affName").value = name;

    document.getElementById("signName1").value = name;

    document.getElementById("signName2").value = name;
}


/* ==========================
   अर्जदाराचे गाव
========================== */

function syncVillage(){

    const village =
        document.querySelector('input[name="village"]').value;

    document.getElementById("affVillage").value = village;
}


/* ==========================
   PDF तयार करा
========================== */

async function submitForm(){

    syncName();
    syncVillage();

    if(!form.reportValidity()){

        alert(
            "कृपया अर्जातील सर्व आवश्यक माहिती पूर्ण भरा."
        );

        return;
    }


    const buttonArea =
        document.querySelector(".submit-area");


    buttonArea.style.visibility = "hidden";


    try{

        const { jsPDF } = window.jspdf;


        const pdf = new jsPDF({

            orientation:"portrait",

            unit:"mm",

            format:"a4",

            compress:true

        });


        const pages =
            document.querySelectorAll(".page");


        for(let i=0; i<pages.length; i++){

            const canvas =
                await html2canvas(
                    pages[i],
                    {
                        scale:2,
                        useCORS:true,
                        backgroundColor:"#ffffff",
                        logging:false
                    }
                );


            const image =
                canvas.toDataURL(
                    "image/jpeg",
                    0.90
                );


            if(i > 0){

                pdf.addPage(
                    "a4",
                    "portrait"
                );

            }


            pdf.addImage(
                image,
                "JPEG",
                0,
                0,
                210,
                297,
                undefined,
                "FAST"
            );

        }


        let name =
            document
            .getElementById("applicantName")
            .value
            .trim();


        if(!name){

            name = "अर्जदार";

        }


        name =
            name.replace(
                /[\\\/:*?"<>|]/g,
                "_"
            );


        pdf.save(
            "PMAYG_" + name + ".pdf"
        );


        alert(
            "अर्ज यशस्वीरित्या PDF मध्ये तयार झाला."
        );

    }

    catch(error){

        console.error(error);

        alert(
            "PDF तयार करताना समस्या आली. पुन्हा प्रयत्न करा."
        );

    }

    finally{

        buttonArea.style.visibility = "visible";

    }

}


/* ==========================
   PAGE LOAD
========================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const nameInput =
            document.getElementById("applicantName");


        const villageInput =
            document.querySelector(
                'input[name="village"]'
            );


        nameInput.addEventListener(
            "input",
            syncName
        );


        villageInput.addEventListener(
            "input",
            syncVillage
        );


        syncName();

        syncVillage();

    }
);
