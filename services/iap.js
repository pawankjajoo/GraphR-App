/*
 * services/iap.js
 *
 * In-App Purchase Service
 * Handles all IAP operations:
 * • Product catalog loading
 * • Purchase processing
 * • Receipt validation
 * • Subscription management
 * Monetize responsibly. Student value first.
 */

import * as IAP from "react-native-iap";
import { Platform } from "react-native";
import { IAP_PRODUCT_IDS, IAP_PRODUCTS } from "../constants/graphr";

let iapInitialized = false;
let purchaseSuccessCallback = null;
let purchaseErrorCallback = null;

/*
 * Initialize IAP service
 * @param {object} callbacks - { onPurchaseSuccess, onPurchaseError }
 * @returns {Promise<void>}
 */
export const init = async (callbacks = {}) => {
  try {
    
    purchaseSuccessCallback = callbacks.onPurchaseSuccess;
    purchaseErrorCallback = callbacks.onPurchaseError;

    // Initialize IAP library
    await IAP.initConnection();

    // Setup purchase listeners
    setupPurchaseListeners();

    iapInitialized = true;
    console.log("[IAP] Initialized successfully");
  } catch (error) {
    console.error("[IAP] Initialization error:", error.message);
    throw error;
  }
};

/*
 * Get available products
 * @returns {Promise<array>}
 */
export const getStoreProducts = async () => {
  try {
    if (!iapInitialized) {
      console.warn("[IAP] IAP not initialized");
      return [];
    }

    // Get products from app store
    const products = await IAP.getProducts({
      skus: IAP_PRODUCT_IDS,
    });

    // Enrich with our product data
    return products.map((product) => {
      const graphrProduct = IAP_PRODUCTS.find((p) => p.productId === product.productId);
      return {
        ...product,
        ...graphrProduct,
      };
    });
  } catch (error) {
    console.error("[IAP] Get products error:", error.message);
    return [];
  }
};

/*
 * Purchase a product
 * @param {string} productId
 * @returns {Promise<void>}
 */
export const purchase = async (productId) => {
  try {
    if (!iapInitialized) {
      throw new Error("IAP not initialized");
    }

    // Get the product
    const graphrProduct = IAP_PRODUCTS.find((p) => p.productId === productId);
    if (!graphrProduct) {
      throw new Error("Product not found");
    }

    await IAP.requestPurchase({
      sku: productId,
    });

    console.log("[IAP] Purchase initiated for:", productId);
  } catch (error) {
    console.error("[IAP] Purchase error:", error.message);
    if (purchaseErrorCallback) {
      purchaseErrorCallback(error);
    }
    throw error;
  }
};

/*
 * Setup purchase listeners
 * @private
 */
const setupPurchaseListeners = () => {
  // Listen for successful purchases
  IAP.purchaseUpdatedListener((purchase) => {
    console.log("[IAP] Purchase updated:", purchase);

    // Check if purchase is valid
    if (purchase.transactionReceipt) {
      // Validate receipt (in production, send to backend)
      validateReceipt(purchase.transactionReceipt);

      // Get product info
      const product = IAP_PRODUCTS.find((p) => p.productId === purchase.productId);

      if (purchaseSuccessCallback) {
        purchaseSuccessCallback({
          ...product,
          transactionId: purchase.transactionId,
        });
      }

      IAP.finishTransaction({ purchase });
    }
  });

  // Listen for purchase errors
  IAP.purchaseErrorListener((error) => {
    console.error("[IAP] Purchase error listener:", error.message);

    if (purchaseErrorCallback) {
      purchaseErrorCallback(error);
    }
  });
};

/*
 * Validate receipt
 * In production, send to your backend for server-side validation
 * @param {string} receipt
 * @returns {Promise<boolean>}
 * @private
 */
const validateReceipt = async (receipt) => {
  try {
    console.log("[IAP] Receipt would be validated on backend");
    // In production:
    // - Send receipt to backend
    // - Backend validates with Apple App Store or Google Play
    // - Backend confirms transaction and grants product
    return true;
  } catch (error) {
    console.error("[IAP] Receipt validation error:", error.message);
    return false;
  }
};

/*
 * Restore purchases
 * @returns {Promise<void>}
 */
export const restorePurchases = async () => {
  try {
    if (!iapInitialized) {
      throw new Error("IAP not initialized");
    }

    const purchases = await IAP.getPurchaseHistory();
    console.log("[IAP] Restored purchases:", purchases.length);

    return purchases;
  } catch (error) {
    console.error("[IAP] Restore purchases error:", error.message);
    throw error;
  }
};

/*
 * Clean up IAP
 * @returns {Promise<void>}
 */
export const destroy = async () => {
  try {
    await IAP.endConnection();
    iapInitialized = false;
    console.log("[IAP] Connection closed");
  } catch (error) {
    console.error("[IAP] Destroy error:", error.message);
  }
};

/*
 * Get subscription info
 * @param {string} productId
 * @returns {object}
 */
export const getSubscriptionInfo = (productId) => {
  return IAP_PRODUCTS.find((p) => p.productId === productId);
};
