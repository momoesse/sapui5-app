sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, MessageBox) {
        "use strict";

        const sUrl = "/v2/Northwind/Northwind.svc/", 
            _addOrderFragment = "project1.view.fragment.AddOrder",
            _infoCardFragment = "project1.view.fragment.Card";

        return Controller.extend("project1.controller.Homepage", {
            onInit: function () {
                this._readOrdersData();
            },

            _readOrdersData: function () {
                var oDataModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
                oDataModel.read("/Products", {
                    success: function (oData) {
                        var oDataOrders = oData.results;
                        var oModel = new JSONModel();
                        oModel.setProperty("/Products", oDataOrders);
                        this.getView().setModel(oModel, "oOrdersModel");
                    }.bind(this),
                    error: function (oError) {
                        MessageBox.error("Error");
                    }.bind(this)
                });
            },

            onSearch: function (oEvent) {
                let oFilterBar = oEvent.getSource();
                this._getAllFilters(oFilterBar);
            },

            _getAllFilters: function (oFilterBar) {
                let oFilters = oFilterBar.getFilterGroupItems();

                oFilters.forEach(function(filter) {
                    filter
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
                        name: _infoCardFragment
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

            onPressAddOrder: function () {
                let oAddOrderModel = new JSONModel({
                    "ProductID": "",
                    "ProductName": "",
                    "QuantityPerUnit": "",
                    "UnitPrice": "",
                    "UnitsInStock": "",
                    "UnitsOnOrder": "",
                    "SupplierID": "",
                });
                this.getView().setModel(oAddOrderModel, "oAddOrderModel");
                this._getAddOrderDialog().open();
            },

            _getAddOrderDialog: function () {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("addOrderFragment", _addOrderFragment, this);
                    this.getView().addDependent(this._oDialog);
                }

                return this._oDialog;
            },

            handleSavePress: function () {
                let oNewOrderData = this.getView().getModel("oAddOrderModel").getData();
                oNewOrderData.ProductID = Number(oNewOrderData.ProductID); 

                var oDataModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
                oDataModel.setHeaders({ "Content-ID": 1 });
                oDataModel.create("/Products", oNewOrderData, {
                    success: function (oData) {
                        oData;
                        MessageBox.success("Product successfully added");
                    }.bind(this),
                    error: function (oError) {
                        MessageBox.error("Error");
                    }.bind(this)
                });
            },

            handleCancelPress: function () {

            },

            onPressEditOrder: function () {

            },

            onPressDeleteOrder: function () {

            },
        });
    });
