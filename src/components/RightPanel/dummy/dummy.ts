const data = {
  swagger: "2.0",
  info: {
    version: "1.0",
  },
  host: "localhost:8080",
  basePath: "/",
  schemes: ["http"],
  paths: {
    "/products/{productName}": {
      get: {
        operationId: "getProductByName",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              $ref: "#/definitions/Product",
            },
            headers: {},
          },
        },
      },
      post: {
        operationId: "addProduct",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          default: {
            description: "successful operation",
          },
        },
      },
      delete: {
        operationId: "deleteProductByName",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          default: {
            description: "successful operation",
          },
        },
      },
    },
    "/products": {
      get: {
        operationId: "getAllProducts",
        produces: ["application/json"],
        parameters: [],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "array",
              items: {
                type: "string",
              },
            },
            headers: {},
          },
        },
      },
    },
    "/products/{productName}/configurations/{configurationName}/features/{featureName}":
      {
        post: {
          operationId: "addFeatureToConfiguration",
          produces: ["application/json"],
          parameters: [
            {
              name: "productName",
              in: "path",
              required: true,
              type: "string",
            },
            {
              name: "configurationName",
              in: "path",
              required: true,
              type: "string",
            },
            {
              name: "featureName",
              in: "path",
              required: true,
              type: "string",
            },
            {
              name: "productName",
              in: "path",
              required: true,
              type: "string",
            },
            {
              name: "configurationName",
              in: "path",
              required: true,
              type: "string",
            },
          ],
          responses: {
            default: {
              description: "successful operation",
            },
          },
        },
        delete: {
          operationId: "deleteFeature",
          produces: ["application/json"],
          parameters: [
            {
              name: "productName",
              in: "path",
              required: true,
              type: "string",
            },
            {
              name: "configurationName",
              in: "path",
              required: true,
              type: "string",
            },
            {
              name: "featureName",
              in: "path",
              required: true,
              type: "string",
            },
            {
              name: "productName",
              in: "path",
              required: true,
              type: "string",
            },
            {
              name: "configurationName",
              in: "path",
              required: true,
              type: "string",
            },
          ],
          responses: {
            default: {
              description: "successful operation",
            },
          },
        },
      },
    "/products/{productName}/configurations/{configurationName}/features": {
      get: {
        operationId: "getConfigurationActivedFeatures",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "configurationName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "configurationName",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "array",
              items: {
                type: "string",
              },
            },
            headers: {},
          },
        },
      },
    },
    "/products/{productName}/configurations/{configurationName}": {
      get: {
        operationId: "getConfigurationWithNameForProduct",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "configurationName",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              $ref: "#/definitions/ProductConfiguration",
            },
            headers: {},
          },
        },
      },
      post: {
        operationId: "addConfiguration",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "configurationName",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          default: {
            description: "successful operation",
          },
        },
      },
      delete: {
        operationId: "deleteConfiguration",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "configurationName",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          default: {
            description: "successful operation",
          },
        },
      },
    },
    "/products/{productName}/configurations": {
      get: {
        operationId: "getConfigurationsForProduct",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "array",
              items: {
                type: "string",
              },
            },
            headers: {},
          },
        },
      },
    },
    "/products/{productName}/features": {
      get: {
        operationId: "getFeaturesForProduct",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              type: "array",
              uniqueItems: true,
              items: {
                $ref: "#/definitions/Feature",
              },
            },
            headers: {},
          },
        },
      },
    },
    "/products/{productName}/features/{featureName}": {
      post: {
        operationId: "addFeatureToProduct",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "featureName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "description",
            in: "formData",
            required: false,
            type: "string",
          },
        ],
        responses: {
          default: {
            description: "successful operation",
          },
        },
      },
      put: {
        operationId: "updateFeatureOfProduct",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "featureName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "description",
            in: "formData",
            required: false,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              $ref: "#/definitions/Feature",
            },
            headers: {},
          },
        },
      },
      delete: {
        operationId: "deleteFeatureOfProduct",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "featureName",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          default: {
            description: "successful operation",
          },
        },
      },
    },
    "/products/{productName}/constraints/requires": {
      post: {
        operationId: "addRequiresConstraintToProduct",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "sourceFeature",
            in: "formData",
            required: false,
            type: "string",
          },
          {
            name: "requiredFeature",
            in: "formData",
            required: false,
            type: "string",
          },
        ],
        responses: {
          default: {
            description: "successful operation",
          },
        },
      },
    },
    "/products/{productName}/constraints/excludes": {
      post: {
        operationId: "addExcludesConstraintToProduct",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "sourceFeature",
            in: "formData",
            required: false,
            type: "string",
          },
          {
            name: "excludedFeature",
            in: "formData",
            required: false,
            type: "string",
          },
        ],
        responses: {
          default: {
            description: "successful operation",
          },
        },
      },
    },
    "/products/{productName}/constraints/{constraintId}": {
      delete: {
        operationId: "deleteConstraint",
        produces: ["application/json"],
        parameters: [
          {
            name: "productName",
            in: "path",
            required: true,
            type: "string",
          },
          {
            name: "constraintId",
            in: "path",
            required: true,
            type: "integer",
            format: "int64",
          },
        ],
        responses: {
          default: {
            description: "successful operation",
          },
        },
      },
    },
  },
  definitions: {
    Feature: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          format: "int64",
        },
        name: {
          type: "string",
        },
        description: {
          type: "string",
        },
      },
    },
    FeatureConstraint: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          format: "int64",
        },
        type: {
          type: "string",
        },
      },
    },
    Product: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          format: "int64",
        },
        name: {
          type: "string",
        },
        features: {
          type: "array",
          readOnly: true,
          uniqueItems: true,
          items: {
            $ref: "#/definitions/Feature",
          },
        },
        constraints: {
          type: "array",
          readOnly: true,
          uniqueItems: true,
          items: {
            $ref: "#/definitions/FeatureConstraint",
          },
        },
      },
    },
    ProductsConfigurationResource: {
      type: "object",
    },
    ProductsConfigurationFeaturesResource: {
      type: "object",
    },
    ProductConfiguration: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        valid: {
          type: "boolean",
        },
        activedFeatures: {
          type: "array",
          uniqueItems: true,
          items: {
            $ref: "#/definitions/Feature",
          },
        },
      },
    },
    ProductsFeaturesResource: {
      type: "object",
    },
    ProductsConstraintsResource: {
      type: "object",
    },
  },
};

export { data };
