import CardPage from "@/components/Card/CardPage";
import LOADED from "@/components/Loading/Loaded";
import Navbar from "@/components/Navbar/Navbar";
import SmoothScroll from "@/components/utils/smoothScroll";
import ScrollVideo from "@/components/Home/ScrollVideo";

export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <LOADED />
        {/* <SmoothScroll>
          <div className="overflow-hidden bg-black">
            <ScrollVideo videoSrc="/video/stockW.mp4" />
          </div>
        </SmoothScroll> */}
        <CardPage />
      </main>
    </>
  );
}
