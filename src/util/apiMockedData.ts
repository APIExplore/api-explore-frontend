import { ApiCall } from "../types/apiCallTypes";

export const mockApiCalls: ApiCall[] = [
  {
    url: "http://example.com/prdasdsadsadsadsadsadsoducts",
    operationId: "listProducts",
    method: "get",
    endpoint: "/products",
    parameters: [
      {
        type: "asd",
        name: "string",
        value: "string",
      },
      {
        type: "asd",
        name: "string",
        value: "string",
      },
      {
        type: "asd",
        name: "string",
        value: "string",
      },
    ],
    date: "Tue, 7 Nov 2023 12:00:00 GMT",
    response: {
      status: 200,
      headers: {
        "content-type": "application/json",
        "content-length": "42",
      },
      date: "Tue, 7 Nov 2023 12:00:01 GMT",
      data: ["Product A", "Product B"],
      contentType: "",
      size: 0,
    },
    duration: 10,
  },
  {
    url: "http://example.com/users",
    operationId: "getUser",
    method: "get",
    endpoint: "/users/123",
    parameters: [
      {
        type: "asd",
        name: "string",
        value: "string",
      },
      {
        type: "asd",
        name: "string",
        value: "string",
      },
      {
        type: "asd",
        name: "string",
        value: "string",
      },
    ],
    date: "Tue, 7 Nov 2023 14:30:00 GMT",
    response: {
      status: 200,
      headers: {
        "content-type": "application/json",
        "content-length": "38",
      },
      date: "Tue, 7 Nov 2023 14:30:03 GMT",
      data: ["User 123", "johndoe@example.com"],
      contentType: "",
      size: 0,
    },
    duration: 11,
  },
  {
    url: "http://example.com/orders",
    operationId: "createOrder",
    method: "post",
    endpoint: "/orders",
    parameters: [
      {
        type: "asd",
        name: "string",
        value: "string",
      },
      {
        type: "asd",
        name: "string",
        value: "string",
      },
      {
        type: "asd",
        name: "string",
        value: "string",
      },
    ],
    date: "Tue, 7 Nov 2023 16:45:00 GMT",
    response: {
      status: 201,
      headers: {
        location: "/orders/789",
        "content-type": "application/json",
        "content-length": "45",
      },
      date: "Tue, 7 Nov 2023 16:45:05 GMT",
      data: ["Order 789", "Order created successfully"],
      contentType: "",
      size: 0,
    },
    duration: 9,
  },
  {
    url: "http://example.com/products",
    operationId: "getProduct",
    method: "get",
    endpoint: "/products/789",
    parameters: [],
    date: "Tue, 7 Nov 2023 19:15:00 GMT",
    response: {
      status: 404,
      headers: {
        "content-type": "application/json",
        "content-length": "36",
      },
      date: "Tue, 7 Nov 2023 19:15:01 GMT",
      data: ["Product not found"],
      contentType: "",
      size: 0,
    },
    duration: 6,
  },
  {
    url: "http://example.com/customers",
    operationId: "listCustomers",
    method: "get",
    endpoint: "/customers",
    parameters: [],
    date: "Tue, 8 Nov 2023 08:30:00 GMT",
    response: {
      status: 200,
      headers: {
        "content-type": "application/json",
        "content-length": "76",
      },
      date: "Tue, 8 Nov 2023 08:30:02 GMT",
      data: ["Customer 1", "Customer 2", "Customer 3"],
      contentType: "",
      size: 0,
    },
    duration: 7,
  },
];
