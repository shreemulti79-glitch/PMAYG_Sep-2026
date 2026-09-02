document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("pmayForm");

    const date = document.getElementById("date");

    const affidavitDate =
        document.getElementById("affidavitDate");


    // आजची तारीख

    const today = new Date();

    const formattedDate =
        today.toISOString().split("T")[0];


    date.value = formattedDate;

    affidavitDate.value = formattedDate;


    // Form Submit

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        // Mobile validation

        const mobile =
            document.getElementById("mobile").value.trim();


        if (!/^[0-9]{10}$/.test(mobile)) {

            alert(
                "कृपया योग्य १० अंकी मोबाईल नंबर टाका."
            );

            return;
        }


        // Aadhaar validation

        const aadhaar =
            document.getElementById("aadhaar").value.trim();


        if (
            aadhaar !== "" &&
            !/^[0-9]{12}$/.test(aadhaar)
        ) {

            alert(
                "कृपया योग्य १२ अंकी आधार नंबर टाका."
            );

            return;
        }


        // Application Number

        const applicationNumber =
            generateApplicationNumber();


        document.getElementById(
            "applicationNumber"
        ).innerText = applicationNumber;


        // Form Data

        const formData =
            new FormData(form);


        const data = {};


        formData.forEach(function (value, key) {

            data[key] = value;

        });


        data.applicationNumber =
            applicationNumber;

        data.createdAt =
            new Date().toLocaleString("mr-IN");


        data.district =
            "जालना";

        data.taluka =
            "भोकरदन";


        // Browser Local Storage

        localStorage.setItem(
            "pmayApplication",
            JSON.stringify(data)
        );


        // Success Box

        document.getElementById(
            "successBox"
        ).style.display = "block";


        // Scroll

        document.getElementById(
            "successBox"
        ).scrollIntoView({
            behavior: "smooth"
        });


        alert(
            "अर्ज यशस्वीरित्या जमा झाला!"
        );

    });

});



/*
    अर्ज क्रमांक तयार करणे
*/

function generateApplicationNumber() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(now.getDate())
        .padStart(2, "0");


    const random =
        Math.floor(
            1000 + Math.random() * 9000
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



/*
    Print / PDF
*/

function printApplication() {

    window.print();

}



/*
    WhatsApp Share
*/

function sendWhatsApp() {

    const data =
        JSON.parse(
            localStorage.getItem(
                "pmayApplication"
            )
        );


    if (!data) {

        alert(
            "अर्जाची माहिती उपलब्ध नाही."
        );

        return;

    }


    const message =

        "प्रधानमंत्री आवास योजना - घरकुल अर्ज%0A%0A" +

        "अर्ज क्रमांक: " +
        data.applicationNumber +
        "%0A" +

        "नाव: " +
        (data.applicantName || data.name || "") +
        "%0A" +

        "मोबाईल: " +
        (data.mobile || "") +
        "%0A" +

        "तालुका: भोकरदन%0A" +

        "जिल्हा: जालना";


    const whatsappURL =
        "https://wa.me/?text=" +
        message;


    window.open(
        whatsappURL,
        "_blank"
    );

}
