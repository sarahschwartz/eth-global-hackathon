import Script from "next/script";

export default function Success() {
  return (
    <>
      <Script src="https://cdn.lordicon.com/xdjxvujz.js"></Script>
      <lord-icon
        src="https://cdn.lordicon.com/lupuorrc.json"
        trigger="loop"
        delay="2000"
        colors="primary:#121331,secondary:#047857"
        style={{ width: "96px", height: "96px" }}
      ></lord-icon>
    </>
  );
}
