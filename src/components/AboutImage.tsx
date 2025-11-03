import Image from "next/image";
import Link from "next/link";
import ImageCarousel from "./ImageCarousel";

export default function AboutImage() {
  const imageList = [
    "https://images.prismic.io/ulaman/Zpcs2R5LeNNTxOAv_ulaman.jpg?auto=format,compress",
    "https://images.prismic.io/ulaman/ZotMNx5LeNNTw4r1_ulaman.jpg?auto=format,compress",
    "https://images.prismic.io/ulaman/ZjNFm0MTzAJOCfDW_best-spa-bali.jpg?auto=format,compress",
  ];
  return (
    <main className="">
      <section id="home">
        <div className="flex container mx-auto px-4 gap-3 max-w-10/12 min-h-[450px] flex-col md:flex-row">
          <div className="w-full mt-20 md:w-5/12">
            <ImageCarousel images={imageList} className="w-full h-auto" />
          </div>
          <div className="flex w-full ml-32 md:flex-1 lg:self-stretch gap justify-center gap-10 flex-col">
            <h4 className="inline-flex items-center text-3xl leading-11 font-americana text-[#c69c4d] h-fit">
              An award-winning eco-luxury resort offering a unique hideaway
              experience. Embrace authenticity, balance, and harmony with nature
              in a healing, luxurious environment.
            </h4>
            <p className="inline-block text-xl leading-8 translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100 text-[#343E35] font-light">
              We believe nature and luxury can coexist. Ulaman Eco Luxury Resort
              offers&nbsp;
              <em className="">
                a secluded, lush haven with luxurious amenities and impeccable
                service
              </em>
              . Immerse yourself in traditional Balinese culture and leave
              feeling renewed, all while minimizing your ecological footprint.
              Recharge your mind, body, and soul in this unique holistic
              retreat.
            </p>
            <div>
              <Link
                href=""
                className="link-underline"
              >
                ABOUT US
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
