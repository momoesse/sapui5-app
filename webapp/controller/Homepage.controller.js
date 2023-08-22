sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment) {
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
            },

            handleItemPress: function () {

            },

            onPressOpenPopover: function (oEvent) {
                var oView = this.getView(),
                    oSourceControl = oEvent.getSource();
    
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "project1.view.fragment.Card"
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                } 
    
                this._pPopover.then(function (oPopover) {
                    oPopover.isOpen() ? oPopover.close(oSourceControl) : oPopover.openBy(oSourceControl);
                });
            },

            onToggleFooter: function () {
                let oFooter = this.getView().byId("dynamicPageId");
                oFooter.setShowFooter(!oFooter.getShowFooter());
            },
        });
    });
