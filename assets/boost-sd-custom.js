/*********************** Custom JS for Boost AI Search & Discovery  ************************/
function getProductMetafield(productData, namespace, key) {
    if (productData.hasOwnProperty('metafields')) {
        var metafieldValue = productData['metafields'].filter(function(e) {
            return e.namespace == namespace && e.key == key;
        });
        if (typeof metafieldValue[0] !== 'undefined') {
            return metafieldValue[0]['value'];
        }
    }
    return null; //Return null if metafield does not exist
};
const customize = {
    updateProductItemListView: (componentRegistry) => {
        componentRegistry.useComponentPlugin('ProductItem', {
            name: 'Customize the Product Item Component',
            enabled: true,
            apply: () => ({
                afterRender(element) {
                    try {
                        // Start customization--------------------------------------------
                        let productData = element.getParams().props.product;
                        let productId = productData.id;
                        if (productData?.split_product) {
                            productId = productData.variant_id;
                        }
                        let productItem = document.querySelector('[data-product-id="' + productId + '"]');
                        if (productItem) {
                            /* use pure js here */
                            const fitMeta = getProductMetafield(productData, 'custom', 'product_fitment');
                            if (fitMeta !== null) {
                                if (productItem.querySelector('.boost-sd__product-title') && !productItem.querySelector('.boost-sd__product-meta-fit')) {
                                    productItem.querySelector('.boost-sd__product-title').insertAdjacentHTML('afterend', '<div class="boost-sd__product-meta-fit"><b>Fitment: </b>' + fitMeta + '</div>')
                                }
                            }
                        }
                        // End-------------------------------------------------------------
                    } catch (e) {
                        console.warn(e);
                    }
                }
            }),
        });
    }
}

window.__BoostCustomization__ = (window.__BoostCustomization__ ?? []).concat([customize.updateProductItemListView]);