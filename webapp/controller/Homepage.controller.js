sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project1.controller.Homepage", {
            onInit: function () {
                this._readOrdersData();
            },

            _readOrdersData: function () {
                var oDataModel = new sap.ui.model.odata.v2.ODataModel("/v2/Northwind/Northwind.svc/");
                oDataModel.read("/Orders", {
                    success: function (oData, oResponse) {
                        var oDataOrders = oData.results;
                        var oModel = new JSONModel();
                        oModel.setProperty("/Orders", oDataOrders);
                        this.getView().setModel(oModel, "oOrdersModel");
                    }.bind(this),
                    error: function (oError) {
                        MessageBox.error("Error");
                    }.bind(this)
                });
            }
        });
    });
