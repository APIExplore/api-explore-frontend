import { useRef, useState } from "react";

import axios from "axios";

import "./css/dragdrop.css";
import { backendDomain } from "../../constants/apiConstants";
import useLogsStore from "../../stores/logsStore";
import useSchemaModalStore from "../../stores/schemaModalStore";

// drag drop file component
export default function DragDropFile({
  onFileUpload,
  name,
  setNameError,
}: {
  onFileUpload: (data: any) => void;
  name: string;
  setNameError: (data: any) => void;
}) {
  const logs = useLogsStore();
  const setModalOpened = useSchemaModalStore((store) => store.setOpened);

  // drag state
  const [dragActive, setDragActive] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleRead = async (data) => {
    if (data.type != "application/json") {
      // Show wrong type message
      setErrorMsg("File is not json");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }

    // SEND TO BACKEND
    try {
      const formData = new FormData();

      formData.append("file", data);
      formData.append("name", name as string);

      const response = await axios.post(
        `${backendDomain}/apiSchema/set`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status != 201) {
        setErrorMsg(response.data.error);
      }

      onFileUpload(response.data);

      if (response.data.warnings) {
        logs.addWarnings(response.data.warnings);
      }
    } catch (error: any) {
      setErrorMsg(error.response ? error.response.data.error : error.message);

      if (error.response.data) {
        logs.addError(error.response.data);
      }
    }

    // Show confirmation message
    setIsUploaded(true);
    setTimeout(() => {
      setIsUploaded(false);
      setModalOpened(false);
    }, 1000);
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
    if (name.trim().length == 0) {
      setNameError("No API schema name specified");
      return;
    }
    inputRef.current.click();
  };

  return (
    <div className="flex w-full">
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
            {isUploaded && (
              <p id="file-uploaded" className="text-green-600">
                File Uploaded
              </p>
            )}
            {errorMsg && <p className="text-red-600">{errorMsg}</p>}
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
    </div>
  );
}
