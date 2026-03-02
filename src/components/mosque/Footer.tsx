import { MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  const mapUrl = "https://www.google.com/maps?q=34.0522129,74.7997336";

  return (
    <footer className="border-t border-border/50 mt-6">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <h3 className="font-heading text-lg font-bold text-foreground mb-0.5">
            Jamia Masjid Shareef
          </h3>
          <p className="font-urdu text-accent text-base" dir="rtl">جامع مسجد شریف</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>Old Barzulla, Ram Bagh, Srinagar, J&K 190005</span>
          </div>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:text-accent transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>View on Map</span>
          </a>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/60">
          Prayer times: AlAdhan API • University of Islamic Sciences, Karachi • Hanafi
        </p>
        <p className="text-center text-[10px] text-muted-foreground/40 mt-1">
          © {new Date().getFullYear()} Jamia Masjid Shareef Old Barzulla Srinagar
        </p>
      </div>
    </footer>
  );
};

export default Footer;
