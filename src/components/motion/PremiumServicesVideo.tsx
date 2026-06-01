const PremiumServicesVideo = () => {
  return (
    <section className="relative w-full bg-bone">
      <div className="container-cara py-16 md:py-24">
        <video
          src="/media/premium-services.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-auto rounded-md shadow-lg"
        />
      </div>
    </section>
  );
};

export { PremiumServicesVideo };
export default PremiumServicesVideo;
