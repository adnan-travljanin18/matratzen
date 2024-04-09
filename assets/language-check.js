document.addEventListener('DOMContentLoaded', function() {
    var pathname = window.location.pathname;
    var langCode = pathname.split("/");

    // Check if the language code exists in the URL
    if (langCode.includes("en")) {
        document.body.classList.add("english");
    } else if (langCode.includes("nl")) {
        document.body.classList.add("dutch");
    } else {
        document.body.classList.add("german");
    }
});