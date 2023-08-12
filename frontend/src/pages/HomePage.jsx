import Navbar from "../components/Navbar";
import image from "../assets/Checklist.jpg";
import Footer from "../components/Footer";

export default function HomePage() {
  const authenticated = true;
  return (
    <div>
    <div
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      
      <Navbar authenticated={authenticated} />
      </div>
      {/* Adăugați clasa "footer" pentru a fixa footer-ul în partea de jos */}
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
