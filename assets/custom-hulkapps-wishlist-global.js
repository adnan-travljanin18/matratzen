//Polyfill for closest()
if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i,
            el = this;
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {};
        } while ((i < 0) && (el = el.parentElement));
        return el;
    };
}

//Polyfill for HTMLCollection.forEach
if ('NodeList' in window && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

//Polyfill for Array.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var thisArg = arguments[1];
            var k = 0;
            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                k++;
            }
            return undefined;
        }
    });
}

var HulkappWishlist = {
    init: function () {

        customerID = window.hulkappsWishlist.customerID;
        hulkShopDomain = window.hulkappsWishlist.domain;
        customerStatus = 'Customer';
        DefaultWishlistID = [];
        wishlistProductsData = [];
        wishlistsData = [];
        wishlistBtnStyle = '';
        deactivatedStore = false;
        appStatus = false;
        hulkUserUUID = null;
        allHulkWishlistButtons = Array.from(document.querySelectorAll('[data-wishlist]'));
        wishlistTotal = document.querySelector('[data-totalwishlistitems]');
        globalHulkDeleteWishlistPrompt = document.querySelectorAll("[data-hulkappsdeleteprompt]")[0];

        hulkSelectAll = document.querySelectorAll("[data-selectallwishlist]")[0];
        hulkSelectCheckbox = document.getElementById("hulk_select_all");
        hulkMoveAllItems = document.querySelectorAll("[data-hulkmoveallitmes]")[0];
        hulkDeleteAllItems = document.querySelectorAll("[data-hulkdeleteallitmes]")[0];
        hulkDeleteWishlistItemsPrompt = document.querySelectorAll("[data-hulkappsDeleteItemsPrompt]")[0];
        hulkDeleteWishlistItems = document.querySelectorAll("[data-deleteHulkWishlistItems]")[0];
        hulkCloseDeleteWishlistItems = document.querySelectorAll("[data-closeWishlistItemsPopup]")[0];
        hulkCloseDeleteWishlistItems2 = document.querySelectorAll("[data-closeWishlistItemsPopup2]")[0];

        hulkDeleteWishlistItemsPrompt = document.querySelectorAll("[data-hulkappsDeleteItemsPrompt]")[0];
        hulkMoveWishlistItemsPrompt = document.querySelectorAll('[data-hulkappsMoveItemsPrompt]')[0];
        hulkWishlistEmptyContainer =  document.querySelectorAll('[data-HulkEmptyWishlist]')[0];
        hulkCloseMyWishlistPopup2 = document.querySelectorAll("[data-closemywishlistpopup2]")[0];
        proxyURL = '/'+window.hulkappsWishlist.generalSettings.app_proxy_prefix+'/'+window.hulkappsWishlist.generalSettings.app_proxy_path;
        iconAnimationStyles = '-webkit-animation: heart 1s cubic-bezier(0.17, 0.89, 0.32, 1.49); animation: heart 1s cubic-bezier(0.17, 0.89, 0.32, 1.49);';
        wishlistTotal = document.querySelector('[data-totalwishlistitems]');

        globalSelectedWishlistID = '';
        selectedMyWishlistProductIds = [];
        selectedMyWishlistVariantIds = [];
        moveMyWishlistProductIds = [];
        moveMyWishlistVariantIds = [];
        productsCount = 0;
        outStockProductsCount = 0;
        emptyIconStyle = '';
        fillIconStyle = '';
        emptyCollectionIconStyle = '';
        fillCollectionIconStyle = '';
        btnExtraStyle = '';
        countExtraStyle = '';

        let guestWishlistData, wishlistButtonTarget;

        let hulkappsWishlistSettings = []
        hulkappsWishlistSettings['style'] = window.hulkappsWishlist.buttonStyleSettings;
        hulkappsWishlistSettings['general'] = window.hulkappsWishlist.generalSettings;
        hulkappsWishlistSettings['language'] = window.hulkappsWishlist.languageSettings;
        WishlistSettings = Object.assign({}, hulkappsWishlistSettings);

        HulkappWishlist._checkFOrInactiveStore();

        headerType = (WishlistSettings.style.header_type) ? WishlistSettings.style.header_type : 'header_menu';
        headerIconPosition = (WishlistSettings.style.header_icon_position) ? WishlistSettings.style.header_icon_position : 'manual_header_icon';

        buttonLayout = (WishlistSettings.general.button_layout != undefined) ? WishlistSettings.general.button_layout : 'multi_color_button';
        collectionCountLayout = (WishlistSettings.style.collection_count_layout != undefined) ? WishlistSettings.style.collection_count_layout : 'top_count';

        iconType = (WishlistSettings.style.icon_type) ? WishlistSettings.style.icon_type : 'outline';
        iconFillColor = (WishlistSettings.style.icon_fill_color) ? WishlistSettings.style.icon_fill_color : '#ffffff';
        iconBorderColor = (WishlistSettings.style.icon_border_color) ? WishlistSettings.style.icon_border_color : '#ffffff';
        iconHoverColor = (WishlistSettings.style.icon_hover_color) ? WishlistSettings.style.icon_hover_color : '#5C6AC4';
        selectedIconFillColor = (WishlistSettings.style.selected_icon_fill_color) ? WishlistSettings.style.selected_icon_fill_color : '#ffffff';
        selectedIconBorderColor = (WishlistSettings.style.selected_icon_border_color) ? WishlistSettings.style.selected_icon_border_color : '#ffffff';
        iconBackgroundType = (WishlistSettings.style.icon_background_type) ? WishlistSettings.style.icon_background_type : 'icon_no_background';
        iconBackgroundColor = (WishlistSettings.style.icon_background_color) ? WishlistSettings.style.icon_background_color : '#ccc';
        iconSize = (WishlistSettings.style.icon_size) ? WishlistSettings.style.icon_size : '16px';
        isCustomizeProductIcon = (WishlistSettings.style.customize_product_icon) ? WishlistSettings.style.customize_product_icon : false;

        collectionIconType = (WishlistSettings.style.collection_icon_type) ? WishlistSettings.style.collection_icon_type : 'outline';
        collectionIconFillColor = (WishlistSettings.style.collection_icon_fill_color) ? WishlistSettings.style.collection_icon_fill_color : WishlistSettings.style.theme_color;
        collectionIconBorderColor = (WishlistSettings.style.collection_icon_border_color) ? WishlistSettings.style.collection_icon_border_color : WishlistSettings.style.theme_color;
        collectionIconHoverColor = (WishlistSettings.style.collection_icon_hover_color) ? WishlistSettings.style.collection_icon_hover_color : '#000';
        selectedCollectionIconFillColor = (WishlistSettings.style.collection_selected_icon_fill_color) ? WishlistSettings.style.collection_selected_icon_fill_color : WishlistSettings.style.theme_color;
        selectedCollectionIconBorderColor = (WishlistSettings.style.collection_selected_icon_border_color) ? WishlistSettings.style.collection_selected_icon_border_color : WishlistSettings.style.theme_color;
        collectionIconBackgroundType = (WishlistSettings.style.collection_icon_background_type) ? WishlistSettings.style.collection_icon_background_type : 'icon_no_background';
        collectionIconBackgroundColor = (WishlistSettings.style.collection_icon_background_color) ? WishlistSettings.style.collection_icon_background_color : '#ccc';
        collectionIconSize = (WishlistSettings.style.collection_icon_size) ? WishlistSettings.style.collection_icon_size : '16px';
        isCustomizeCollectionIcon = (WishlistSettings.style.customize_collection_icon) ? WishlistSettings.style.customize_collection_icon : false;

        if(WishlistSettings.style.button_style === 'style_2' || WishlistSettings.style.button_style === 'style_4') {
            if(WishlistSettings.general.public_wishlist_count === 'show') {
                if(buttonLayout === 'multi_color_button') {
                    btnExtraStyle = 'padding:  '+ WishlistSettings.style.button_top_bottom_vertical_space + 'px ' + WishlistSettings.style.button_left_right_vertical_space + 'px; border-radius: '+ WishlistSettings.style.button_border_radius + 'px 0 0 '+ WishlistSettings.style.button_border_radius + 'px;';
                    countExtraStyle = 'padding:  '+ WishlistSettings.style.button_top_bottom_vertical_space + 'px 10px; opacity: 0.5; border-radius: 0 '+ WishlistSettings.style.button_border_radius + 'px '+ WishlistSettings.style.button_border_radius + 'px 0;';
                } else {
                    btnExtraStyle = 'padding: ' + WishlistSettings.style.button_top_bottom_vertical_space+'px 0px ' + WishlistSettings.style.button_top_bottom_vertical_space+'px ' + WishlistSettings.style.button_left_right_vertical_space+'px; border-radius: '+ WishlistSettings.style.button_border_radius + 'px 0 0 '+ WishlistSettings.style.button_border_radius + 'px;';
                    countExtraStyle = 'padding: ' + WishlistSettings.style.button_top_bottom_vertical_space+'px ' + WishlistSettings.style.button_left_right_vertical_space+'px '+WishlistSettings.style.button_top_bottom_vertical_space+'px 5px; border-radius: 0 '+ WishlistSettings.style.button_border_radius + 'px '+ WishlistSettings.style.button_border_radius + 'px 0;';
                }
            } else {
                btnExtraStyle = 'padding:  '+ WishlistSettings.style.button_top_bottom_vertical_space + 'px ' + WishlistSettings.style.button_left_right_vertical_space + 'px; border-radius: '+ WishlistSettings.style.button_border_radius + 'px;';
                countExtraStyle = '';
            }
        }

        if(isCustomizeProductIcon) {
            if(iconType === 'both') {
                emptyIconStyle = '-webkit-text-stroke: 1px '+iconBorderColor+'; color: '+iconFillColor+';font-size: '+iconSize + 'px;';
                fillIconStyle = '-webkit-text-stroke-color: '+selectedIconBorderColor+'; -webkit-text-stroke-width: 1.5px;color: '+selectedIconFillColor+';font-size: '+iconSize + 'px;';
            } else {
                emptyIconStyle = 'color: '+iconFillColor+';font-size: '+iconSize + 'px;';
                fillIconStyle = 'color: '+selectedIconFillColor+';font-size: '+iconSize + 'px;';
            }

            if(iconBackgroundType != 'icon_no_background') {
                emptyIconStyle += 'background: '+iconBackgroundColor+';';
                fillIconStyle += 'background: '+iconBackgroundColor+';';
                if(iconBackgroundType === 'icon_round_background') {
                    emptyIconStyle += 'border-radius: 50%;';
                    fillIconStyle += 'border-radius: 50%;';
                }
            }
        }

        if(isCustomizeCollectionIcon) {
            if(collectionIconType === 'both') {
                emptyCollectionIconStyle = '-webkit-text-stroke: 1px '+collectionIconBorderColor+'; color: '+collectionIconFillColor+';font-size: '+collectionIconSize + 'px;';
                fillCollectionIconStyle = '-webkit-text-stroke-color: '+selectedCollectionIconBorderColor+'; -webkit-text-stroke-width: 1.5px;color: '+selectedCollectionIconFillColor+';font-size: '+collectionIconSize + 'px;';
            } else {
                emptyCollectionIconStyle = 'color: '+collectionIconFillColor+';font-size: '+collectionIconSize + 'px;';
                fillCollectionIconStyle = 'color: '+selectedCollectionIconFillColor+';font-size: '+collectionIconSize + 'px;'
            }

            if(isCustomizeCollectionIcon && collectionIconBackgroundType != 'icon_no_background') {
                emptyCollectionIconStyle += 'background: '+collectionIconBackgroundColor+';padding: 5px 7px;';
                fillCollectionIconStyle += 'background: '+collectionIconBackgroundColor+';padding: 5px 7px;';
                if(collectionIconBackgroundType === 'icon_round_background') {
                    emptyCollectionIconStyle += 'border-radius: 50%;';
                    fillCollectionIconStyle += 'border-radius: 50%;';
                }
            }
        }

        let isFloatingButton = (WishlistSettings.style.wl_floating_button) ? WishlistSettings.style.wl_floating_button : false;
        if(isFloatingButton && (WishlistSettings.style.hide_floating_button_mobile_version === false || (WishlistSettings.style.hide_floating_button_mobile_version === true && window.innerWidth > 768))) {
            if(proxyURL != window.location.pathname) {
                HulkappWishlist._bulkUpdate();
                HulkappWishlist._wishlistFloatingButton();
            }
        }

        if(deactivatedStore == true){
            allHulkWishlistButtons.forEach(function(ele){
                ele.remove();
            });
            document.querySelectorAll('[data-hulksaveforlater]').forEach(function(ele){
                ele.remove();
            });
            return;
        }
        if(customerID == undefined || customerID == null || customerID.length <= 0){
            customerStatus = 'Guest';
        }

        if(customerStatus == 'Customer'){
            HulkappWishlist._deleteHulkWishlist();
        }

        if(window.hulkappsWishlist.productJSON && window.hulkappsWishlist.productJSON.tags) {
            var excludeEnabled = window.hulkappsWishlist.generalSettings.is_exclude_enabled ? window.hulkappsWishlist.generalSettings.is_exclude_enabled : false;
            var excludedProductTags = (window.hulkappsWishlist.generalSettings.exclude_product_tags) ? window.hulkappsWishlist.generalSettings.exclude_product_tags : [];
            if(excludedProductTags !== undefined) {
                var isExcluded =  excludedProductTags.some(value => window.hulkappsWishlist.productJSON.tags.includes(value));
                if(excludeEnabled && isExcluded) {
                    document.body.classList.add('hide-hulk-wishlist');
                }
            }
        }

        let hulkHeaderIcon = document.querySelector(".hulk-header-icon");
        if(headerIconPosition === 'auto_header_icon' && headerType === 'header_menu') {
            if(hulkHeaderIcon) {
                hulkHeaderIcon.remove();
            }
            HulkappWishlist._setHeaderIcon();
        }
        if(headerType === 'main_menu') {
            if(hulkHeaderIcon) {
                hulkHeaderIcon.remove();
            }
        }

        HulkappWishlist._manageGuestCookie();
        HulkappWishlist._getShopSettings();
        HulkappWishlist._removeMyWishlist();
        HulkappWishlist._addProductTocart();
    },

    _bulkUpdate: function() {
        let productIds = [];
        let variantIds = [];
        var wlItems = document.getElementsByName('hulk_wl_item');
        document.getElementById("hulk_select_all").onclick = function() {
            selectedMyWishlistProductIds = [];
            selectedMyWishlistVariantIds = [];
            for (var wlItem of wlItems) {
                let productId = wlItem.getAttribute('data-prod-id');
                let variantId = wlItem.getAttribute('data-var-id');
                if(hulkSelectCheckbox.checked){
                    wlItem.checked = true;
                } else {
                    wlItem.checked = false;
                }
                if(wlItem.checked) {
                    selectedMyWishlistProductIds.push(productId);
                    selectedMyWishlistVariantIds.push(variantId);
                } else {
                    var productIndex = selectedMyWishlistProductIds.indexOf(productId);
                    if (productIndex !== -1) {
                        selectedMyWishlistProductIds.splice(productIndex, 1);
                    }

                    var variantIndex = selectedMyWishlistVariantIds.indexOf(productId);
                    if (variantIndex !== -1) {
                        selectedMyWishlistVariantIds.splice(variantIndex, 1);
                    }
                }
            }
            HulkappWishlist._moveCartProductDetails();
            if(hulkSelectCheckbox.checked) {
                if(moveMyWishlistVariantIds.length > 0) {
                    hulkMoveAllItems.style.display = 'inline-block';
                }
                hulkDeleteAllItems.style.display = 'inline-block';
            } else {
                hulkMoveAllItems.style.display = 'none';
                hulkDeleteAllItems.style.display = 'none';
            }
        }

        hulkDeleteAllItems.onclick = function() {
            hulkDeleteWishlistItemsPrompt.classList.add('open');
            document.querySelector('[data-hulkappsdeleteitemsprompt] h4').innerHTML = (WishlistSettings.language.title.delete_bulk_product_text) ? WishlistSettings.language.title.delete_bulk_product_text : 'Are you sure you want to delete selected products?';
            document.querySelectorAll("[data-deleteHulkWishlistItems]")[0].onclick = function() {
                hulkDeleteWishlistItemsPrompt.classList.remove('open');
                if(customerStatus == 'Guest') {
                    HulkappWishlist._removeFromGuestWishlist(selectedMyWishlistProductIds, selectedMyWishlistVariantIds);
                } else {
                    HulkappWishlist._removeFromCustomerWishlist(selectedMyWishlistProductIds, selectedMyWishlistVariantIds);
                }
            }
        }
        document.querySelector('[data-closewishlistitemspopup]').addEventListener('click',(event)=>{
            if (!(event.target && event.target.hasAttribute('data-hulkdeleteproduct') == true)){
                hulkDeleteWishlistItemsPrompt.classList.remove('open');
            }
        })
        if (typeof hulkCloseDeleteWishlistItems2 !== 'undefined') {
            hulkCloseDeleteWishlistItems2.onclick = function() {
                hulkDeleteWishlistItemsPrompt.classList.remove('open');
            }
        }

        var siteOverLay = document.querySelector('[data-hulkappsdeleteitemsprompt]');
        if(siteOverLay != null) {
            siteOverLay.addEventListener('click', function(e) {
                if (!(e.target && e.target.hasAttribute('data-hulkdeleteproduct') == true)){
                    var closer = e.target.closest('.wishlist-modal');
                    if(closer == null) {
                        document.querySelector('[data-closewishlistitemspopup2]')?.click();
                    }
                }
            })
        }

        document.querySelectorAll('[data-hulkappsMoveItemsCancel] .icon-wishlist-cross').forEach(function(element) {
            element.onclick = function() {
                hulkMoveWishlistItemsPrompt.classList.remove('open');
            }
        });

        var siteOverLayQuickView = document.querySelector('[data-hulkquickview]');
        if(siteOverLayQuickView != null) {
            siteOverLayQuickView.addEventListener('click', function(e) {
                var closer = e.target.closest('.wishlist-modal');
                if(closer == null) {
                    document.querySelector('[data-hulkquickview]')?.classList.remove('open');
                }
            })
        }

        hulkMoveAllItems.onclick = function() {
            HulkappWishlist._moveCartProductDetails();
            hulkMoveWishlistItemsPrompt.classList.add('open');
            document.querySelector('[data-hulkappsmoveitemsprompt] h4').innerHTML = (WishlistSettings.language.title.move_bulk_wishlist_text) ? WishlistSettings.language.title.move_bulk_wishlist_text : 'Are you sure you want to move selected products to your cart?';
            document.addEventListener('click', function(event) {
                if (event.target && event.target.hasAttribute('data-hulkappsMoveItemsOk') == true) {
                    hulkMoveWishlistItemsPrompt.classList.remove('open');
                    HulkappWishlist._moveProductToCart(moveMyWishlistProductIds, moveMyWishlistVariantIds);
                }
            });
            var siteMoveOverLay = document.querySelector('[data-hulkappsMoveItemsPrompt]');
            if(siteMoveOverLay != null) {
                siteMoveOverLay.addEventListener('click', function(e) {
                    var closer = e.target.closest('.wishlist-modal');
                    if(closer == null) {
                        document.querySelector('[data-hulkappsMoveItemsCancel]')?.click();
                    }
                })
            }
            document.querySelectorAll('[data-hulkappsMoveItemsCancel]').forEach(function(element) {
                element.onclick = function() {
                    hulkMoveWishlistItemsPrompt.classList.remove('open');
                }
            });
        }

        setTimeout(function() {
            HulkappWishlist._selectWishlistProducts();
        }, 3000);
    },

    _moveCartProductDetails: function() {
        moveMyWishlistProductIds = JSON.parse(JSON.stringify(selectedMyWishlistProductIds));
        moveMyWishlistVariantIds = JSON.parse(JSON.stringify(selectedMyWishlistVariantIds));

        if(document.querySelectorAll('.hulk_out_of_stock') != undefined && document.querySelectorAll('.hulk_out_of_stock') != null) {
            const outStockElems = document.querySelectorAll('.hulk_out_of_stock');
            for(const element of outStockElems) {
                var dataProductIndex = moveMyWishlistProductIds.indexOf(element.getAttribute('data-prod-id'));
                if (dataProductIndex !== -1) {
                    moveMyWishlistProductIds.splice(dataProductIndex, 1);
                }
                var dataVariantIndex = moveMyWishlistVariantIds.indexOf(element.getAttribute('data-var-id'));
                if (dataVariantIndex !== -1) {
                    moveMyWishlistVariantIds.splice(dataVariantIndex, 1);
                }
            }
        }
    },

    _removeMyWishlist: function(){
        document.addEventListener('click', function(event){
            if(event.target && event.target.hasAttribute('data-hulkdeleteproduct') == true){
                event.preventDefault();
                event.stopImmediatePropagation();
                const currentParent = event.target.closest('.wishlist-card');
                let product_id = [currentParent.getAttribute('data-proid')];
                let variant_id = [currentParent.getAttribute('data-varid')];
                hulkDeleteWishlistItemsPrompt.classList.add('open');
                document.querySelector('[data-hulkappsdeleteitemsprompt] h4').innerHTML = (WishlistSettings.language.title.delete_product_text) ? WishlistSettings.language.title.delete_product_text : 'Are you sure you want to delete this product?';
                hulkDeleteWishlistItems.onclick = function() {
                    hulkDeleteWishlistItemsPrompt.classList.remove('open');
                    if(customerStatus == 'Guest'){
                        HulkappWishlist._removeFromGuestWishlist(product_id, variant_id, 'single');
                    }else{
                        HulkappWishlist._removeFromCustomerWishlist(product_id, variant_id, 'single');
                    }
                }
            }
        });
    },

    _removeFromCustomerWishlist: function(productIds, variantIds, type = null) {
        const data = {
            customer_id: customerID,
            shop: hulkShopDomain,
            product_ids: productIds,
            variant_ids: variantIds,
            wishlist_ids: [SelectedWishlistID],
            type: 'web'
        };
        if(type === 'single') {
            var index = selectedMyWishlistProductIds.indexOf(productIds[0]);
            if (index !== -1) {
                selectedMyWishlistProductIds.splice(index, 1);
            }
        }
        HulkappWishlist._XMLHttpRequest('POST', window.hulkappsWishlist.baseURL + '/wishlist/delete_product', data, function(status, response){
            let finalResponse = JSON.parse(response);
            if(status == 200){
                HulkappWishlist._getWishlistProducts(SelectedWishlistID, 1);
                if(wishlistTotal){
                    HulkappWishlist._updateWishlistTotal();
                }

                hulkSelectCheckbox.checked = false;
                hulkMoveAllItems.style.display = 'none';
                hulkDeleteAllItems.style.display = 'none';
                selectedMyWishlistProductIds = [];
                selectedMyWishlistVariantIds = [];
                let msg = 'Item removed!';
                if(finalResponse.message){ msg = finalResponse.message; }
                let is_latest_notification = finalResponse.isLatestNotification || false;
                HulkappWishlist._messageUpdate(msg, finalResponse.title, finalResponse.image, is_latest_notification);
            }else{
                let msg = 'Something went wrong. Please try again later !';
                if(finalResponse.message){ msg = finalResponse.message; }
                HulkappWishlist._messageUpdate(msg);
            }
        });
    },

    _removeFromGuestWishlist: function(productIds, variantIds, type = null){
        let requestURL = window.hulkappsWishlist.baseURL + '/wishlist/delete_product/guest';
        const data = {
            shop: hulkShopDomain,
            product_ids: productIds,
            variant_ids: variantIds,
            uuid: hulkUserUUID,
            type: 'web'
        };
        if(type === 'single') {
            var index = selectedMyWishlistProductIds.indexOf(productIds[0]);
            if (index !== -1) {
                selectedMyWishlistProductIds.splice(index, 1);
            }
        }
        HulkappWishlist._XMLHttpRequest('POST', requestURL, data, function(status, response){
            let finalResponse = JSON.parse(response);
            if(status == 200){
                if(hulkUserUUID != null){
                    HulkappWishlist._guestWishlistAPI(hulkUserUUID, 1);
                }
                HulkappWishlist._updateWishlistTotal();
                hulkSelectCheckbox.checked = false;
                hulkMoveAllItems.style.display = 'none';
                hulkDeleteAllItems.style.display = 'none';
                selectedMyWishlistProductIds = [];
                selectedMyWishlistVariantIds = [];
            }else{
                let errorMessage = JSON.parse(response);
                let msg = 'Something went wrong. Please try again later';
                if(response.message){ msg = errorMessage.message; }
                HulkappWishlist._messageUpdate(msg);
            }
        });
    },

    _selectWishlistProducts() {
        if(document.querySelectorAll('[hulk-select-products]') != undefined && document.querySelectorAll('[hulk-select-products]') != null) {
            //let outStockProductsCount = document.querySelectorAll('.hulk_out_of_stock').length;
            document.addEventListener('click', function(event){
                if(event.target && event.target.hasAttribute('hulk-select-products') == true){
                    //event.preventDefault();
                    let currentTarget = event.target;
                    let productId = currentTarget.getAttribute('data-prod-id');
                    let variantId = currentTarget.getAttribute('data-var-id');
                    if(currentTarget.checked) {
                        selectedMyWishlistProductIds.push(productId);
                        selectedMyWishlistVariantIds.push(variantId);
                    } else {
                        var productIndex = selectedMyWishlistProductIds.indexOf(productId);
                        if (productIndex !== -1) {
                            selectedMyWishlistProductIds.splice(productIndex, 1);
                        }

                        var variantIndex = selectedMyWishlistVariantIds.indexOf(variantId);
                        if (variantIndex !== -1) {
                            selectedMyWishlistVariantIds.splice(variantIndex, 1);
                        }
                    }
                    if(selectedMyWishlistProductIds.length > 0 && productsCount != outStockProductsCount) {
                        hulkMoveAllItems.style.display = 'inline-block';
                    } else {
                        hulkMoveAllItems.style.display = 'none';
                    }
                    if(selectedMyWishlistProductIds.length > 0) {
                        hulkDeleteAllItems.style.display = 'inline-block';
                    } else {
                        hulkDeleteAllItems.style.display = 'none';
                    }
                    if(productsCount == selectedMyWishlistProductIds.length) {
                        hulkSelectCheckbox.checked = true;
                    } else {
                        hulkSelectCheckbox.checked = false;
                    }
                }
            });
        }

    },

    _addProductTocart: function(){
        document.addEventListener('click', function(event){
            if(event.target && event.target.hasAttribute('data-addprotocart') == true){
                event.preventDefault();
                hulkMoveWishlistItemsPrompt.classList.add('open');
                document.querySelector('[data-hulkappsmoveitemsprompt] h4').innerHTML = (WishlistSettings.language.title.move_wishlist_text) ? WishlistSettings.language.title.move_wishlist_text : 'Are you sure you want to move this item to your cart?';
                const buttonEle = event.target;
                const currentParent = buttonEle.closest('.wishlist-card');
                document.addEventListener('click', function(event){
                    if(event.target && event.target.hasAttribute('data-hulkappsMoveItemsOk') == true) {
                        hulkMoveWishlistItemsPrompt.classList.remove('open');
                        const proID = [currentParent.getAttribute('data-proid')];
                        const varID = [currentParent.getAttribute('data-varid')];
                        HulkappWishlist._moveProductToCart(proID, varID, 'single');
                    }
                });
                var siteMoveOverLay = document.querySelector('[data-hulkappsMoveItemsPrompt]');
                if(siteMoveOverLay != null) {
                    siteMoveOverLay.addEventListener('click', function(e) {
                        var closer = e.target.closest('.wishlist-modal');
                        if(closer == null) {
                            document.querySelector('[data-hulkappsMoveItemsCancel]')?.click();
                        }
                    })
                }
                document.addEventListener('click', function(event) {
                    if (event.target && event.target.hasAttribute('data-hulkappsMoveItemsCancel') == true) {
                        hulkMoveWishlistItemsPrompt.classList.remove('open');
                    }
                });
            }
        });
    },

    _loadCustomJs() {

        let globalJs = WishlistSettings.general.custom_js;
        if(WishlistSettings.general && globalJs && globalJs != ''){
            let hulkGlobalJs = document.createElement('script');
            hulkGlobalJs.type = 'text/javascript';
            hulkGlobalJs.appendChild(document.createTextNode(WishlistSettings.general.custom_js));
            document.getElementsByTagName("head")[0].appendChild(hulkGlobalJs);
        }
    },

    _moveProductToCart(productIds, variantIds, type = null) {
        if(type === 'single') {
            var index = selectedMyWishlistProductIds.indexOf(productIds[0]);
            if (index !== -1) {
                selectedMyWishlistProductIds.splice(index, 1);
            }
        }
        var stayOnWLPage = WishlistSettings.general.stay_WL_page_after_add_cart;
        if(WishlistSettings.general.stay_WL_page_after_add_cart === undefined) {
            stayOnWLPage = true;
        }

        const items = [];
        for (var i = 0; i < variantIds.length; i++) {
            let variantId = variantIds[i];
            const buttonEle = document.querySelector('[data-varid="'+variantId+'"]');
            buttonEle.classList.add('move-data');
            items.push({
                id: variantId,
                quantity: 1,
                properties: {"_wishlist_item": true}
            });
        }

        let data = {
            'items': items
        };

        if(items.length > 0) {
            fetch("/cart/add.js", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            }).then(function(response) {
                if (response.status === 200) {
                    const buttonEle = document.querySelectorAll('.move-data');
                    buttonEle.innerHTML = (WishlistSettings.language.button.after_move_to_cart) ? WishlistSettings.language.button.after_move_to_cart : 'Added!';
                    setTimeout(function(){
                        buttonEle.innerHTML = WishlistSettings.language.button.move_to_cart;
                        if(WishlistSettings.general.delete_on_move_to_wishlist == true){
                            if(customerStatus == 'Guest'){
                                HulkappWishlist._removeFromGuestWishlist(productIds, variantIds, type);
                            }else {
                                HulkappWishlist._removeFromCustomerWishlist(productIds, variantIds, type);
                            }
                            if(stayOnWLPage === false) {
                                setTimeout(function(){
                                    window.location.href = '/cart';
                                }, 1000);
                            }
                        }else{
                            if(stayOnWLPage === false) {
                                window.location.href = '/cart';
                            }
                        }
                    }, 2000);
                    let msg = (WishlistSettings.language.success_message.wishlist_move) ? WishlistSettings.language.success_message.wishlist_move : 'Wishlist moved successfully!';
                    HulkappWishlist._messageUpdate(msg);
                } else {
                    let msg = 'Something went wrong. Please try again later';
                    if(response.message){ msg = response.message; }
                    HulkappWishlist._messageUpdate(msg);
                }
            });
        }
    },

    _wishlistFloatingButton: function() {
        if(customerStatus == 'Customer' || (customerStatus == 'Guest' && WishlistSettings.general.is_guest_enabled == true)){
            document.querySelector('[data-hulkLoginMsg]').style.display = 'none';
        }

        let setFloatingBtn = '';
        setFloatingBtn+= '<a class="hulk-sidebar-widget heart-wishlist-animation" hulk-floating-btn>';
        let wishlistText = (WishlistSettings.style.floating_my_wishlist_text) ? WishlistSettings.style.floating_my_wishlist_text : 'My wishlist';

        if(WishlistSettings.style.floating_button_type === 'text_with_icon') {
            setFloatingBtn += '<i class="heart-hulk-animation"><i class="icon-wishlist-heart-empty"></i></i> '+wishlistText;
        } else if(WishlistSettings.style.floating_button_type === 'text') {
            setFloatingBtn += wishlistText;
        } else {
            setFloatingBtn += '<i class="heart-hulk-animation"><i class="icon-wishlist-heart-empty"></i></i>';
        }
        setFloatingBtn += '</a>';
        document.body.insertAdjacentHTML('beforeend', setFloatingBtn);

        let floatingBtn = document.querySelector('.hulk-sidebar-widget');
        let floatingBgBtn = floatingBtn.style.backgroundColor = (WishlistSettings.style.floating_button_background_color) ? WishlistSettings.style.floating_button_background_color : '#5C6AC4';
        let floatingTextBtn = floatingBtn.style.color = (WishlistSettings.style.floating_button_text_color) ? WishlistSettings.style.floating_button_text_color : 'right_center';
        floatingBtn.style.paddingTop = floatingBtn.style.paddingBottom = (WishlistSettings.style.floating_button_top_bottom_vertical_space) ? WishlistSettings.style.floating_button_top_bottom_vertical_space+'px' : '6px';
        floatingBtn.style.paddingLeft = floatingBtn.style.paddingRight = floatingBtn.style.paddingRight = (WishlistSettings.style.floating_button_left_right_vertical_space) ? WishlistSettings.style.floating_button_left_right_vertical_space+'px' : '8px';
        floatingBtn.style.fontSize = (WishlistSettings.style.floating_button_font_size) ? WishlistSettings.style.floating_button_font_size+'px' : '14px';
        floatingBtn.style.fontWeight = floatingBtn.style.paddingRight = (WishlistSettings.style.floating_button_font_weight) ? WishlistSettings.style.floating_button_font_weight : '600';

        let position = (WishlistSettings.style.floating_button_position) ? WishlistSettings.style.floating_button_position : 'right_center';
        floatingBtn.setAttribute('data-position', position);
        document.querySelectorAll('[data-hulkappsWishlistPopup]')[0].classList.remove('open');

        let isCustomTitle = (WishlistSettings.general.is_my_wishlist_custom_title) ? WishlistSettings.general.is_my_wishlist_custom_title : false;
        let customTitle = (WishlistSettings.general.my_wishlist_custom_title) ? WishlistSettings.general.my_wishlist_custom_title : 'Your Wishlist';
        if(isCustomTitle) {
            document.querySelectorAll('[data-sidebarWidgetwishlisttitle]')[0].innerHTML = customTitle;
        } else {
            document.querySelectorAll('[data-sidebarWidgetwishlisttitle]')[0].innerHTML = WishlistSettings.language.title.guest_wishlist_title;
        }

        if(WishlistSettings.style.display_my_wishlist_as === 'popup') {
            if(document.querySelector('[data-viewMore]') != undefined || document.querySelector('[data-viewMore]') != null) {
                document.querySelector('[data-viewMore]').setAttribute('href', proxyURL);
            }
            HulkappWishlist._openMyWishlistPopup(floatingBtn);
        } else {
            floatingBtn.setAttribute('href', proxyURL);
        }

        document.addEventListener('mouseover', function(event){
            if(event.target && event.target.hasAttribute('hulk-floating-btn') == true){
                event.target.style.backgroundColor = (WishlistSettings.style.hover_floating_button_background_color) ? WishlistSettings.style.hover_floating_button_background_color : '#5c6ac4';
                event.target.style.color = (WishlistSettings.style.hover_floating_button_text_color) ? WishlistSettings.style.hover_floating_button_text_color : '#ffffff';
            }
        });

        document.addEventListener('mouseout', function(event){
            if(event.target && event.target.hasAttribute('hulk-floating-btn') == true){
                event.target.style.backgroundColor = floatingBgBtn;
                event.target.style.color = floatingTextBtn;
            }
        });
    },

    _removeBulkActions: function() {
        if (WishlistSettings.general.bulk_action_enabled !== undefined && WishlistSettings.general.bulk_action_enabled === false) {
            let bulkAction = document.querySelector('.bulk_action');
            if (bulkAction) bulkAction.style.display = 'none';
            let selectors = document.querySelectorAll('[hulk-select-products]');
            if (selectors.length) {
                selectors.forEach(function (selector) {
                    selector.style.display = 'none';
                })
            }
        }
    },

    _openMyWishlistPopup: function(floatingBtn) {
        floatingBtn.onclick = function() {
            document.querySelector('.close-btn[data-closemywishlistpopup]').style.marginLeft = '15px';
            document.querySelectorAll("[data-hulkappsmywishlistpopup]")[0].classList.add('open');
            document.querySelector('[data-addProductBtn]').style.display = 'none';
            hulkSelectAll.style.display = 'none';
            DefaultWishlistID = DefaultWishlistID.filter(function (item, pos) {
                return DefaultWishlistID.indexOf(item) == pos;
            });
            SelectedWishlistID = DefaultWishlistID;
            if (customerStatus == 'Customer' || (customerStatus == 'Guest' && WishlistSettings.general.is_guest_enabled == true)) {
                document.querySelector('[data-loginBtn]').style.display = 'none';
                document.querySelector('[data-hulkloginmsg]').style.display = 'none';
                if (customerStatus == 'Customer') {
                    if (WishlistSettings.general.has_multiple_wishlist) {
                        let userWishlists = document.querySelector('[data-sidebarWidgetHulkWishlists]');
                        userWishlists.style.display = 'block';
                        let wishlistHTML = '';
                        if (typeof (wishlistsData) === "string") {
                            wishlistsData = JSON.parse(wishlistsData)
                        }
                        wishlistsData.forEach(function (element) {
                            wishlistHTML += ' <option value="' + element.id + '" data-sidebarWidgetHulkWishlist>' + element.name;
                            wishlistHTML += '</option>';
                        });
                        userWishlists.innerHTML = wishlistHTML;

                        document.addEventListener('change', function (event) {
                            if (event.target && event.target.hasAttribute('data-sidebarWidgetHulkWishlists') == true) {
                                SelectedWishlistID = event.target.value;
                                HulkappWishlist._getWishlistProducts(SelectedWishlistID, 1);
                                hulkSelectCheckbox.checked = false;
                                hulkMoveAllItems.style.display = 'none';
                                hulkDeleteAllItems.style.display = 'none';
                                selectedMyWishlistProductIds = [];
                                selectedMyWishlistVariantIds = [];
                            }
                        });
                    }

                    HulkappWishlist._getWishlistProducts(SelectedWishlistID, 1);
                } else {
                    if (hulkUserUUID != null) {
                        HulkappWishlist._guestWishlistAPI(hulkUserUUID, 1);
                    }
                    if (hulkUserUUID == null) {
                        hulkWishlistEmptyContainer.style.display = 'block';
                        //document.querySelector('[data-addProductBtn]').style.marginRight = '15px';
                    }
                }

            } else {
                document.querySelector('[data-hulkloginmsg]').style.display = 'inline-block';
                document.querySelector('[data-loginBtn]').style.display = 'inline-block';
            }
        }
        if (typeof hulkCloseMyWishlistPopup2 !== 'undefined') {
            hulkCloseMyWishlistPopup2.onclick = function() {
                document.querySelectorAll("[data-hulkappsmywishlistpopup]")[0].classList.remove('open');
            }
        }

        var siteOverLay = document.querySelector('[data-hulkappsmywishlistpopup]');
        if(siteOverLay != null) {
            siteOverLay.addEventListener('click', function(e) {
                if (!(e.target && e.target.hasAttribute('hulk-floating-btn') == true)){
                    var closer = e.target.closest('.wishlist-modal');
                    if(closer == null) {
                        document.querySelector('[data-closeMyWishlistPopup2]')?.click();
                    }
                }
            })
        }
        if(document.querySelectorAll("[data-closemywishlistpopup]") != null && document.querySelectorAll("[data-closemywishlistpopup]") != undefined){
            document.querySelectorAll("[data-closemywishlistpopup]").forEach(function(ele){
                ele.onclick = function(event) {
                    document.querySelectorAll("[data-hulkappsmywishlistpopup]")[0].classList.remove('open');
                }
            });
        }
    },

    _getWishlistProducts: function(wishlist_id, page) {
        if(customerID == null || customerID == undefined){
            return;
        }
        let productListingHTML = '';
        const ShopRequestURL = window.hulkappsWishlist.baseURL + '/wishlist/products?page='+page+'&customer_id='+customerID+'&shop='+hulkShopDomain+'&wishlist_id='+wishlist_id;
        HulkappWishlist._XMLHttpRequest('GET', ShopRequestURL, '', function(status, response){
            let finalResponse = JSON.parse(response);
            if(status == 200){

                const productListing = finalResponse.data;
                productsCount = finalResponse.data.length;

                productListing.forEach(function(product){
                    productListingHTML += '<div class="wishlist-card" data-id="'+product.id+'" data-handle="'+product.handle+'" data-proID="'+product.product_id+'" data-varID="'+product.variant_id+'"><div class="wishlist__product">';
                    productListingHTML += '<div class="wishlist__product-img" data-hulkQuickViewEle><a href="/products/'+product.handle+'" class="wishlist-product__image">';
                    if(product.image === null || product.image ===  undefined) {
                        productListingHTML += '<div style="background: #f5f5f5; width: 100%; height: 100%; display: block;"></div>';
                    } else {
                        productListingHTML += '<img data-hulkQuickViewEle src="'+product.image+'" alt="'+product.title+'" class="img-list">';
                    }
                    productListingHTML += '</a>';

                    if(product.in_stock == true){
                        productListingHTML += '<input type="checkbox" name="hulk_wl_item" value="'+product.id+'" data-prod-id="'+product.product_id+'" data-var-id="'+product.variant_id+'" class="hulk_wl_item_select" hulk-select-products>';
                    } else {
                        productListingHTML += '<input type="checkbox" name="hulk_wl_item" value="'+product.id+'" data-prod-id="'+product.product_id+'" data-var-id="'+product.variant_id+'" class="hulk_wl_item_select hulk_out_of_stock" hulk-select-products>';
                    }

                    productListingHTML += '<p class="item__delete grid__view"><a href="#" data-HulkDeleteProduct class="icon-wishlist-remove hulkThemeColor"></a></p> </div>';
                    productListingHTML += '<div class="wishlist__product-content">';
                    if(product.vendor != undefined && product.vendor != null && product.vendor.length > 0){
                        productListingHTML += '<p class="vendor">'+product.vendor+'</p>';
                    }
                    productListingHTML += '<p class="product__title">'+product.title+'</p><p class="price"><span class="money conversion-bear-money">'+product.price+'</span></p>';
                    if(product.variant_options != 'Default Title') {
                        productListingHTML += '<p class="varient">'+product.variant_options+'</p>';
                    }
                    else {
                        productListingHTML += '<p class="varient" style="display: block;"></p>';
                    }
                    productListingHTML += '</div>';
                    productListingHTML += '<div class="wishlist-status">';
                    if(product.in_stock == true){
                        productListingHTML += '<button class="wishlist-btn hulkBtnStyle" data-addProToCart style="background-color: '+WishlistSettings.style.theme_color+'; border: 1px solid '+WishlistSettings.style.theme_color+'; color: white">'+WishlistSettings.language.button.move_to_cart+'</button>';
                    }else{
                        productListingHTML += '<button class="wishlist-btn" disabled>'+WishlistSettings.language.button.out_of_stock+'</button>';
                    }
                    productListingHTML += '<p class="added_date grid__view">' + WishlistSettings.language.date_label + ' ' + product.added_on+'</p></div>';
                    productListingHTML += '</div></div>';
                });
                if(finalResponse.total > 0){
                    document.querySelector('[data-addProductBtn]').style.display = 'none';
                    document.querySelector('[data-viewMore]').style.display = 'inline-block';
                    //document.querySelector('[data-viewMore]').style.marginRight = '15px';
                    hulkSelectAll.style.display = 'inline-block';
                    hulkWishlistEmptyContainer.style.display  = 'none';
                }else{
                    hulkSelectAll.style.display = 'none';
                    hulkWishlistEmptyContainer.style.display  = 'block';
                    document.querySelector('[data-addProductBtn]').style.display = 'inline-block';
                    //document.querySelector('[data-addProductBtn]').style.marginRight = '15px';
                    document.querySelector('[data-viewMore]').style.display = 'none';
                }

                document.querySelectorAll('[data-hulkMyWishlistItems]')[0].innerHTML = productListingHTML;
                if (window.conversionBearAutoCurrencyConverter) window.conversionBearAutoCurrencyConverter.convertPricesOnPage();
                HulkappWishlist._removeBulkActions();
                outStockProductsCount = document.querySelectorAll('.hulk_out_of_stock').length;


            }else{
                let msg = 'Something went wrong. Please try again later !';
                if(finalResponse.message){ msg = finalResponse.message; }
                HulkappWishlist._messageUpdate(msg);
            }
        });
    },

    _guestWishlistAPI: function(hulkUserUUID, page) {

        let productListingHTML = '';
        const ShopRequestURL = window.hulkappsWishlist.baseURL + '/wishlist/products/guest?uuid='+hulkUserUUID+'&page='+page+'&shop='+hulkShopDomain;
        HulkappWishlist._XMLHttpRequest('GET', ShopRequestURL, '', function(status, response){
            let finalResponse = JSON.parse(response);
            if(status == 200){
                const productListing = finalResponse.data;
                productsCount = finalResponse.data.length;
                productListing.forEach(function(product){
                    productListingHTML += '<div class="wishlist-card" data-id="'+product.id+'" data-handle="'+product.handle+'" data-proID="'+product.product_id+'" data-varID="'+product.variant_id+'"><div class="wishlist__product">';
                    productListingHTML += '<div class="wishlist__product-img" data-hulkQuickViewEle><a href="/products/'+product.handle+'" class="wishlist-product__image">';
                    if(product.image === null || product.image ===  undefined) {
                        productListingHTML += '<div style="background: #f5f5f5; width: 100%; height: 100%; display: block;"></div>';
                    } else {
                        productListingHTML += '<img data-hulkQuickViewEle src="'+product.image+'" alt="'+product.title+'" class="img-list">';
                    }
                    productListingHTML += '</a>';

                    if(product.in_stock == true){
                        productListingHTML += '<input type="checkbox" name="hulk_wl_item" value="'+product.id+'" data-prod-id="'+product.product_id+'" data-var-id="'+product.variant_id+'" class="hulk_wl_item_select" hulk-select-products>';
                    } else {
                        productListingHTML += '<input type="checkbox" name="hulk_wl_item" value="'+product.id+'" data-prod-id="'+product.product_id+'" data-var-id="'+product.variant_id+'" class="hulk_wl_item_select hulk_out_of_stock" hulk-select-products>';
                    }

                    productListingHTML += '<p class="item__delete grid__view"><a href="#" data-HulkDeleteProduct class="icon-wishlist-remove hulkThemeColor"></a></p> </div>';
                    productListingHTML += '<div class="wishlist__product-content">';
                    if(product.vendor != undefined && product.vendor != null && product.vendor.length > 0){
                        productListingHTML += '<p class="vendor">'+product.vendor+'</p>';
                    }
                    productListingHTML += '<p class="product__title">'+product.title+'</p><p class="price"><span class="money conversion-bear-money">'+product.price+'</span></p>';
                    if(product.variant_options != 'Default Title') {
                        productListingHTML += '<p class="varient">'+product.variant_options+'</p>';
                    }
                    else {
                        productListingHTML += '<p class="varient" style="display: block;"></p>';
                    }
                    productListingHTML += '</div>';
                    productListingHTML += '<div class="wishlist-status">';
                    if(product.in_stock == true){
                        productListingHTML += '<button class="wishlist-btn hulkBtnStyle" data-addProToCart style="background-color: '+WishlistSettings.style.theme_color+'; border: 1px solid '+WishlistSettings.style.theme_color+'; color: white">'+WishlistSettings.language.button.move_to_cart+'</button>';
                    }else{
                        productListingHTML += '<button class="wishlist-btn" disabled>'+WishlistSettings.language.button.out_of_stock+'</button>';
                    }
                    productListingHTML += '<p class="added_date grid__view">' + WishlistSettings.language.date_label + ' ' + product.added_on+'</p></div>';
                    productListingHTML += '</div></div>';
                });
                if(finalResponse.total > 0){
                    hulkSelectAll.style.display  = 'inline-block';
                    hulkWishlistEmptyContainer.style.display  = 'none';
                    document.querySelector('[data-addProductBtn]').style.display = 'none';
                    document.querySelector('[data-viewMore]').style.display = 'inline-block';
                    //document.querySelector('[data-viewMore]').style.marginRight = '15px';
                }
                else{
                    hulkSelectAll.style.display  = 'none';
                    hulkWishlistEmptyContainer.style.display  = 'block';
                    document.querySelector('[data-addProductBtn]').style.display = 'inline-block';
                    //document.querySelector('[data-addProductBtn]').style.marginRight = '15px';
                    document.querySelector('[data-viewMore]').style.display = 'none';
                }

                document.querySelectorAll('[data-hulkMyWishlistItems]')[0].innerHTML = productListingHTML;
                if (window.conversionBearAutoCurrencyConverter) window.conversionBearAutoCurrencyConverter.convertPricesOnPage();
                HulkappWishlist._removeBulkActions();
                outStockProductsCount = document.querySelectorAll('.hulk_out_of_stock').length;

            }else{
                let msg = 'Something went wrong. Please try again later !';
                if(finalResponse.message){ msg = finalResponse.message; }
                HulkappWishlist._messageUpdate(msg);
            }
        });
    },

    /*********************************    To get App settings for frontend Population    ********************************/
    _getShopSettings: function(){
        wishlistsData = sessionStorage.getItem('wishlistsData') || [];
        // var settingsData = sessionStorage.getItem('hulkapps_wishlist_settings');//removed bcz create issue for collection page wishlist added 2 times
        // if(settingsData) {
        //     HulkappWishlist.(settingsData);
        // }

        HulkappWishlist._allocateStyles(WishlistSettings);

        let ShopURL = window.hulkappsWishlist.baseURL + '/shop/settings?shop='+hulkShopDomain;
        HulkappWishlist._XMLHttpRequest('GET', ShopURL, '', function(status, response){
            /*if(status == 200){
                // sessionStorage.setItem('hulkapps_wishlist_settings', response);
                //HulkappWishlist._allocateStyles(response);
            }
            else{
                allHulkWishlistButtons.forEach(function(ele){
                    ele.remove();
                });
                document.querySelectorAll('[data-hulksaveforlater]').forEach(function(ele){
                    ele.remove();
                });
                return;
            }*/
            if(status != 200){
                allHulkWishlistButtons.forEach(function(ele){
                    ele.remove();
                });
                document.querySelectorAll('[data-hulksaveforlater]').forEach(function(ele){
                    ele.remove();
                });
                return;
            }
        });

        // To move The Guest WishlistData from Local Storage to Server
        guestWishlistData = localStorage.getItem('HulkApps-wishlist-guestData') || null;
        if(guestWishlistData && guestWishlistData != null && guestWishlistData != undefined){
            guestWishlistData = JSON.parse(guestWishlistData);
            if(customerStatus != 'Customer' && guestWishlistData.length > 0){
                HulkappWishlist._addFromGuestTodata(guestWishlistData);
            }
        }
    },

    _setHeaderIcon: function() {
        let headerIconSelector = (WishlistSettings.style.header_icon_selector) ? WishlistSettings.style.header_icon_selector : "a[href='cart']";
        let cartElement = document.querySelector(headerIconSelector);
        if (cartElement) {
            let HeaderIcon = '<div class="hulk-wishlist-icon"><a href="'+proxyURL+'" class="hulk-header-icon">' +
                '<i class="icon-wishlist-heart-empty" style="vertical-align: sub;"></i>'
            if (WishlistSettings.general.wishlist_header_count == 'show') {
                HeaderIcon += '<span class="header-count count" data-totalwishlistitems>0</span>'
            }
            HeaderIcon += '</a></div>';

            cartElement.insertAdjacentHTML("beforebegin", HeaderIcon);
        }
        wishlistTotal = document.querySelector('[data-totalwishlistitems]');
        HulkappWishlist._updateWishlistTotal();
    },

    //Solution for loading styles
    _allocateStyles: function(response) {
        wishlistsData = sessionStorage.getItem('wishlistsData') || [];
        WishlistSettings = response;
        appStatus = WishlistSettings.general.frontend_enabled;

        if(appStatus == false){
            allHulkWishlistButtons.forEach(function(ele){
                ele.remove();
            });
            document.querySelectorAll('[data-hulksaveforlater]').forEach(function(ele){
                ele.remove();
            });
            return;
        }

        let globalStyle = WishlistSettings.general.css_style;
        if(WishlistSettings.general && globalStyle && globalStyle != ''){
            var hulkGlobalStyle = document.createElement('style');
            hulkGlobalStyle.type = 'text/css';
            hulkGlobalStyle.id = 'hulk--global-stylesheet';
            if (hulkGlobalStyle.styleSheet){
                hulkGlobalStyle.styleSheet.cssText = globalStyle;
            }
            else{
                hulkGlobalStyle.appendChild(document.createTextNode(globalStyle));
            }
            document.getElementsByTagName("head")[0].appendChild(hulkGlobalStyle);
        }

        let headerIcon = document.getElementsByClassName('hulk-header-icon')[0];
        if(headerIcon !== undefined && headerIcon !== null) {
            let iconElem = headerIcon.firstElementChild;
            iconElem.style.color =  (WishlistSettings.style.header_icon_color) ? WishlistSettings.style.header_icon_color : '#000';
            iconElem.style.fontSize =  (WishlistSettings.style.header_icon_size) ? WishlistSettings.style.header_icon_size + 'px' : '16px';
            iconElem.style.fontWeight = (WishlistSettings.style.header_icon_weight) ? WishlistSettings.style.header_icon_weight : 500;
        }
        let headerCountEle = document.getElementsByClassName('header-count')[0];
        if(headerCountEle !== undefined && headerCountEle !== null) {
            headerCountEle.style.backgroundColor = (WishlistSettings.general.header_count_background_color) ? WishlistSettings.general.header_count_background_color : WishlistSettings.style.theme_color;
            headerCountEle.style.color = (WishlistSettings.general.header_count_color) ? WishlistSettings.general.header_count_color : '#fff';
        }

        if(window.hulkappsWishlist.hasAppBlockSupport === '1') {
            var myEm = document.querySelector('.wishlist-btn');
            myEm.classList.add('hulkapps-wishlist-btn-enabled');
            if(WishlistSettings.style.button_icon_type === 'custom_icon') {
                var animationElm = document.querySelector('.heart-hulk-animation');
                if(animationElm) {
                    var customIconElm = document.createElement('div');
                    customIconElm.classList.add('wishlist_btn_icon');
                    customIconElm.classList.add('hulk_wl_icon');
                    customIconElm.style.display = 'initial';
                    customIconElm.innerHTML = '<img data-v-4e6b1d8c="" src="'+WishlistSettings.style.empty_set_custom_icon+'" class="hulk-wishlist-custom-icon" width="18px" height="18px" style="line-height: 1;cursor: pointer;margin-right: 5px;user-select: none;vertical-align: middle;margin-top: -2px;">';
                    animationElm.parentNode.replaceChild(customIconElm, animationElm);
                }
            }
        }

        if(WishlistSettings && WishlistSettings.style.button_style === 'style_1' && window.hulkappsWishlist.hasAppBlockSupport !== '1'){
            WishlistSettings.language.button_text = '';
            WishlistSettings.language.success_button_text = '';
        }

        if(WishlistSettings && WishlistSettings.style.position != 'custom' && window.hulkappsWishlist.hasAppBlockSupport !== '1'){
            HulkappWishlist._addWishlistButton();
        }
        if(WishlistSettings && WishlistSettings.style.position == 'custom' && window.hulkappsWishlist.hasAppBlockSupport !== '1'){
            HulkappWishlist._manageWishlistBtnSettings();
        }

        HulkappWishlist._updateWishlistButton();

        if(customerStatus == 'Customer' && WishlistSettings.general.is_guest_enabled == true && hulkUserUUID != null){
            //HulkappWishlist._addToWishlistFromGuestList();
        }

        const hulkWishlistSaveButton =  document.querySelectorAll('[data-hulkSaveForLater]');
        if (typeof(hulkWishlistSaveButton) != 'undefined' && hulkWishlistSaveButton != null && hulkWishlistSaveButton.length > 0){
            hulkWishlistSaveButton.forEach(function(button){
                button.innerHTML = WishlistSettings.language.button.save_for_later;
            });
            HulkappWishlist._saveForLater();
        }

        const hulkWishlistListing =  allHulkWishlistButtons[0];
        if (typeof(hulkWishlistListing) != 'undefined' && hulkWishlistListing != null){
            allHulkWishlistButtons.forEach(function(ele){
                if(window.hulkappsWishlist.hasAppBlockSupport !== '1' && WishlistSettings.style.button_style != 1) {
                    ele.querySelector('span').innerHTML = WishlistSettings.language.button_text;
                }
            });
            HulkappWishlist._checkForProductStatus(allHulkWishlistButtons, 'multiple');
        }else{
            HulkappWishlist._updateWishlistTotal();
        }

        if(customerID != '' && customerID != null && customerID != undefined){
            if(!wishlistsData || wishlistsData === undefined || wishlistsData === 'undefined' || wishlistsData === null || wishlistsData === 'null') {
                wishlistsData = [];
            }else if(wishlistsData.length > 0){
                wishlistsData = JSON.parse(wishlistsData);
            }
            HulkappWishlist._getUserWishlist();
            HulkappWishlist._updateuserWishlists();
        }

        HulkappWishlist._manageWishlistButtonAction();
        HulkappWishlist._someBaseFunction();
        HulkappWishlist._createNewWishlist();
        HulkappWishlist._updateButtonStateonVariantChange();
        HulkappWishlist._updateWishlistText();
    },

    /*********************************    Functions Used in Guest Wishlist Logic     ********************************/
    _addFromGuestTodata: function(guestWishlistData){
        let guestProductIds = '';
        guestWishlistData.forEach(function(item){
            if(guestProductIds.indexOf(item.productID) < 0){
                if(guestProductIds == ''){ guestProductIds += item.productID } else { guestProductIds += ',' + item.productID; }
            }
        });
        if(guestProductIds.length > 0){
            let shopURL = window.hulkappsWishlist.baseURL + '/wishlist/products/move_guest_wishlist?shop='+hulkShopDomain+'&product_ids='+guestProductIds;
            HulkappWishlist._XMLHttpRequest('GET', shopURL, '', function(status, response){
                let finalResponse = JSON.parse(response);
                if( status == 200){
                    if(finalResponse.data && finalResponse.data.wishlist_uuid){
                        hulkUserUUID = finalResponse.data.wishlist_uuid;
                        HulkappWishlist._setCookie('hulk_wishlist_UserUUID', finalResponse.data.wishlist_uuid, 15);
                        HulkappWishlist._checkForProductStatus(allHulkWishlistButtons, 'multiple');
                        guestWishlistData = [];
                        localStorage.removeItem('HulkApps-wishlist-guestData');
                    }
                }else if(status < 300){
                    let msg = 'Something went wrong. Please try again later !';
                    if(finalResponse.message){ msg = finalResponse.message; }
                }else{
                    let msg = 'Something went wrong. Please try again later !';
                }
            })
        }
    },

    _updateProductForGuest: function(currentTarget, proId, varId, action){
        let data = {
            shop: hulkShopDomain,
            product_id: parseInt(proId),
            variant_id: parseInt(varId),
            uuid: hulkUserUUID,
            type: 'web'
        };

        let requestURL = window.hulkappsWishlist.baseURL + '/wishlist/add_product/guest';
        if(action == 'remove'){
            data = {
                shop: hulkShopDomain,
                product_ids: [parseInt(proId)],
                variant_ids: [parseInt(varId)],
                uuid: hulkUserUUID,
                type: 'web'
            };
            requestURL = window.hulkappsWishlist.baseURL + '/wishlist/delete_product/guest';
        }

        HulkappWishlist._XMLHttpRequest('POST', requestURL, data, function(status, response){
            let finalResponse = JSON.parse(response);
            if(status == 200){
                let is_latest_notification = finalResponse.isLatestNotification || false;
                if(action == 'remove'){
                    let msg = WishlistSettings.language.success_message.for_item_removed;
                    if (is_latest_notification) msg = finalResponse.message;
                    HulkappWishlist._buttonUpdate('remove', currentTarget, msg, finalResponse.title, finalResponse.image, is_latest_notification);
                }else{
                    if(hulkUserUUID == null && finalResponse.data && finalResponse.data.uuid){
                        HulkappWishlist._setCookie('hulk_wishlist_UserUUID', finalResponse.data.uuid, 15);
                    }
                    let msg = WishlistSettings.language.success_message.without_login;
                    is_latest_notification = finalResponse.data.isLatestNotification || false;
                    if (is_latest_notification) msg = finalResponse.message;
                    HulkappWishlist._buttonUpdate('added', currentTarget, msg, finalResponse.data.title, finalResponse.data.image, is_latest_notification);
                }
                HulkappWishlist._checkForProductStatus(allHulkWishlistButtons, 'multiple');
            }else{
                let msg = 'Something went wrong. Please try again later';
                if(finalResponse.message){ msg = finalResponse.message; }
                HulkappWishlist._messageUpdate(msg);
            }
        });
    },

    _addToWishlistFromGuestList: function(){
        if(hulkUserUUID == null || hulkUserUUID.length <= 0){
            return;
        }

        let shopURL = window.hulkappsWishlist.baseURL + '/wishlist/sync_products';
        let data = {
            shop: hulkShopDomain,
            customer_id: customerID,
            uuid: hulkUserUUID,
        }
        HulkappWishlist._XMLHttpRequest('POST', shopURL, data, function(status, response){
            if(status == 200){
                hulkUserUUID = null;
                HulkappWishlist._setCookie('hulk_wishlist_UserUUID', null, -10);
                HulkappWishlist._checkForProductStatus(allHulkWishlistButtons, 'multiple');
            }else{
                let errorMessage = JSON.parse(response);
                let msg = 'Something went wrong. Please try again later !';
                if(errorMessage.message){ msg = errorMessage.message; }
                HulkappWishlist._messageUpdate(msg);
            }
        });
    },
    /*********************************    End of Functions Used in Guest Wishlist Logic    ********************************/

    _addWishlistButton: function(){
        if(window.hulkappsWishlist.productJSON == null || window.hulkappsWishlist.productJSON == undefined){
            return false;
        }
        let selectedVarId = window.hulkappsWishlist.selectedVariant;
        if(selectedVarId == undefined || selectedVarId == null){
            selectedVarId = window.hulkappsWishlist.productJSON.variants[0].id;
        }

        if(WishlistSettings.general.product_page_tooltip && WishlistSettings.general.public_wishlist_count === 'show') {
            var wishlistBtn = document.querySelector('.wishlist-btn');
            let tooltipTitle = WishlistSettings.general.tooltip_message + ' 0 ' + WishlistSettings.general.tooltip_time_message;
            wishlistBtn.setAttribute('title', tooltipTitle);
        }

        let hulkWishlistButton = '<a href="#" class="icon-wishlist-heart-empty wishlist-btn heart-wishlist-animation'+ wishlistBtnStyle +'" data-wishlist data-added="false" data-proid="'+window.hulkappsWishlist.productJSON.id+'" data-varid="'+selectedVarId+'" data-button-layout="'+buttonLayout+'" >';
        hulkWishlistButton += '<div class="hulk_wl_icon-text" style="'+btnExtraStyle+'" hulk-wl-custom-style data-count="'+WishlistSettings.general.public_wishlist_count+'">';
        if(WishlistSettings.style.button_icon_type === 'custom_icon') {
            hulkWishlistButton += '<div style="display: initial;" class="wishlist_btn_icon hulk_wl_icon" data><img data-v-4e6b1d8c="" src="'+WishlistSettings.style.empty_set_custom_icon+'" class="hulk-wishlist-custom-icon" width="18px" height="18px" style="line-height: 1;cursor: pointer;margin-right: 5px;user-select: none;vertical-align: middle;margin-top: -2px;"></div>';
            hulkWishlistButton += '<span class="hulk-wishlist-btn-title">'+WishlistSettings.language.button_text+'</span>';
        } else {
            hulkWishlistButton += '<div class="hulk_wl_icon" style="'+emptyIconStyle+'">';

            if(isCustomizeProductIcon && iconBackgroundType !== 'icon_no_background') {
                hulkWishlistButton += '<i class="heart-hulk-animation product-icon" style="padding: ' + WishlistSettings.style.button_top_bottom_vertical_space + 'px 8px;">';
            } else {
                hulkWishlistButton += '<i class="heart-hulk-animation product-icon" style="padding-right: 8px;">';
            }
            hulkWishlistButton += '<i class="icon-wishlist-heart-empty"></i></i></div>';

            hulkWishlistButton += '<span>'+WishlistSettings.language.button_text+'</span>';
        }
        hulkWishlistButton += '</div>';
        if(WishlistSettings.general.public_wishlist_count === 'show'){
            hulkWishlistButton += '</span><span class="count" style="'+countExtraStyle+'" hulk-wl-custom-style>';
            if(buttonLayout === 'multi_color_button' && (WishlistSettings.style.button_style === 'style_2' || WishlistSettings.style.button_style === 'style_4')) {
                hulkWishlistButton += '0';
            } else {
                hulkWishlistButton += '(0)';
            }
            hulkWishlistButton += '</span>';
        }
        hulkWishlistButton += '</a>';
        const buttonSelectors = ["[action*='/cart/add'] [name='add']", "[action*='/cart/add'] [type='submit']", "[action*='/cart/add'] [type='button']", "#add-to-cart", "#AddToCartText", "#AddToCart"];
        let finalSelector, finalForm;
        let found_selector = false;
        buttonSelectors.forEach(function(selector) {
            if(found_selector == false){
                if(document.querySelectorAll(selector)[0] != null && document.querySelectorAll(selector)[0] != undefined){
                    found_selector = true;
                    finalSelector = document.querySelectorAll(selector)[0];
                    finalForm = finalSelector.closest('form');
                }
            }
        });
        document.querySelectorAll('[data-wishlist]').forEach(function(ele){
            if(ele.hasAttribute('data-gridHulkList') == false){
                ele.remove();
            }
        });
        if(finalForm != undefined && finalForm != null && finalForm.querySelector('[data-wishlist]') != undefined && finalForm.querySelector('[data-wishlist]') != null){
            finalForm.querySelector('[data-wishlist]').remove();
        }
        if(finalSelector != undefined && finalSelector != null){
            finalSelector.insertAdjacentHTML('afterend', hulkWishlistButton);
        }

        HulkappWishlist._manageWishlistBtnSettings();

        HulkappWishlist._updateWishlistButton();
        allHulkWishlistButtons = Array.from(document.querySelectorAll('[data-wishlist]'));
        HulkappWishlist._checkForProductStatus(allHulkWishlistButtons, 'multiple');
        HulkappWishlist._updateWishlistText();
    },

    _updateWishlistButton: function(){
        const btnSettings = WishlistSettings.style;
        wishlistBtnStyle = btnSettings.button_style;
        let btnStyle, regularBtns, regularDenyBtns;
        regularBtns = 'background-color: '+WishlistSettings.style.theme_color+'; border: 1px solid '+WishlistSettings.style.theme_color+'; color: white;';
        regularDenyBtns = 'background-color: white;border: 1px solid '+WishlistSettings.style.theme_color+'; color:'+WishlistSettings.style.theme_color;

        if(WishlistSettings && WishlistSettings.style.button_style == 'style_1' || WishlistSettings.style.button_style == 'style_3' || WishlistSettings.style.button_style == 'style_5'){
            btnStyle = 'color: '+WishlistSettings.style.theme_color+';';
        }else{
            btnStyle = 'border-radius: '+btnSettings.button_border_radius+'px; font-size: '+btnSettings.button_font_size+'px; font-weight: '+btnSettings.button_font_weight+';';
        }

        //if(window.hulkappsWishlist.hasAppBlockSupport !== '1'){
        const wishlistBtn = document.querySelectorAll('[data-wishlist]');
        for (var i = 0; i < wishlistBtn.length; i++) {
            if (wishlistBtn[i].hasAttribute('data-gridhulklist') == true) {
                let countEle = wishlistBtn[i].querySelector('.count');
                if(countEle != undefined || countEle != null) {
                    if(WishlistSettings.style.custom_wishlist_icon) {
                        countEle.setAttribute('data-layout', collectionCountLayout);
                    } else {
                        countEle.setAttribute('data-layout', 'beside_count');
                    }
                    if(collectionCountLayout === 'top_count') {
                        countEle.style.backgroundColor = (WishlistSettings.style.collection_count_background_color) ? WishlistSettings.style.collection_count_background_color : WishlistSettings.style.theme_color;
                        countEle.style.color = (WishlistSettings.style.collection_count_color) ? WishlistSettings.style.collection_count_color : '#fff';
                        if(collectionIconSize > 20) {
                            countEle.style.right = '-0.3rem';
                            countEle.style.bottom = '1.5rem';
                            countEle.style.width = '1.8em';
                            countEle.style.height = '1.8em';
                        }
                    }
                }
                let btn = wishlistBtn[i];

                if(WishlistSettings.general.collection_wishlist_count === 'show'){
                    wishlistBtn[i].querySelector('.count').classList.add('hulkapps-collection-count');
                }
                if(wishlistBtn[i].querySelector('.heart-hulk-animation') != undefined) {
                    let collectionIcon = wishlistBtn[i].querySelector('.heart-hulk-animation');
                    collectionIcon.classList.add('collection-icon');

                    if(isCustomizeCollectionIcon) {
                        collectionIcon.setAttribute('data-icon', collectionIconType);

                        wishlistBtn[i].addEventListener('mouseover', function (event) {
                            collectionIcon.style.color = collectionIconHoverColor;
                        });

                        wishlistBtn[i].addEventListener('mouseout', function (event) {
                            collectionIcon.style.color = (btn.getAttribute('data-added') == 'true') ?  selectedCollectionIconFillColor : collectionIconFillColor;
                        });
                    }
                }

                if(WishlistSettings.style.button_icon_type === 'custom_icon') {
                    wishlistBtn[i].getElementsByClassName('wishlist_btn_icon')[0].innerHTML = '<img src="'+WishlistSettings.style.empty_set_custom_icon+'" class="hulk-wishlist-custom-icon" width="18px" height="18px" style="line-height: 1;cursor: pointer;margin-right: 5px;user-select: none;vertical-align: middle;margin-top: -2px;">';
                }
                wishlistBtn[i].classList.add('style_1');
                wishlistBtn[i].setAttribute("style", 'color: ' + WishlistSettings.style.theme_color + ';display: inline-block !important;');

                if(WishlistSettings.style.custom_wishlist_icon) {
                    wishlistBtn[i].setAttribute("data-custom-wishlist-icon", true);
                    wishlistBtn[i].style.right = '10px';
                    wishlistBtn[i].style.left = 'unset';
                    if (!WishlistSettings.style.custom_wishlist_icon_right || WishlistSettings.style.custom_wishlist_icon_right == 'false') {
                        wishlistBtn[i].style.right = 'unset';
                        wishlistBtn[i].style.left = '10px';
                    }
                }
            } else {
                if(WishlistSettings.general.public_wishlist_count === 'show'){
                    wishlistBtn[i].querySelector('.count').classList.add('hulkapps-public-count');
                }
                if(window.hulkappsWishlist.hasAppBlockSupport !== '1') {
                    wishlistBtn[i].classList.add(btnSettings.button_style);
                    wishlistBtn[i].setAttribute("style", btnStyle);
                }
            }
        }

        document.querySelectorAll('.hulkThemeColor').forEach(function (ele) {
            ele.setAttribute('style', 'color: ' + WishlistSettings.style.theme_color);
        });
        document.querySelectorAll('.hulkBtnStyle').forEach(function (ele) {
            ele.setAttribute('style', regularBtns);
        });
        document.querySelectorAll('[data-closewishlistpopup].hulkBtnStyle ').forEach(function (ele) {
            ele.setAttribute('style', regularDenyBtns);
        });
        document.querySelectorAll('[data-closewishlistitemspopup].hulkBtnStyle ').forEach(function (ele) {
            ele.setAttribute('style', regularDenyBtns);
        });
        document.querySelectorAll('[data-closemywishlistpopup].hulkBtnStyle ').forEach(function (ele) {
            ele.setAttribute('style', regularDenyBtns);
        });
        document.querySelectorAll('[data-hulkappsmoveitemscancel].hulkBtnStyle ').forEach(function (ele) {
            ele.setAttribute('style', regularDenyBtns);
        });
        let additionalBtnStyles = document.createElement("style");
        additionalBtnStyles.innerHTML = ".wishlist-btn.style_1 [hulk-wl-custom-style], .wishlist-btn.style_3 [hulk-wl-custom-style], .wishlist-btn.style_5 [hulk-wl-custom-style]{ color: " + WishlistSettings.style.theme_color + "; }\n";
        additionalBtnStyles.innerHTML += ".wishlist-btn.style_2:not([data-gridhulklist]) [hulk-wl-custom-style], .wishlist-btn.style_4:not([data-gridhulklist]) [hulk-wl-custom-style]{ background-color: " + WishlistSettings.style.button_background_color + "; color: " + btnSettings.button_text_color + "; border: " + btnSettings.button_border + "px solid " + btnSettings.button_border_color + "; }\n";
        document.body.appendChild(additionalBtnStyles);
        //}
    },

    /*********************************    Functions for Managing User's Wishlists    ********************************/
    _getUserWishlist: function(){
        if(customerID != null && customerID != undefined && customerID != ''){
            const ShopURL = window.hulkappsWishlist.baseURL + '/wishlist/lists?customer_id='+customerID+'&shop='+hulkShopDomain;
            HulkappWishlist._XMLHttpRequest('GET', ShopURL, '', function(status, response){
                let finalResponse = JSON.parse(response);
                if(status == 200){
                    wishlistsData = finalResponse;
                    sessionStorage.setItem('wishlistsData', JSON.stringify(finalResponse));
                    let myWishlist = false;
                    wishlistsData.forEach(function(element){
                        let defaultElement = element.is_default;
                        if(defaultElement == true){
                            try {
                                DefaultWishlistID.push(element.id);
                                return;
                            } catch (e) {
                                DefaultWishlistID = element.id;
                                myWishlist = true;
                                return;
                            }
                        }
                    });
                    /*if(myWishlist) {
                        sessionStorage.setItem('wishlistsData', JSON.stringify(response));
                        HulkappWishlist._updateWishlistHTML(finalResponse);
                    }*/
                    HulkappWishlist._updateuserWishlists();
                }else{
                    let msg = 'Something went wrong. Please try again later !';
                    if(finalResponse.message){ msg = finalResponse.message; }
                    HulkappWishlist._messageUpdate(msg);
                }
            });
        }
    },

    /*_updateWishlistHTML: function(wishlistsData){
        let sidebarHTML = '';
        let selectedWishlistFound = false;
        let triggerDefault = false;

        if(!wishlistsData){
            return;
        }
        wishlistsData.forEach(function(wishlist){
            if(wishlist.is_default == true && WishlistSettings.general.has_multiple_wishlist == false){
                let isCustomTitle = (WishlistSettings.general.is_my_wishlist_custom_title) ? WishlistSettings.general.is_my_wishlist_custom_title : false;
                let customTitle = (WishlistSettings.general.my_wishlist_custom_title) ? WishlistSettings.general.my_wishlist_custom_title : 'Your Wishlist';
                if(isCustomTitle) {
                    document.querySelectorAll('[data-wishlistTitle]')[0].innerHTML = customTitle;
                    document.querySelectorAll('[data-sidebarWidgetwishlisttitle]')[0].innerHTML = customTitle;
                } else {
                    document.querySelectorAll('[data-wishlistTitle]')[0].innerHTML = wishlist.name;
                    document.querySelectorAll('[data-sidebarWidgetwishlisttitle]')[0].innerHTML = wishlist.name;
                }

                document.querySelectorAll('[data-forMultipleDisabled]')[0].style.display = 'block';
                if(document.querySelectorAll('[data-forMultipleDisabled]')[0].querySelector('[data-HulkShareWishList]')){
                    document.querySelectorAll('[data-forMultipleDisabled]')[0].querySelector('[data-HulkShareWishList]').setAttribute('data-uniqId', wishlist.unique_identifier);
                }
                if(document.querySelectorAll('[data-forMultipleDisabled]')[0].querySelector('[data-HulkSubscribetoList]')){
                    document.querySelectorAll('[data-forMultipleDisabled]')[0].querySelector('[data-HulkSubscribetoList]').setAttribute('data-id', wishlist.id);
                    document.querySelectorAll('[data-forMultipleDisabled]')[0].querySelector('[data-HulkSubscribetoList]').setAttribute('data-email', wishlist.subscribed_email);
                    if(wishlist.is_subscribed == true){
                        document.querySelectorAll('[data-forMultipleDisabled]')[0].querySelector('[data-HulkSubscribetoList]').innerHTML = WishlistSettings.language.action_button.subscribed;
                    }
                }
            }
            if(wishlist.id == parseInt(SelectedWishlistID)){
                selectedWishlistFound = true;
                sidebarHTML += '<li class="sidebar_item active" data-id="'+wishlist.id+'" data-email="'+wishlist.subscribed_email+'" data-subscribed="'+wishlist.subscribed_email+'" data-uniqId="'+wishlist.unique_identifier+'" data-userHulkwishlist>';
            }else{
                sidebarHTML += '<li class="sidebar_item" data-id="'+wishlist.id+'" data-email="'+wishlist.subscribed_email+'" data-uniqId="'+wishlist.unique_identifier+'" data-userHulkwishlist>';
            }
            sidebarHTML += '<div class="sidebar_content"><a href="#" class="h6 Wishlist_cat_title" data-HulkwishlistView>'+wishlist.name+' <span>('+wishlist.total_products+')</span></a><p class="share_sbcrb">';
            if(WishlistSettings.general.can_share_wishlist && wishlist.can_share_wishlist == 1){ sidebarHTML += '<a href="#" data-HulkShareWishList>'+WishlistSettings.language.action_button.share+'</a>'; }
            if(WishlistSettings.general.can_subscribe_wishlist == true && wishlist.is_subscribed == true) {
                sidebarHTML += '<a href="#" data-HulkSubscribetoList> '+WishlistSettings.language.action_button.subscribed+'</a></p></div>';
            }else if(WishlistSettings.general.can_subscribe_wishlist == true ){
                sidebarHTML += '<a href="#" data-HulkSubscribetoList> '+WishlistSettings.language.action_button.subscribe+'</a></p></div>';
            }
            sidebarHTML += '</p>';
            if(wishlist.is_default == false) {
                sidebarHTML += '</div><div class="content_remove" data-confirmDeleteWishlist><a href="#" class="icon-wishlist-bin hulkThemeColor delete-wishlist"></a></div>';
            }
            sidebarHTML += '</li>';
        });
        const hulkWishlistListing =  document.querySelectorAll('[data-HulkWishlistListing]')[0];
        if(SelectedWishlistID == ''){
            SelectedWishlistID = DefaultWishlistID;
        }

        if (typeof(hulkWishlistListing) != 'undefined' && hulkWishlistListing != null)
        {
            document.querySelectorAll('[data-HulkWishlistListing]')[0].innerHTML = sidebarHTML;
        }
    },*/

    _createNewWishlist: function(){
        document.querySelectorAll("[data-saveNewWishlist]")[0].onclick = function(event){
            event.preventDefault();
            const $targetElement = event.target;
            let newWishlistName = document.querySelectorAll('[data-addNewWishlist]')[0].querySelector('[data-newWishlist]').value;
            newWishlistName = newWishlistName.trim();
            if(newWishlistName.length > 0){
                const data = {
                    customer_id: customerID,
                    shop: hulkShopDomain,
                    name: newWishlistName,
                };
                let request = new XMLHttpRequest();
                request.open('POST', window.hulkappsWishlist.baseURL + '/wishlist/create', true);
                request.setRequestHeader('Content-type', 'application/json');
                request.send(JSON.stringify(data)); // Make sure to stringify
                request.onload = function() {
                    if(request.status == 200){
                        let response = JSON.parse(this.response);
                        HulkappWishlist._getUserWishlist();
                        setTimeout(function(){
                            document.querySelectorAll('[data-newwishlist]')[0].value = '';
                            HulkappWishlist._updateuserWishlists();
                            HulkappWishlist._updateWishlistSelection(wishlistButtonTarget.getAttribute('data-proid'), wishlistButtonTarget.getAttribute('data-varid'));
                        }, 500);
                        let msg = 'Wishlist Created!';
                        if(response.message){ msg = response.message; }
                        HulkappWishlist._messageUpdate(msg);
                    }else{
                        let response = JSON.parse(this.response);
                        let msg = 'Something went wrong. Please try again later !';
                        if(response.message){ msg = response.message; }
                        HulkappWishlist._messageUpdate(msg);
                    }
                }
            }else{
                document.querySelectorAll('[data-addNewWishlist]')[0].querySelectorAll('[data-newWishlist]')[0].classList.add('error');
            }
        };
    },

    _updateuserWishlists: function(){
        if(!wishlistsData || wishlistsData == null || wishlistsData == undefined){
            return;
        }

        let wishlistHTML = '';
        if(typeof(wishlistsData) === "string"){wishlistsData = JSON.parse(wishlistsData)}
        wishlistsData.forEach(function(element){
            wishlistHTML += ' <li data-id="'+element.id+'" data-userhulkwishlist>';
            wishlistHTML += '<div class="input-group my-wishlist-input-group"><input type="checkbox" data-wishlistItem value="'+element.id+'" id="wishlist-'+element.id+'"><label for="wishlist-'+element.id+'" class="wishlist-checkbox"><span></span>'+element.name+'</label>';
            if(element.is_default == false) {
                wishlistHTML += '<div class="content_remove" data-confirmDeleteWishlist="" style="float: right;"><a href="#" class="icon-wishlist-bin hulkThemeColor delete-wishlist"></a></div>';
            }
            wishlistHTML += '</div>';
            wishlistHTML += '</li>';
        });
        if(document.querySelectorAll('[data-userWishlists]') != null && document.querySelectorAll('[data-userWishlists]') != undefined){
            document.querySelectorAll('[data-userWishlists]')[0].innerHTML = wishlistHTML;
        }
        if(document.querySelectorAll('[data-openCreateSection]') != null && document.querySelectorAll('[data-openCreateSection]') != undefined){
            document.querySelectorAll('[data-openCreateSection]')[0].style.display  = 'block';
        }
        if(document.querySelectorAll('[data-addNewWishlist]') != null && document.querySelectorAll('[data-addNewWishlist]') != undefined){
            document.querySelectorAll('[data-addNewWishlist]')[0].style.display  = 'none';
        }
    },

    _deleteHulkWishlist: function(){
        document.addEventListener('click', function(event){
            if(event.target && event.target.hasAttribute('data-confirmDeleteWishlist') == true || event.target.classList.contains('delete-wishlist') == true ){
                event.preventDefault();
                let currentTarget = event.target;
                const wishlistID = currentTarget.closest('[data-userhulkwishlist]').getAttribute('data-id');
                globalHulkDeleteWishlistPrompt.setAttribute('data-wishlist', wishlistID)
                globalHulkDeleteWishlistPrompt.classList.add('open');
            }
        });

        document.addEventListener('click', function(event){
            if(event.target && event.target.hasAttribute('data-deletehulkwishlist') == true){
                event.preventDefault();
                let currentTarget = event.target;
                const wishlistID = currentTarget.closest('[data-hulkappsdeleteprompt]').getAttribute('data-wishlist');
                const data = {
                    customer_id: customerID,
                    shop: hulkShopDomain,
                    wishlist_id: wishlistID,
                };

                if(wishlistID == null || wishlistID == undefined){
                    globalHulkDeleteWishlistPrompt.classList.remove('open');
                    globalHulkDeleteWishlistPrompt.removeAttribute('data-wishlist');
                    let msg = 'Please select wishlist to delete.';
                    HulkappWishlist._messageUpdate(msg);
                    return;
                }

                let triggerDefault = false;
                if(globalSelectedWishlistID == wishlistID){
                    triggerDefault = true;
                }
                currentTarget.classList.add('disabled');
                HulkappWishlist._XMLHttpRequest('POST', window.hulkappsWishlist.baseURL + '/wishlist/delete', data, function(status, response){
                    let finalResponse = JSON.parse(response);
                    if(status == 200){
                        //document.querySelectorAll('[data-hulkappsDeletePrompt]')[0].style.display = 'none';
                        //hulkAddNewWishlistBtn.style.display = 'none';
                        document.querySelectorAll('[data-hulkappsDeletePrompt]')[0].classList.remove('open');
                        document.querySelectorAll('[data-hulkappsDeletePrompt]')[0].removeAttribute('data-wishlist');
                        document.querySelector('[data-newWishlist]').value = '';
                        currentTarget.classList.remove('disabled');
                        if(triggerDefault == true && document.querySelectorAll('[data-userhulkwishlist][data-id="'+DefaultWishlistID+'"]')){
                            document.querySelectorAll('[data-userhulkwishlist][data-id="'+DefaultWishlistID+'"]')[0].querySelector('[data-hulkwishlistview]').click();
                        }
                        HulkappWishlist._getUserWishlist();
                        let msg = 'Wishlist has been deleted!';
                        if(finalResponse.message){ msg = finalResponse.message; }
                        HulkappWishlist._messageUpdate(msg);
                        if(wishlistTotal){
                            HulkappWishlist._updateWishlistTotal();
                        }
                    }else{
                        let msg = 'Something went wrong. Please try again later !';
                        if(finalResponse.message){ msg = finalResponse.message; }
                        HulkappWishlist._messageUpdate(msg);
                        document.querySelectorAll('[data-data-hulkappsDeletePrompt]')[0].classList.remove('open');
                        document.querySelectorAll('[data-data-hulkappsDeletePrompt]')[0].removeAttribute('data-wishlist');
                    }
                });
            }
        });
    },

    _updateWishlistSelection: function(proID, varID){
        let currentWishlistData = [];
        wishlistProductsData.forEach(function(item){
            if(item.variant_id && item.variant_id == varID){
                currentWishlistData.push(item);
            }else if(item.product_id == proID){
                currentWishlistData.push(item);
            }
        });

        document.querySelectorAll('[data-wishlistitem]').forEach(function(element){
            element.checked = false;
        });
        currentWishlistData.forEach(function(pro){
            const wishListIDs = pro.wishlist_ids;
            if(wishListIDs.length > 0){
                wishListIDs.forEach(function(wishlistID){
                    document.querySelectorAll('[data-wishlistitem][value="'+wishlistID+'"]')[0].checked = true;
                });
            }
        });
    },
    /*********************************    End of Functions for Managing User's Wishlists    ********************************/

    _checkForProductStatus: function(wishlistBtns, btnType){
        if(typeof(wishlistBtns) == 'undefined' || wishlistBtns == null || wishlistBtns.length <=0 ){
            return false;
        }

        let productsListing = [];
        wishlistBtns.forEach(function(element, index){
            productsListing.push({
                product_id: element.getAttribute('data-proid'),
                variant_id: element.getAttribute('data-varid')
            })
        });

        let requestData = {
            shop: hulkShopDomain,
            ids: productsListing,
        };

        if(customerStatus == 'Guest'){
            requestData.uuid = hulkUserUUID;
            let shopURL = window.hulkappsWishlist.baseURL + '/wishlist/product_status/guest';
            HulkappWishlist._XMLHttpRequest('POST', shopURL, requestData, function(status, response){
                let finalResponse = JSON.parse(response);
                if(status == 200){
                    if(WishlistSettings.general.is_guest_enabled == true){
                        HulkappWishlist._updateBtnonStatusCheck(wishlistBtns, finalResponse, 'Guest');
                    }else{
                        HulkappWishlist._updateBtnonStatusCheck(wishlistBtns, finalResponse, 'Guest_Disabled');
                    }
                }else{
                    let msg = 'Something went wrong. Please try again later !';
                    if(finalResponse.message){ msg = finalResponse.message; }
                    HulkappWishlist._messageUpdate(msg);
                }
            });
        }else{
            requestData.customer_id = customerID;
            let shopURL = window.hulkappsWishlist.baseURL + '/wishlist/product_status';
            HulkappWishlist._XMLHttpRequest('POST', shopURL, requestData, function(status, response){
                let finalResponse = JSON.parse(response);
                if(status == 200){
                    wishlistProductsData = finalResponse;
                    HulkappWishlist._updateBtnonStatusCheck(wishlistBtns, finalResponse, 'Customer');
                }else{
                    let msg = 'Something went wrong. Please try again later !';
                    if(finalResponse.message){ msg = finalResponse.message; }
                    HulkappWishlist._messageUpdate(msg);
                }
            });
        }

        if(wishlistTotal && btnType != 'variantChange'){
            HulkappWishlist._updateWishlistTotal();
        }
    },

    _manageWishlistButtonAction: function(){
        document.addEventListener('click', function(event){
            if(event.target && event.target.closest('.wishlist-modal') == null) {
                if(document.querySelector('[data-hulkappswishlistpopup].open')){
                    document.querySelector('[data-closewishlistpopup]')?.click()
                }

                if(document.querySelector('[data-hulkappswishlistpopup].open')){
                    document.querySelector('[data-closewishlistpopup]')?.click()
                }

                if( event.target.closest('[data-hulkdeleteallitmes]') == null && document.querySelector('[data-hulkappsdeleteitemsprompt].open')){
                    document.querySelector('[data-closeWishlistItemsPopup]')?.click()
                }
            }
            if(event.target && event.target.hasAttribute('data-wishList') == true || event.target.closest('[data-wishList]') && event.target.closest('[data-wishList]').hasAttribute('data-wishList') == true ){
                event.preventDefault();
                let currentTarget;

                if(event.target && event.target.hasAttribute('data-wishList') != true){
                    currentTarget = event.target.closest('[data-wishList]');
                }else{
                    currentTarget = event.target;
                }

                let proID = currentTarget.getAttribute('data-proid');
                let varID = currentTarget.getAttribute('data-varid');

                if(varID == undefined || varID == null || varID.length <= 0 || proID == undefined || proID == null || proID.length <= 0 ){
                    return;
                }

                if(customerStatus == 'Guest'){
                    if(WishlistSettings.general.is_guest_enabled == true){
                        //HulkappWishlist._addToWishlist(currentTarget, proID, varID, '');
                    }else{
                        if(document.querySelectorAll('.wishlistError')[0]){
                            let currentFormMsg = document.querySelectorAll('.wishlistError')[0];
                            currentFormMsg.innerHTML = WishlistSettings.language.success_message.for_guest_login_disabled;
                            currentFormMsg.classList.add('hulkActive');
                            setTimeout(function(){
                                currentFormMsg.classList.remove('hulkActive');
                            }, 5000);
                        }
                    }
                }else{
                    if(WishlistSettings.general.has_multiple_wishlist == true){
                        HulkappWishlist._updateWishlistSelection(proID, varID);
                        document.querySelectorAll('[data-hulkappsWishlistPopup]')[0].classList.add('open');[0]
                        wishlistButtonTarget = currentTarget;
                        document.body.classList.add('hulkapps__popup__active');
                    }else{
                        //HulkappWishlist._addToWishlist(currentTarget, proID, varID, DefaultWishlistID);
                    }
                }
            }
        });

        document.querySelectorAll("[data-AddToWishlist]")[0].onclick = function(event){
            let wishlistIDs = [];
            const wishlistitems = Array.from(document.querySelectorAll('[data-wishlistitem]'));
            wishlistitems.forEach(function(element){
                if(element.checked == true){
                    wishlistIDs.push(element.value);
                }
            });

            // if(wishlistIDs.length == 0){
            //     HulkappWishlist._removeFromWishlist(wishlistButtonTarget, wishlistButtonTarget.getAttribute('data-proid'), wishlistButtonTarget.getAttribute('data-varid'), []);
            // }else{
            //     HulkappWishlist._addToWishlist(wishlistButtonTarget, wishlistButtonTarget.getAttribute('data-proid'), wishlistButtonTarget.getAttribute('data-varid'), wishlistIDs);
            // }
        };
    },

    _addToWishlist: function(currentTarget, proID, varID, wishListIDs){
        let dataAdded = currentTarget.getAttribute('data-added');
        if(dataAdded == 'true' && (WishlistSettings.general.has_multiple_wishlist == false || customerStatus == 'Guest')){
            HulkappWishlist._removeFromWishlist(currentTarget, proID, varID, wishListIDs);
        }else{
            if(customerStatus == 'Guest'){
                HulkappWishlist._updateProductForGuest(currentTarget, proID, varID, 'add');
            }else{
                //document.querySelectorAll('[data-addtowishlist]')[0].innerHTML = 'Saving...';
                document.querySelectorAll('[data-addtowishlist]')[0].disabled = true;

                let shopURL = window.hulkappsWishlist.baseURL + '/wishlist/add_product';
                const data = {
                    customer_id: customerID,
                    shop: hulkShopDomain,
                    product_id: proID,
                    variant_id: varID,
                    wishlist_ids: wishListIDs,
                    type: 'web',
                };
              
                HulkappWishlist._XMLHttpRequest('POST', shopURL, data, function(status, response){
                    let requestResponse = JSON.parse(response);
                    if(status == 200){
                        let msg = WishlistSettings.language.success_message.for_login_users;
                        let image = requestResponse.image;
                        let title = requestResponse.title;
                        let is_latest_notification = requestResponse.isLatestNotification || false;
                        if (requestResponse.message) {
                            msg = requestResponse.message;
                        }
                        HulkappWishlist._buttonUpdate('added', currentTarget, msg, title, image, is_latest_notification);
                        HulkappWishlist._checkForProductStatus(allHulkWishlistButtons, 'multiple');
                    }else{
                        let msg = 'Maximum wishlist item limit exceeded!';
                        if (requestResponse.message) {
                            msg = requestResponse.message;
                        }
                        HulkappWishlist._messageUpdate(msg);
                    }
                    //document.querySelectorAll('[data-addtowishlist]')[0].innerHTML = 'Save';
                    document.querySelectorAll('[data-addtowishlist]')[0].disabled = true;
                    document.querySelectorAll('[data-hulkappsWishlistPopup]')[0].classList.remove('open');
                    document.body.classList.remove('hulkapps__popup__active');
                });
            }
        }
    },

    _removeFromWishlist: function(currentTarget, proID, varID, wishListIDs){
        if(customerStatus == 'Guest'){
            HulkappWishlist._updateProductForGuest(currentTarget, proID, varID, 'remove');
        }else{
            const data = {
                customer_id: customerID,
                shop: hulkShopDomain,
                product_ids: [proID],
                variant_ids: [varID],
                wishlist_ids: wishListIDs,
                type: 'web'
            };
            //document.querySelectorAll('[data-addtowishlist]')[0].innerHTML = 'Saving...';
            document.querySelectorAll('[data-addtowishlist]')[0].disabled = true;

            let shopURL = window.hulkappsWishlist.baseURL + '/wishlist/delete_product';
            HulkappWishlist._XMLHttpRequest('POST', shopURL, data, function(status, response){
                let requestResponse = JSON.parse(response);
                if(status == 200){
                    let msg = 'Removed From Wishlist!';
                    let is_latest_notification = requestResponse.isLatestNotification || false;
                    if(requestResponse.message){ msg = requestResponse.message; }
                    HulkappWishlist._buttonUpdate('remove', currentTarget, msg, requestResponse.title, requestResponse.image, is_latest_notification);
                    HulkappWishlist._checkForProductStatus(allHulkWishlistButtons, 'multiple');
                }else{
                    let msg = 'Something went wrong. Please try again later !';
                    if(requestResponse.message){ msg = requestResponse.message; }
                    HulkappWishlist._messageUpdate(msg);
                }
                //document.querySelectorAll('[data-addtowishlist]')[0].innerHTML = 'Save';
                document.querySelectorAll('[data-addtowishlist]')[0].disabled = true;
                document.querySelectorAll('[data-hulkappsWishlistPopup]')[0].classList.remove('open');
                document.body.classList.remove('hulkapps__popup__active');
            });
        }
    },

    _saveForLater: function(){
        isRemoving = false;
        document.addEventListener('click', function(event){
            if(event.target && event.target.hasAttribute('data-hulksaveforlater') == true){
                event.preventDefault();
                let currentTarget = event.target;
                let proID = currentTarget.getAttribute('data-product-id');
                let varID = currentTarget.getAttribute('data-variant-id');
                let lineIndex = currentTarget.getAttribute('data-line');
                //HulkappWishlist._addToWishlist(currentTarget, proID, varID, DefaultWishlistID);
                currentTarget.setAttribute('class', 'addtoWishlist');
                currentTarget.innerHTML = WishlistSettings.language.button.save_for_later;
                setTimeout(function(){
                    const data = {
                        line: lineIndex,
                        quantity: 0,
                    };
                    fetch("/cart/change.js", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(data)
                    }).then(function(response) {
                        window.location.href = '/cart';
                    });
                }, 1500);
            }
        });
    },

    _updateWishlistTotal: function(){
        if(!wishlistTotal || wishlistTotal == null || (customerStatus == 'Guest' && WishlistSettings.general.is_guest_enabled == false)){
            return;
        }
        let shopURL = window.hulkappsWishlist.baseURL + '/wishlist/count' +'?customer_id='+customerID+'&shop='+hulkShopDomain;
        if(customerStatus == 'Guest'){
            if(hulkUserUUID == null || hulkUserUUID == undefined){
                return;
            }
            shopURL = window.hulkappsWishlist.baseURL + '/wishlist/count/guest' +'?uuid='+hulkUserUUID+'&shop='+hulkShopDomain;
        }
        HulkappWishlist._XMLHttpRequest('GET', shopURL, '', function(status, response){
            if(status == 200){
                let finalResponse = JSON.parse(response);
                let headerCountEle = document.getElementsByClassName('header-count')[0];
                let headerIconEle = document.querySelector('.hulk-header-icon .icon-wishlist-heart-empty');
                let fillHeaderIcon = WishlistSettings.style.filled_icon;
                if (fillHeaderIcon !== undefined && fillHeaderIcon && headerIconEle !== undefined && headerIconEle !== null) {
                    if(finalResponse.wishlist_count == 0) {
                        headerIconEle.dataset.fill = 'false';
                    } else {
                        headerIconEle.dataset.fill = 'true';
                    }
                }
                if(headerCountEle !== undefined && headerCountEle !== null) {
                    if(!WishlistSettings.general.display_zero_counter && finalResponse.wishlist_count == 0) {
                        headerCountEle.style.display = 'none';
                    } else {
                        headerCountEle.style.display = 'flex';
                    }
                }

                wishlistTotal.innerHTML = finalResponse.wishlist_count;
            }
        });
    },

    /*********************************    Functions Used in DOM Manupilation Logic     ********************************/
    _someBaseFunction: function(){
        if(document.querySelectorAll("[data-closeWishlistPopup]")[0]){
            document.querySelectorAll("[data-closeWishlistPopup]")[0].onclick = function(){
                document.querySelectorAll('[data-hulkappsWishlistPopup]')[0].classList.remove('open');
                document.body.classList.remove('hulkapps__popup__active');
                document.querySelectorAll('[data-openCreateSection]')[0].style.display = 'block';
                document.querySelectorAll('[data-addNewWishlist]')[0].style.display = 'none';
                document.querySelectorAll('[data-newwishlist]')[0].value = '';
                document.querySelectorAll('[data-addtowishlist]')[0].disabled = true;
            };
        }
        if(document.querySelectorAll("[data-closeWishlistPopup]")[7]){
            document.querySelectorAll("[data-closeWishlistPopup]")[7].onclick = function(){
                document.querySelectorAll('[data-hulkappsDeletePrompt]')[0].classList.remove('open');
            }
        }
        if(document.querySelectorAll("[data-openCreateSection]")[0]){
            document.querySelectorAll("[data-openCreateSection]")[0].onclick = function(event){
                event.preventDefault();
                document.querySelectorAll('[data-addNewWishlist]')[0].style.display = 'block';
                document.querySelectorAll('[data-openCreateSection]')[0].style.display = 'none';
            };
        }

        document.addEventListener('change', function(event){
            if(event.target && event.target.hasAttribute('data-wishlistitem') == true){
                document.querySelectorAll('[data-addtowishlist]')[0].disabled = false;
            }
        });
        if(document.querySelectorAll("[data-closenewwishlistinput]")[0] != null && document.querySelectorAll("[data-closenewwishlistinput]")[0] != undefined){
            document.querySelectorAll("[data-closenewwishlistinput]")[0].onclick = function(event){
                event.preventDefault();
                document.querySelectorAll('[data-addNewWishlist]')[0].style.display = 'none';
                document.querySelectorAll('[data-openCreateSection]')[0].style.display = 'block';
            };
        }
        let accountEle = document.querySelector("[data-myWishlistAccountText]");
        if(accountEle != null && accountEle != undefined && WishlistSettings.general.account_page_link) {
            accountEle.innerHTML = WishlistSettings.language.action_button.account_page || 'My wishlist';
            accountEle.style.margin = '0 20px 0 0;';
            accountEle.classList.remove("accountWishlistButton");
        }
    },

    _updateWishlistText: function(){
        document.querySelectorAll('[data-hulkWishlistHeading]')[0].innerHTML = WishlistSettings.language.heading_text;
        //document.querySelectorAll('[data-chooseWishlistText]')[0].innerHTML = WishlistSettings.language.wishlist.choose;
        document.querySelectorAll('[data-createWishlistText]')[0].innerHTML = WishlistSettings.language.wishlist.create;
        document.querySelectorAll('[data-myWishlistText]')[0].innerHTML = WishlistSettings.language.wishlist.my;
        document.querySelectorAll('[data-addtowishlist]')[0].innerHTML = typeof WishlistSettings.language.save_button_text === 'undefined' ? 'Save' : WishlistSettings.language.save_button_text;
        document.querySelectorAll('[data-savenewwishlist]')[0].innerHTML = typeof WishlistSettings.language.create_wishlist_button === 'undefined' ? 'Save' : WishlistSettings.language.create_wishlist_button;
        document.querySelectorAll('[data-newwishlist]')[0].placeholder = typeof WishlistSettings.language.wishlist.placeholder === 'undefined' ? 'Ex. Watch' : WishlistSettings.language.wishlist.placeholder;
        document.querySelectorAll('[data-HulkEmptyWishlist] span')[0].innerHTML = WishlistSettings.language.title.empty_wishlist;
        document.querySelectorAll('[data-HulkLoginMsg] span')[0].innerHTML = WishlistSettings.language.title.login;
        document.querySelector('[data-deleteHulkWishlist]').innerHTML = WishlistSettings.language.button.delete_yes;
        document.querySelector('[data-deletehulkwishlistitems]').innerHTML = WishlistSettings.language.button.delete_yes;
        document.querySelector('[data-hulkappsmoveitemsok]').innerHTML = WishlistSettings.language.button.delete_yes;
        document.querySelector('[data-hulkappsDeletePrompt] [data-closewishlistpopup]:not(.close-popup)').innerHTML = WishlistSettings.language.button.delete_no;
        document.querySelector('[data-closewishlistitemspopup]:not(.close-popup)').innerHTML = WishlistSettings.language.button.delete_no;
        document.querySelector('[data-hulkappsmoveitemscancel]:not(.close-popup)').innerHTML = WishlistSettings.language.button.delete_no;
        hulkSelectAll.querySelector('span').innerHTML = (WishlistSettings.language.title.select_all_text) ? WishlistSettings.language.title.select_all_text : 'Select All';
        hulkMoveAllItems.querySelector('a').innerHTML = (WishlistSettings.language.title.move_to_cart_text) ? WishlistSettings.language.title.move_to_cart_text : 'Move to cart';
        hulkDeleteAllItems.querySelector('a').innerHTML = (WishlistSettings.language.title.delete_text) ? WishlistSettings.language.title.delete_text : 'Delete';
        document.querySelector('[data-closemywishlistpopup]').innerHTML = (WishlistSettings.style.floating_close_button_text) ? WishlistSettings.style.floating_close_button_text : 'Close';
        document.querySelector('[data-viewmore]').innerHTML = (WishlistSettings.style.floating_explore_more_products_button_text) ? WishlistSettings.style.floating_explore_more_products_button_text : 'Explore more products';
    },

    _checkFOrInactiveStore: function(){
        const statusEle = document.querySelectorAll('[data-wishlist-wrapper]')[0];
        if(statusEle == undefined || statusEle == null){
            return;
        }
        let lastUpdateTime = statusEle.getAttribute('data-time');
        if(lastUpdateTime == undefined || lastUpdateTime == null || lastUpdateTime == ''){
            return;
        }

        lastUpdateTime = new Date(statusEle.getAttribute('data-time'));
        const today = new Date();
        const diffTime = Math.abs(today - lastUpdateTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if(diffDays >= 30){
            deactivatedStore = true;
        }
    },

    _updateButtonStateonVariantChange: function(){
        let eleSelectors =  document.querySelectorAll("[name='id'], .single-option-selector, .single-option-selector__radio, select[data-option='option1'], select[data-option='option1'], select[data-option='option2'], select[data-option='option1'], select[data-option='option3'], select[data-option='option3'], select[data-index='option1'], select[data-index='option1'], select[data-index='option2'], select[data-index='option1'], select[data-index='option3'], select[data-index='option3'], .product-single__variants, #Option-product-0, #Option-product-1, #Option-product-2");
        eleSelectors.forEach(function(ele){

            ele.addEventListener("change", function(event){
                let varSelector = event.currentTarget;
                setTimeout(function () {
                    let selectedVariantId = parseInt(HulkappWishlist._getSelectedVariant(varSelector));
                    let wishlistBtn = document.querySelector('[data-wishlist]');
                    selectedVariantId = parseInt(selectedVariantId);

                    if(selectedVariantId != undefined && selectedVariantId != null && isNaN(selectedVariantId) == false && selectedVariantId != '' && wishlistBtn){
                        allHulkWishlistButtons = Array.from(document.querySelectorAll('[data-wishlist]'));
                        wishlistBtn.setAttribute('data-varID', selectedVariantId);
                        HulkappWishlist._checkForProductStatus(allHulkWishlistButtons, 'variantChange');
                    }
                }, 1000);
            });

            if(hulkShopDomain === 'great-deal-furniture.myshopify.com' || hulkShopDomain === 'skintwo-com.myshopify.com') {
                ele.addEventListener("click", function(event){
                    let varSelector = event.currentTarget;
                    setTimeout(function () {
                        let selectedVariantId = parseInt(HulkappWishlist._getSelectedVariant(varSelector));
                        let wishlistBtn = document.querySelector('[data-wishlist]');
                        selectedVariantId = parseInt(selectedVariantId);

                        if(selectedVariantId != undefined && selectedVariantId != null && isNaN(selectedVariantId) == false && selectedVariantId != '' && wishlistBtn){
                            allHulkWishlistButtons = Array.from(document.querySelectorAll('[data-wishlist]'));
                            wishlistBtn.setAttribute('data-varID', selectedVariantId);
                            HulkappWishlist._checkForProductStatus(allHulkWishlistButtons, 'variantChange');
                        }
                    }, 1000);
                });
            }
        });
    },

    _manageWishlistBtnSettings: function() {
        var wishlistBtn = document.querySelector('[data-wishlist]');
        if (!wishlistBtn) return;
        if(wishlistBtn.querySelector('.hulk_wl_icon-text') != undefined || wishlistBtn.querySelector('.hulk_wl_icon-text') != null) {
            wishlistBtn.querySelector('.hulk_wl_icon-text').setAttribute('style', btnExtraStyle);
        }
        setTimeout(function() {
            if(wishlistBtn.querySelector('.hulkapps-public-count') != undefined || wishlistBtn.querySelector('.hulkapps-public-count') != null) {
                wishlistBtn.querySelector('.hulkapps-public-count').setAttribute('style', countExtraStyle);
            }
        }, 500)

        if(isCustomizeProductIcon && wishlistBtn.getElementsByClassName('hulk_wl_icon')[0]) {
            wishlistBtn.getElementsByClassName('hulk_wl_icon')[0].setAttribute('data-icon', iconType);
            wishlistBtn.getElementsByClassName('hulk_wl_icon')[0].setAttribute('data-icon-bg', iconBackgroundType);
            let productIconEle = wishlistBtn.getElementsByClassName('product-icon')[0];
            if (productIconEle) {
                productIconEle.addEventListener('mouseover', function (event) {
                    productIconEle.style.color = iconHoverColor;
                });
                productIconEle.addEventListener('mouseout', function (event) {
                    productIconEle.style.color = (wishlistBtn.getAttribute('data-added') === 'true') ? selectedIconFillColor : iconFillColor;
                });
            }
        }

        wishlistBtn.addEventListener('mouseover', function (event) {
            var textIconEle = document.getElementsByClassName('hulk_wl_icon-text')[0];
            var countEle = document.getElementsByClassName('hulkapps-public-count')[0];

            if (WishlistSettings.style.button_style === 'style_2' || WishlistSettings.style.button_style === 'style_4') {
                if(textIconEle != undefined && textIconEle != null) {
                    textIconEle.style.backgroundColor = WishlistSettings.style.hover_button_background_color;
                    textIconEle.style.border = WishlistSettings.style.button_border + 'px solid ' + WishlistSettings.style.hover_button_border_color;
                    if(WishlistSettings.general.public_wishlist_count === 'show') {
                        textIconEle.style.borderRight = 0;
                    }
                }

                if(countEle != undefined && countEle != null) {
                    countEle.style.backgroundColor = WishlistSettings.style.hover_button_background_color;
                    countEle.style.border = WishlistSettings.style.button_border + 'px solid ' + WishlistSettings.style.hover_button_border_color;
                    if(WishlistSettings.general.public_wishlist_count === 'show') {
                        countEle.style.borderLeft = 0;
                    }
                }
            }

            if(textIconEle != undefined && textIconEle != null) {
                textIconEle.style.color = WishlistSettings.style.hover_button_text_color;
            }
            if(countEle != undefined && countEle != null) {
                countEle.style.color = WishlistSettings.style.hover_button_text_color;
            }
        });
        wishlistBtn.addEventListener('mouseout', function (event) {
            var textIconEle = document.getElementsByClassName('hulk_wl_icon-text')[0];
            var countEle = document.getElementsByClassName('hulkapps-public-count')[0];

            if (WishlistSettings.style.button_style === 'style_2' || WishlistSettings.style.button_style === 'style_4') {
                if(textIconEle != undefined && textIconEle != null) {
                    textIconEle.style.backgroundColor = WishlistSettings.style.button_background_color;
                    textIconEle.style.border = WishlistSettings.style.button_border + 'px solid ' + WishlistSettings.style.button_border_color;
                    textIconEle.style.color = WishlistSettings.style.button_text_color;
                    if(WishlistSettings.general.public_wishlist_count === 'show') {
                        textIconEle.style.borderRight = 0;
                    }
                }
                if(countEle != undefined && countEle != null) {
                    countEle.style.backgroundColor = WishlistSettings.style.button_background_color;
                    countEle.style.border = WishlistSettings.style.button_border + 'px solid ' + WishlistSettings.style.button_border_color;
                    countEle.style.color = WishlistSettings.style.button_text_color;
                    if(WishlistSettings.general.public_wishlist_count === 'show') {
                        countEle.style.borderLeft = 0;
                    }
                }
            } else {
                if(textIconEle != undefined && textIconEle != null) {
                    textIconEle.style.color = WishlistSettings.style.theme_color;
                }
                if(countEle != undefined && countEle != null) {
                    countEle.style.color = WishlistSettings.style.theme_color;
                }
            }
        });
    },

    _updateBtnonStatusCheck: function(productsListing, finalResponse, customerStatus){
        productsListing.forEach(function(wishlistItem){
            let varId = parseInt(wishlistItem.getAttribute('data-varid'));
            let status, btnClass, wishlistCount, btnText, customIcon, iconStyle, collectionIconStyle;
            let foundProduct = finalResponse.find(function(product){
                if(product.product_tags) {
                    var excludeEnabled = window.hulkappsWishlist.generalSettings.is_exclude_enabled ? window.hulkappsWishlist.generalSettings.is_exclude_enabled : false;
                    var excludedProductTags = window.hulkappsWishlist.generalSettings.exclude_product_tags;
                    if(excludedProductTags !== undefined) {
                        var isExcluded =  excludedProductTags.some(value => product.product_tags.includes(value));

                        if(product && excludeEnabled && isExcluded) {
                            var wishlistIcon = document.querySelector('.wishlist-btn');
                            wishlistIcon.classList.add('hide-hulk-product-wishlist');
                            wishlistIcon.style.display = null;
                        }
                    }
                }
                let identifier = parseInt(product.variant_id);
                if(identifier === varId){ return product; }
            });

            if(foundProduct != null && (customerStatus == 'Guest' && foundProduct.is_exist == true) || (customerStatus == 'Customer' && foundProduct.wishlist_ids && foundProduct.wishlist_ids.length >0)){
                status = true;
                btnClass = 'icon-wishlist-heart '+wishlistBtnStyle+' wishlist-btn heart-wishlist-animation';
                btnText = WishlistSettings.language.success_button_text;
                wishlistCount = foundProduct.wishlist_count;
                customIcon = WishlistSettings.style.filled_set_custom_icon;
                iconStyle = fillIconStyle;
                collectionIconStyle = fillCollectionIconStyle;
            }else{
                status = false;
                btnClass = 'icon-wishlist-heart-empty '+wishlistBtnStyle+' wishlist-btn heart-wishlist-animation';
                btnText = WishlistSettings.language.button_text;
                if(foundProduct && foundProduct.wishlist_count > 0){
                    wishlistCount = foundProduct.wishlist_count;
                }else{
                    wishlistCount = 0;
                }
                customIcon = WishlistSettings.style.empty_set_custom_icon;
                iconStyle = emptyIconStyle;
                collectionIconStyle = emptyCollectionIconStyle;
            }
            let compactWishlistCount = HulkappWishlist._compactNumbers(wishlistCount);
            let productPageWishlistCount = 0;
            let collectionPageWishlistCount = 0;
            if(WishlistSettings.general.product_compact_numbers) {
                productPageWishlistCount = compactWishlistCount;
            } else {
                productPageWishlistCount = wishlistCount;
            }
            if(WishlistSettings.general.collection_compact_numbers) {
                collectionPageWishlistCount = compactWishlistCount;
            } else {
                collectionPageWishlistCount = wishlistCount;
            }

            if(window.hulkappsWishlist.hasAppBlockSupport !== '1') {
                wishlistItem.setAttribute('class', btnClass);
            }

            if(wishlistItem.querySelector('.hulk_wl_icon') != undefined || wishlistItem.querySelector('.hulk_wl_icon') != null) {
                wishlistItem.querySelector('.hulk_wl_icon').setAttribute('style', iconStyle);
            }

            if(wishlistItem.querySelector('.collection-icon') != undefined || wishlistItem.querySelector('.collection-icon') != null) {
                wishlistItem.querySelector('.collection-icon').setAttribute('style', collectionIconStyle);
            }

            if(wishlistItem.getElementsByClassName('hulk-wishlist-custom-icon')[0] !== undefined) {
                wishlistItem.getElementsByClassName('hulk-wishlist-custom-icon')[0].setAttribute('src', customIcon);
            }

            //wishlistItem.setAttribute('hulk-wishlist-custom-icon', customIcon);
            wishlistItem.setAttribute('data-added', status);
            if(wishlistItem.querySelector('span')){
                wishlistItem.querySelector('span').innerHTML = btnText;
            }
            if(wishlistItem.querySelector('.count')){
                if(WishlistSettings.general.public_wishlist_count === 'show') {
                    wishlistItem.querySelector('.count').style.display = 'none';
                }
                if(wishlistItem.querySelector('.hulkapps-collection-count') !== null) {
                    if(collectionCountLayout === 'top_count') {
                        wishlistItem.querySelector('.hulkapps-collection-count').innerHTML = collectionPageWishlistCount;
                    } else {
                        wishlistItem.querySelector('.hulkapps-collection-count').innerHTML = '(' + collectionPageWishlistCount + ')';
                    }

                }
                if(wishlistItem.querySelector('.hulkapps-public-count') !== null) {
                    if(buttonLayout === 'multi_color_button' && (WishlistSettings.style.button_style === 'style_2' || WishlistSettings.style.button_style === 'style_4')) {
                        wishlistItem.querySelector('.hulkapps-public-count').innerHTML = productPageWishlistCount;
                    } else {
                        wishlistItem.querySelector('.hulkapps-public-count').innerHTML = '(' + productPageWishlistCount + ')';
                    }
                }
            }

            if(WishlistSettings.general.product_page_tooltip && WishlistSettings.general.public_wishlist_count === 'show') {
                let tooltipTitle = WishlistSettings.general.tooltip_message + ' '+productPageWishlistCount+' ' + WishlistSettings.general.tooltip_time_message;
                wishlistItem.setAttribute('title', tooltipTitle);
            }
        });
    },

    _getSelectedVariant: function(currentTarget){
        let finalSelector = null;
        if(currentTarget == null || currentTarget == undefined){
            return null;
        }
        let currentForm = currentTarget.closest('form');
        if(currentForm == null || currentForm == undefined){
            if(hulkShopDomain === 'vermontfarmtable.myshopify.com' || hulkShopDomain === 'skintwo-com.myshopify.com'){
                let pathSearch = window.location.search;
                let variantId = pathSearch.split('=')[1];

                return variantId;
            }
            return null;
        }
        if(currentForm.querySelectorAll('[name="id"]')){
            finalSelector = currentForm.querySelectorAll('[name="id"]')[0];
        }else{
            let eleSelectors =  [".single-option-selector,.single-option-selector__radio:checked, select[data-option='option1'], select[data-option='option1']:checked, select[data-option='option2'], select[data-option='option1']:checked, select[data-option='option3'], select[data-option='option3']:checked, select[data-index='option1'], select[data-index='option1']:checked, select[data-index='option2'], select[data-index='option1']:checked, select[data-index='option3'], select[data-index='option3']:checked"];
            let finalSelector;
            let found_selector = false;
            eleSelectors.forEach(function(selector) {
                if(found_selector == false){
                    if(document.querySelectorAll(selector)[0] != null && document.querySelectorAll(selector)[0] != undefined){
                        found_selector = true;
                        finalSelector = document.querySelectorAll(selector)[0];
                    }
                }
            });
        }

        if(finalSelector && finalSelector.value){
            return finalSelector.value;
        } else {
            let pathSearch = window.location.search;
            let variantId = pathSearch.split('=')[1];

            return variantId;
        }

        /*if(finalSelector){
            return finalSelector.value || null ;
        }else{
            return null;
        }*/
    },

    _XMLHttpRequest: function(type, URL, data, callback){
        let newDataRequest = new XMLHttpRequest();
        newDataRequest.open(type, URL, true);
        newDataRequest.setRequestHeader('Accept', 'application/json')
        newDataRequest.setRequestHeader('Content-Type', 'application/json')
        newDataRequest.onload = function () {
            callback(newDataRequest.status, this.response)
        }
        if(type == 'GET'){ newDataRequest.send();}
        else{ newDataRequest.send(JSON.stringify(data));}
    },

    _setCookie: function(cname, cvalue, exdays){
        var currentDate = new Date();
        currentDate.setTime(currentDate.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ currentDate.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        if(cname == 'hulk_wishlist_UserUUID'){
            hulkUserUUID = cvalue;
        }
    },

    _getCookie: function(cname){
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    _manageGuestCookie: function(){
        hulkUserUUID = HulkappWishlist._getCookie('hulk_wishlist_UserUUID');
        if(hulkUserUUID == null || hulkUserUUID == undefined || hulkUserUUID.length <= 0){
            hulkUserUUID = null;
        }
    },

    _compactNumbers(value) {
        var newValue = value;
        if (value >= 1000) {
            var suffixes = ["", "k", "m", "b","t"];
            var suffixNum = Math.floor( (""+value).length/3 );
            var shortValue = '';
            for (var precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
            newValue = shortValue+suffixes[suffixNum];
        }
        return newValue;
    },

    _messageUpdate: function(msg){
        let currentFormMsg = document.querySelectorAll('.wishlistError')[0];
        if(currentFormMsg != null && currentFormMsg != undefined){
            currentFormMsg.innerHTML = msg;
            currentFormMsg.classList.add('hulkActive');
            setTimeout(function(){
                currentFormMsg.classList.remove('hulkActive');
            }, 5000);
        }
    },

    _buttonUpdate: function(status, currentTarget, msg, title = '', image = '', is_latest_notification = false){
        if(status == 'added'){
            if(currentTarget.getElementsByClassName('hulk-wishlist-custom-icon')[0] !== undefined) {
                currentTarget.getElementsByClassName('hulk-wishlist-custom-icon')[0].setAttribute('src', WishlistSettings.style.filled_set_custom_icon);
            }

            if(currentTarget.querySelector('.hulk_wl_icon')) {
                currentTarget.querySelector('.hulk_wl_icon').setAttribute('style', fillIconStyle);
            }

            if(currentTarget.querySelector('.collection-icon')) {
                currentTarget.querySelector('.collection-icon').setAttribute('style', fillCollectionIconStyle);
            }


            let showIconAnimation = (WishlistSettings.style.show_icon_animation !== undefined) ? WishlistSettings.style.show_icon_animation : 'true';
            if(showIconAnimation === 'true') {
                let iconElm = currentTarget.querySelector('.heart-hulk-animation');
                iconElm.setAttribute('style', iconAnimationStyles);
            }

            currentTarget.setAttribute('data-added', true);
            if(window.hulkappsWishlist.hasAppBlockSupport !== '1'){
                currentTarget.setAttribute('class', 'icon-wishlist-heart ' + wishlistBtnStyle + ' wishlist-btn heart-wishlist-animation');
                if (currentTarget.querySelector('span')) {
                    currentTarget.querySelector('span').innerHTML = WishlistSettings.language.success_button_text;
                }
            }
        }else{
            if(currentTarget.getElementsByClassName('hulk-wishlist-custom-icon')[0] !== undefined) {
                currentTarget.getElementsByClassName('hulk-wishlist-custom-icon')[0].setAttribute('src', WishlistSettings.style.empty_set_custom_icon);
            }

            if(currentTarget.querySelector('.hulk_wl_icon') != undefined || currentTarget.querySelector('.hulk_wl_icon') != null) {
                currentTarget.querySelector('.hulk_wl_icon').setAttribute('style', emptyIconStyle);
            }

            if(currentTarget.querySelector('.collection-icon')) {
                currentTarget.querySelector('.collection-icon').setAttribute('style', emptyCollectionIconStyle);
            }

            currentTarget.setAttribute('data-added', false);
            if(window.hulkappsWishlist.hasAppBlockSupport !== '1'){
                currentTarget.setAttribute('class', 'icon-wishlist-heart-empty ' + wishlistBtnStyle + ' wishlist-btn heart-wishlist-animation');
                if (currentTarget.querySelector('span')) {
                    currentTarget.querySelector('span').innerHTML = WishlistSettings.language.button_text;
                }
            }
        }
        if(document.querySelectorAll('[data-hulksaveforlater]')){
            document.querySelectorAll('[data-hulksaveforlater]').forEach(function(element){
                element.setAttribute('class', 'addToWishlist');
            });
        }
        if(document.querySelectorAll('.wishlistError')[0] != null && document.querySelectorAll('.wishlistError')[0] != undefined){
            let currentFormMsg = document.querySelectorAll('.wishlistError')[0];
            if (is_latest_notification) {
                let message = msg.replace('{Product}', `<b>${title}</b>`);
                let template = `<div class="hulk_notification_container">`;
                template += `<div class="notification_close" data-closeNotification onclick="document.querySelectorAll('.wishlistError')[0].classList.remove('hulkActive')"><span class="icon-wishlist-cross" data-closeNotification></span></div>`;
                template += `<img src="${image}" alt="wishlist product"/>`
                template += `<div class="message_container"><div class="notification_details">${message}</div></div>`;
                template += `</div>`;
                currentFormMsg.innerHTML = template;
            } else {
                currentFormMsg.innerHTML = msg;
            }
            currentFormMsg.classList.add('hulkActive');

            setTimeout(function(){
                currentFormMsg.classList.remove('hulkActive');
            }, 5000);
        }

    },
    /*********************************   End of Functions Used in DOM Manupilation Logic  ********************************/
}

var hulkWishlistPublic = function() {
    return {
        wishlistBtnCheck : function() {
            allHulkWishlistButtons = Array.from(document.querySelectorAll('[data-wishlist]'));
            if(allHulkWishlistButtons)
                HulkappWishlist._checkForProductStatus(allHulkWishlistButtons, 'multiple');
        },
    };
}();

// window.addEventListener("load", function(event) {
//     HulkappWishlist.init();
//     setTimeout(function() {  HulkappWishlist._loadCustomJs(); }, 2000);
// });

window.customHulkAw = HulkappWishlist;
  window.customHulkAw.init();
  setTimeout(function() {  window.customHulkAw._loadCustomJs(); }, 2000);