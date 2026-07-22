export default function SinzuBabesBanner() {
  return (
    <section className="px-4 mb-8">
      <div className="sinzu-babes-banner rounded-lg">
        <div className="w-1/3">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=350&fit=crop"
            alt="Sinzu Babe"
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="sinzu-babes-text flex-1">
          <p className="sinzu-babes-label">It's That Szn Where</p>
          <h2 className="sinzu-babes-title">
            <span className="gold-text">SINZU</span>
            <br />
            <span className="gold-text">BABES</span>
          </h2>
          <p className="sinzu-babes-shop">Shop The Look</p>
        </div>
        <div className="w-1/3">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=350&fit=crop"
            alt="Sinzu Babe"
            className="w-full h-48 object-cover"
          />
        </div>
      </div>
    </section>
  );
}