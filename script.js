document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("pmayForm");
    const date = document.getElementById("date");
    const affidavitDate = document.getElementById("affidavitDate");

    // आजची तारीख
    const today = new Date();

    const formattedDate =
        String(today.getDate()).padStart(2, "0") + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        today.getFullYear();

    // Date input साठी YYYY-MM-DD
    const inputDate =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    if (date) {
        date.value = inputDate;
    }

    if (affidavitDate) {
        affidavitDate.value = inputDate;
    }


    // =========================
    // FORM SUBMIT
    // =========================

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        // Mobile validation
        const mobile =
            document.getElementById("mobile").value.trim();

        if (!/^[0-9]{10}$/.test(mobile)) {

            alert("कृपया योग्य १० अंकी मोबाईल नंबर टाका.");

            return;
        }


        // Aadhaar validation
        const aadhaar =
            document.getElementById("aadhaar").value.trim();

        if (
            aadhaar !== "" &&
            !/^[0-9]{12}$/.test(aadhaar)
        ) {

            alert("कृपया योग्य १२ अंकी आधार नंबर टाका.");

            return;
        }


        // अर्ज क्रमांक
        const applicationNumber =
            generateApplicationNumber();


        // Form Data
        const formData = new FormData(form);

        const data = {};

        formData.forEach(function (value, key) {
            data[key] = value;
        });


        // कायमचा विभाग
        data.applicationNumber = applicationNumber;
        data.createdAt = new Date().toLocaleString("mr-IN");

        data.taluka = "भोकरदन";
        data.district = "जालना";


        // Browser मध्ये अर्ज Save
        localStorage.setItem(
            "pmayApplication",
            JSON.stringify(data)
        );


        // अर्ज क्रमांक
        alert(
            "अर्ज यशस्वीरित्या जमा झाला!\n\n" +
            "अर्ज क्रमांक : " +
            applicationNumber +
            "\n\nआता PDF सेव्ह करा."
        );


        // PDF / Print
        downloadApplication();

    });

});


// =========================
// अर्ज क्रमांक
// =========================

function generateApplicationNumber() {

    const now = new Date();

    const year = now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

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


// =========================
// PDF DOWNLOAD
// =========================

function downloadApplication() {

    // Print window उघडणे
    const printWindow = window.open("", "_blank");

    if (!printWindow) {

        alert(
            "PDF तयार करण्यासाठी Pop-up Allow करा."
        );

        return;
    }


    // पूर्ण अर्जाची माहिती
    const application =
        document.querySelector(".container");


    // Print page तयार
    printWindow.document.write(`
    
        <!DOCTYPE html>

        <html lang="mr">

        <head>

            <meta charset="UTF-8">

            <title>
                प्रधानमंत्री आवास योजना - अर्ज
            </title>

            <style>

                @page {
                    size: A4;
                    margin: 12mm;
                }

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 0;

                    font-family:
                        "Noto Sans Devanagari",
                        "Mangal",
                        Arial,
                        sans-serif;

                    color: #222;

                    background: white;
                }

                .container {
                    width: 100%;
                    max-width: 100%;
                    background: white;
                    padding: 10px;
                }

                .header {
                    text-align: center;
                    margin-bottom: 18px;
                    border-bottom: 2px solid #222;
                    padding-bottom: 10px;
                }

                .header h1 {
                    margin: 0;
                    font-size: 25px;
                }

                .header h3 {
                    margin: 6px 0;
                    font-size: 17px;
                }

                .location {
                    font-size: 16px;
                    font-weight: bold;
                }

                .section-title {
                    margin-top: 18px;
                    margin-bottom: 10px;
                    padding: 7px;

                    background: #eeeeee;

                    border-left: 4px solid #333;

                    font-size: 17px;
                    font-weight: bold;
                }

                label {
                    display: block;
                    margin-top: 7px;
                    font-weight: bold;
                    font-size: 13px;
                }

                input,
                select {
                    width: 100%;

                    padding: 6px;

                    margin-top: 3px;
                    margin-bottom: 7px;

                    border: 1px solid #777;

                    border-radius: 3px;

                    font-size: 13px;

                    font-family: inherit;
                }

                input[type="radio"],
                input[type="checkbox"] {
                    width: auto;
                    margin: 0 4px 0 0;
                }

                .radio-box {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;

                    margin: 4px 0 8px;

                    padding: 5px;

                    border: 1px solid #ddd;

                    border-radius: 4px;
                }

                .radio-box label {
                    display: flex;
                    align-items: center;

                    margin: 0;

                    font-weight: normal;
                    font-size: 13px;
                }

                .question {
                    margin-bottom: 8px;
                }

                .declaration {
                    font-size: 13px;
                    line-height: 1.65;
                    text-align: justify;
                }

                .signature {
                    text-align: right;
                    margin-top: 20px;
                }

                button,
                .submit-btn,
                .success-box {
                    display: none !important;
                }

                /* PDF मध्ये दोन पानांचा अर्ज */

                .section-title:nth-of-type(2) {
                    page-break-before: auto;
                }

                @media print {

                    body {
                        background: white;
                    }

                    .container {
                        box-shadow: none;
                    }

                }

            </style>

        </head>

        <body>

            ${application.outerHTML}

        </body>

        </html>

    `);


    printWindow.document.close();


    // Print dialog
    setTimeout(function () {

        printWindow.focus();

        printWindow.print();

    }, 700);

}
