import { useState, useRef } from "react";
import "./css/dragdrop.css";

// drag drop file component
export default function DragDropFile({ onFileUpload }) {
  // drag state
  const [dragActive, setDragActive] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  // ref
  const inputRef: any = useRef(null);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleRead = (data) => {
    if (data.type != "application/json") {
      // Show wrong type message
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
      }, 3000);
      return;
    }

    // SEND TO BACKEND

    // Reading schema
    let reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = onFileUpload;

    // Read in the image file as a data URL.
    reader.readAsText(data);

    // Show confirmation message
    setIsUploaded(true);
    setTimeout(() => {
      setIsUploaded(false);
    }, 3000);
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleRead(e.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleRead(e.target.files[0]);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <form
      className="my-2"
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
      />
      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? "drag-active" : ""}
      >
        <div>
          <p>Drag and drop your file here or</p>
          <button className="upload-button" onClick={onButtonClick}>
            Upload a file
          </button>
          {isUploaded && <p className="text-green-600">File Uploaded</p>}
          {isWrong && <p className="text-red-600">File is not json</p>}
        </div>
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
}
