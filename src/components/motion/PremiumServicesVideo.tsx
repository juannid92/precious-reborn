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
        <p className="mt-6 text-center font-display italic text-lg md:text-xl text-ink/80">
          Anello con diamante — oro 18KT
        </p>
      </div>
    </section>
  );
};

export { PremiumServicesVideo };
export default PremiumServicesVideo;
