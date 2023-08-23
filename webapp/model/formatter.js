sap.ui.define([], function () {
    "use strict";
    return {
        formatDate: function (Date) {
            if (Date) {
                if (typeof Date === "object") {
                    let sDay, sMonth, sYear;
                    sDay = Date.getDate().toString();
                    sMonth = (Date.getMonth() + 1).toString();
                    sYear = Date.getFullYear().toString();
                    return sDay + "." + sMonth + "." + sYear;
                } else {
                    return Date;
                }
            }
        }
    }
});
    