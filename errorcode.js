const errorCodes = {
    PRODUCTS_NOT_FOUND: {
      httpStatusCode: 404,
      body: {
        code: "Products_not_forund",
        message: "products not found",
      },
    },
   INVALID_PRODUCT_ID: {
        httpStatusCode: 404,
        body: {
          code: " Invalid_product_ID",
          message: "invalid product Id",
        },
      },
   
    PRODUCTS_HISTORY_NOT_FOUND: {
        httpStatusCode: 404,
        body: {
          code: "Products_History_not_forund",
          message: "products history not found",
        },
      },
      REFRESHED_PRODUCT_NOT_FOUND: {
        httpStatusCode: 404,
        body: {
          code: "Refreshed_Product_Not_Found",
          message: "Refreshed product not found",
        },
      },
}
  export default errorCodes;
  