import React from "react";

import react from "./assets/react.svg";

function App() {
  return (
    <div className="flex flex-col items-center justify-center mx-auto my-auto max-w-xl h-screen">
      <img src={react} alt="logo" className="w-64 mb-2" />
      <div className="flex my-8">
        <p className="text-2xl font-medium">api-explore</p>
      </div>
    </div>
  );
}

export default App;
