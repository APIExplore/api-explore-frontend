import { useEffect, useState } from "react";

const useFileUpload = (items: any, willBe: boolean) => {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    console.log(items, willBe);
  }, []);
};

export { useFileUpload };
