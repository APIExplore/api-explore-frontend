export type ApexData = {
  operationId: string;
  x: any;
  y: any;
  fill?: ApexFill;
  fillColor?: string;
  strokeColor?: string;
  meta?: any;
  goals?: any;
  barHeightOffset?: number;
  columnWidthOffset?: number;
};

export type ApexConfiguration = {
  config: { series: { data: any[] }[]; colors: string[] };
  globals: { labels: [] };
};
