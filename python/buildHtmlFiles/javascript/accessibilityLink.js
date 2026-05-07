(function waitForFooter() {
    var footerNav = document.querySelector("#wb-info .gc-sub-footer nav ul");

    if (!footerNav) {
    // Footer not ready yet – try again
    setTimeout(waitForFooter, 100);
    return;
    }

    // Prevent duplicate links
    if (footerNav.querySelector('a[href*="accessibility"]')) {
    return;
    }

    var li = document.createElement("li");
    var a = document.createElement("a");

    a.href = "{{ACCESSIBILITY_URL}}";
    a.textContent = "{{ACCESSIBILITY_TEXT}}";

    li.appendChild(a);
    footerNav.appendChild(li);
})();