sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, Fragment, MessageBox, formatter) {
        "use strict";

        const sUrl = "/V2/(S(v1e04grjqbm4draspggfmiek))/OData/OData.svc/",
            sEntitySet = "/Products",
            _addProductFragment = "project1.view.fragment.AddOrder",
            _infoCardFragment = "project1.view.fragment.InfoCard";

        return Controller.extend("project1.controller.Homepage", {

            formatter: formatter,

            onInit: function () {
                this._readProductsData();
            },

            _readProductsData: function () {
                let oDataModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
                oDataModel.read(sEntitySet, {
                    success: function (oData) {
                        let oDataOrders = oData.results,
                            oModel = new JSONModel();
                        oModel.setProperty("/Products", oDataOrders);
                        this.getView().setModel(oModel, "oProductsModel");
                    }.bind(this),
                    error: function (oError) {
                        MessageBox.error("Error");
                    }.bind(this)
                });
            },

            onSearch: function () {
                let oBindingItems = this.getView().byId("idProductsTable").getBinding("items"),
                    oSelectedProductID = this.getView().byId("idFBProductID").getSelectedItems(),
                    oSelectedProductName = this.getView().byId("idFBProductName").getValue(),
                    oSelectedReleaseDate = this.getView().byId("idFBReleaseDate").getDateValue(),
                    aAllFilters = [];

                if (oSelectedProductID.length > 0) {
                    oSelectedProductID.forEach(function (item) {
                        aAllFilters.push(new Filter({
                            path: "ID",
                            operator: FilterOperator.EQ,
                            value1: item.getKey()
                        }))
                    });
                }

                if (oSelectedProductName.length > 0) {
                    aAllFilters.push(new Filter({
                        path: "Name",
                        operator: FilterOperator.Contains,
                        value1: oSelectedProductName
                    }))
                }

                if (oSelectedReleaseDate !== null) {
                    aAllFilters.push(new Filter({
                        path: "ReleaseDate",
                        operator: FilterOperator.GE,
                        value1: oSelectedReleaseDate
                    }))
                }

                oBindingItems.filter(aAllFilters);
            },

            handleItemPress: function () {

            },

            onPressOpenPopover: function (oEvent) {
                let oView = this.getView(),
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
                let oAddProductModel = new JSONModel({
                    "ID": "",
                    "Name": "",
                    "Description": "",
                    "Price": "",
                    "ReleaseDate": new Date(),
                });
                this.getView().setModel(oAddProductModel, "oAddProductModel");
                this._getAddProductDialog().open();
            },

            _getAddProductDialog: function () {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("addProductFragment", _addProductFragment, this);
                    this.getView().addDependent(this._oDialog);
                }

                return this._oDialog;
            },

            handleSavePress: function () {
                let oNewProductData = this.getView().getModel("oAddProductModel").getData();
                oNewProductData.ID = Math.round(Math.random() * 1000);

                this.oDataCreate(oNewProductData);
            },

            oDataCreate: function (oNewProductData) {
                let oDataModel = new sap.ui.model.odata.v2.ODataModel(sUrl, true),
                    that = this;
                oDataModel.setHeaders({ "Content-ID": 1 });
                return new Promise(function (resolve, reject) {
                    oDataModel.create(sEntitySet, oNewProductData, {
                        success: function (response) {
                            resolve(response);
                            MessageBox.success("Product successfully added", {
                                actions: [MessageBox.Action.OK],
                                onClose: function () {
                                    that.handleCancelPress();
                                    that._readProductsData();
                                }.bind(this)
                            });
                        }.bind(this),
                        error: function (error) {
                            reject(error);
                            MessageBox.error("Error");
                        }.bind(this)
                    });
                })
            },

            handleCancelPress: function () {
                this._getAddProductDialog().close();
                this._getAddProductDialog().destroy();
                this._oDialog = undefined;
            },

            onPressEditOrder: function () {

            },

            onPressDeleteOrder: function () {
                let oTable = this.getView().byId("idProductsTable");
                if (oTable.getSelectedItem() !== null) {
                    MessageBox.warning("The selected product will be permanently removed. Do you want to continue?", {
                        actions: ["YES", "NO"],
                        onClose: async function (sAction) {
                            if (sAction === "YES") {
                                let iID = oTable.getSelectedItem().getBindingContext("oProductsModel").getObject().ID;
                                this.oDataRemove(iID);
                            }
                        }.bind(this)
                    });
                } else {
                    MessageBox.information("Please select a product to proceed");
                }
            },

            oDataRemove: function (iID) {
                let oDataModel = new sap.ui.model.odata.v2.ODataModel(sUrl),
                    that = this;
                oDataModel.setHeaders({ "Content-ID": 1 });
                return new Promise(function (resolve, reject) {
                    oDataModel.remove(("/Products(" + iID + ")"), {
                        success: function (oData) {
                            MessageBox.success("Product successfully removed", {
                                actions: [MessageBox.Action.OK],
                                onClose: function () {
                                    that._readProductsData();
                                }.bind(this)
                            });
                            resolve(oData);
                        }.bind(this),
                        error: function (error) {
                            MessageBox.error("Error");
                            reject(error); 
                        }.bind(this)
                    });
                })
            },
        });
    });
