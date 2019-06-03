"use strict";

$(document).ready(function () {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        $("#androidDownload").hide();
        $("#iosDownload").show();
    } else if (/(Android)/i.test(navigator.userAgent)) {
        $("#iosDownload").hide();
        $("#androidDownload").show();
    } else {}
});