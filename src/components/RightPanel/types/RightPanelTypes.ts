export type Request = {
  path: string;
  method: string;
  parameters: Parameter[];
};

export type Parameter = {
  name: string;
  in: string;
  required: boolean;
  type: string;
};

export type Item = {
  path: string;
  method: string;
};
