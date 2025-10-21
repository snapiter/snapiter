import { EnvContext } from "@/utils/env/EnvProvider";
import { useContext, useEffect, useState } from "react";

export function useHostname() {
  const [hostname, setHostname] = useState<string>("");
  const env = useContext(EnvContext);

  useEffect(() => {
    // Try to get hostname from cookie first (set by middleware)
    const getCookieValue = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const cookieHostname = getCookieValue("hostname");
    let finalHostname = "";

    if (cookieHostname) {
      finalHostname = cookieHostname;
    } else if (typeof window !== "undefined") {
      // Fallback to window.location.hostname
      finalHostname = window.location.hostname;
    }

    if(
      process.env.NODE_ENV !== "production" && 
      finalHostname === "localhost" &&
      env.SNAPITER_OVERWRITE_HOSTNAME !== ""
    ) {
      finalHostname = env.SNAPITER_OVERWRITE_HOSTNAME;
    }


    setHostname(finalHostname);
  }, []);

  return hostname;
}
