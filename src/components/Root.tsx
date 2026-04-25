import { useEffect } from "react";
import App from "../App";
import { useLiffStore } from "../store/useLiffStore";

const liffId = import.meta.env.VITE_LIFF_ID;

const Root = () => {
  const initLiff = useLiffStore((state) => state.initLiff);

  useEffect(() => {
    const isDebug = import.meta.env.VITE_DEBUG === "true";
    const isLineBrowser = /Line/i.test(window.navigator.userAgent);
    const hasLiffState =
      window.location.search.includes("liff.state") ||
      window.location.hash.includes("liff.state");

    if (isLineBrowser || hasLiffState || isDebug) {
      initLiff(liffId);
    } else {
      useLiffStore.setState({ isReady: true, isInClient: false });
    }
  }, [initLiff]);

  return <App />;
};

export default Root;
