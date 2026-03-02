import { MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  const mapUrl = "https://www.google.com/maps?q=34.0522129,74.7997336";

  return (
    <footer className="border-t border-border/50 mt-8">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-6">
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">
            Jamia Masjid Shareef
          </h3>
          <p className="font-urdu text-accent text-lg">جامع مسجد شریف</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Old Barzulla, Ram Bagh, Srinagar, J&K 190005</span>
          </div>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:text-accent transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View on Map</span>
          </a>
        </div>

        <p className="text-center text-xs text-muted-foreground/60">
          Prayer times calculated using AlAdhan API • University of Islamic Sciences, Karachi method • Hanafi school
        </p>
        <p className="text-center text-xs text-muted-foreground/40 mt-2">
          © {new Date().getFullYear()} Jamia Masjid Shareef Old Barzulla Srinagar
        </p>
      </div>
    </footer>
  );
};

export default Footer;
