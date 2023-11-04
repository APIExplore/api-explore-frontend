export interface Request {
  path: string;
  method: string;
  parameters: Parameter[];
}

export interface Parameter {
  name: string;
  in: string;
  required: boolean;
  type: string;
}

export interface Item {
  path: string;
  method: string;
}
