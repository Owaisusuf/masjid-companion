import { MapPin, ExternalLink, Heart } from "lucide-react";

const Footer = () => {
  const mapUrl = "https://www.google.com/maps?q=34.0522129,74.7997336";

  return (
    <footer className="border-t border-border mt-8 bg-card">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-5">
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            Jamia Masjid Shareef
          </h3>
          <p className="font-urdu text-accent text-lg" dir="rtl">جامع مسجد شریف</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground mb-5">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Old Barzulla, Ram Bagh, Srinagar, J&K 190005</span>
          </div>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View on Map</span>
          </a>
        </div>

        <div className="w-24 h-px bg-border mx-auto mb-4" />

        <p className="text-center text-xs text-muted-foreground">
          Prayer times: AlAdhan API • University of Islamic Sciences, Karachi • Hanafi
        </p>
        <p className="text-center text-xs text-muted-foreground/60 mt-1">
          © {new Date().getFullYear()} Jamia Masjid Shareef Old Barzulla Srinagar
        </p>
        <p className="text-center text-xs text-muted-foreground/50 mt-3 flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by{" "}
          <span className="font-medium text-foreground/60">Owais Yousuf</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
