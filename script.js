document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("pmayForm");

    const date = document.getElementById("date");

    const affidavitDate =
        document.getElementById("affidavitDate");


    /* =========================
       आजची तारीख
    ========================= */

    const today = new Date();

    const formattedDate =
        today.toISOString().split("T")[0];


    if (date) {
        date.value = formattedDate;
    }

    if (affidavitDate) {
        affidavitDate.value = formattedDate;
    }


    /* =========================
       FORM SUBMIT
    ========================= */

    if (form) {

        form.addEventListener("submit", function (event) {

            event.preventDefault();


            /* मोबाईल नंबर तपासणी */

            const mobile =
                document.getElementById("mobile")
                .value
                .trim();


            if (!/^[0-9]{10}$/.test(mobile)) {

                alert(
                    "कृपया योग्य १० अंकी मोबाईल नंबर टाका."
                );

                return;
            }


            /* आधार नंबर तपासणी */

            const aadhaar =
                document.getElementById("aadhaar")
                .value
                .trim();


            if (
                aadhaar !== "" &&
                !/^[0-9]{12}$/.test(aadhaar)
            ) {

                alert(
                    "कृपया योग्य १२ अंकी आधार नंबर टाका."
                );

                return;
            }


            /* अर्ज क्रमांक */

            const applicationNumber =
                generateApplicationNumber();


            document.getElementById(
                "applicationNumber"
            ).innerText =
                applicationNumber;


            /* Form Data */

            const formData =
                new FormData(form);


            const data = {};


            formData.forEach(function (value, key) {

                data[key] = value;

            });


            /* अतिरिक्त माहिती */

            data.applicationNumber =
                applicationNumber;

            data.createdAt =
                new Date().toLocaleString("mr-IN");

            data.district =
                "जालना";

            data.taluka =
                "भोकरदन";


            /* Local Storage */

            localStorage.setItem(
                "pmayApplication",
                JSON.stringify(data)
            );


            /* Success Box */

            const successBox =
                document.getElementById(
                    "successBox"
                );


            if (successBox) {

                successBox.style.display =
                    "block";


                successBox.scrollIntoView({
                    behavior: "smooth"
                });

            }


            alert(
                "अर्ज यशस्वीरित्या जमा झाला!"
            );

        });

    }

});


/* =========================
   अर्ज क्रमांक तयार करणे
========================= */

function generateApplicationNumber() {

    const now = new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        "PMAYG-" +
        year +
        month +
        day +
        "-" +
        random
    );

}


/* =========================
   PRINT / PDF
========================= */

function printApplication() {

    window.print();

}


/* =========================
   WHATSAPP SHARE
========================= */

function sendWhatsApp() {

    const savedData =
        localStorage.getItem(
            "pmayApplication"
        );


    if (!savedData) {

        alert(
            "अर्जाची माहिती उपलब्ध नाही."
        );

        return;

    }


    const data =
        JSON.parse(savedData);


    const name =
        data.applicantName ||
        data.name ||
        "";


    const mobile =
        data.mobile ||
        "";


    const applicationNumber =
        data.applicationNumber ||
        "";


    const message =

        "प्रधानमंत्री आवास योजना - घरकुल अर्ज\n\n" +

        "अर्ज क्रमांक: " +
        applicationNumber +
        "\n" +

        "नाव: " +
        name +
        "\n" +

        "मोबाईल: " +
        mobile +
        "\n" +

        "तालुका: भोकरदन\n" +

        "जिल्हा: जालना";


    const whatsappURL =
        "https://wa.me/?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank"
    );

}
