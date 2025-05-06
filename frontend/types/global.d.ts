declare module 'html2canvas' {
  interface Options {
    scale?: number;
    useCORS?: boolean;
    logging?: boolean;
    backgroundColor?: string;
  }
  
  function html2canvas(element: HTMLElement, options?: Options): Promise<HTMLCanvasElement>;
  export default html2canvas;
}

declare module 'jspdf' {
  interface Options {
    orientation?: 'portrait' | 'landscape';
    unit?: string;
    format?: string;
  }
  
  class jsPDF {
    constructor(options?: Options);
    addImage(imgData: string, format: string, x: number, y: number, width: number, height: number): jsPDF;
    save(filename: string): jsPDF;
  }
  
  export default jsPDF;
} 