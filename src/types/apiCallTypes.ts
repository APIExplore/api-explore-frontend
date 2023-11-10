export type ApiCall = {
  url: string;
  operationId: string;
  method: string;
  endpoint: string;
  parameters: ParameterType[];
  date: string;
  response: {
    status: number;
    headers: {
      [key: string]: string;
    };
    date: string;
    data: string[] | string;
  };
  duration: number;
};

export type ParameterType = {
  type: string;
  name: string;
  value: string;
};
