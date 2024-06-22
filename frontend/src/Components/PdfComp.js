import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import pdf from "./1.pdf";

// function PdfComp(props) {
//   const [numPages, setNumPages] = useState();
//   const [pageNumber, setPageNumber] = useState(1);
//   console.log(props);
//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }

//   return (
//     <div className="pdf-div">
//        <p>
//         Page {pageNumber} of {numPages}
//       </p>
//       <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
//         {Array.apply(null, Array(numPages))
//           .map((x, i) => i + 1)
//           .map((page) => {
//             return (
//               <Page
//                 pageNumber={page}
//                 renderTextLayer={false}
//                 renderAnnotationLayer={false}
//               />
//             );
//           })}
//       </Document>
//     </div>
//   );
// }

const PdfComp = ({ pdfFile }) => {
  console.log("pdfFile:", pdfFile)
  return (
    pdfFile && (
      <div className="pdf-div">
        <iframe
          src={pdfFile.pdfFile} // Accessing the URL property from the pdfFile object
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="PDF Document"
        >
          <p>
            Your browser does not support PDFs.{" "}
            <a href={pdfFile.pdfFile}>Download the PDF</a>.
          </p>
        </iframe>
      </div>
    )
  );
};

export default PdfComp;
