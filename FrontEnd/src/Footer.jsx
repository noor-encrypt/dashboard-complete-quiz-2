function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top Section - Enhanced Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-10">
          
          {/* Project Info */}
          <div>
            <h2 className="text-2xl font-bold text-[#FF385C] mb-4">Airbnb Clone</h2>
            <p className="text-base leading-relaxed text-gray-700 mb-4">
              Experience a modern interface inspired by Airbnb — built for learning, creativity, and web design practice.
            </p>
            <a
              href="#"
              className="inline-block text-[#FF385C] font-medium hover:underline mt-2"
            >
              Learn More →
            </a>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b-2 border-[#FF385C] inline-block pb-1">
              Explore
            </h3>
            <ul className="mt-3 space-y-3 text-base text-gray-700">
              <li><a href="/" className="hover:text-[#FF385C] transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-[#FF385C] transition-colors">About Us</a></li>
              <li><a href="/services" className="hover:text-[#FF385C] transition-colors">Services</a></li>
              <li><a href="/contact" className="hover:text-[#FF385C] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b-2 border-[#FF385C] inline-block pb-1">
              Resources
            </h3>
            <ul className="mt-3 space-y-3 text-base text-gray-700">
              <li><a href="#" className="hover:text-[#FF385C] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#FF385C] transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-[#FF385C] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#FF385C] transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b-2 border-[#FF385C] inline-block pb-1">
              Follow Us
            </h3>
            <p className="text-base text-gray-700 mb-4">
              Stay connected with us on social platforms for updates and design ideas.
            </p>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="hover:text-[#FF385C] transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-[#FF385C] transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-[#FF385C] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-[#FF385C] transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300"></div>

        {/* Bottom Section (same as before) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-600">
          <p className="text-center sm:text-left mb-3 sm:mb-0">
            © {new Date().getFullYear()} <span className="font-semibold text-[#FF385C]">Airbnb Clone</span> — All Rights Reserved. 
            <span className="ml-2">Designed by <span className="font-semibold text-gray-900">Iqra</span></span>
          </p>

          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#FF385C] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#FF385C] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#FF385C] transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
