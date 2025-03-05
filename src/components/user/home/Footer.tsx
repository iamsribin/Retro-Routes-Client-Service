function Footer() {
    return (
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto flex flex-col md:flex-row md:justify-between">
          <div className="flex flex-col md:mr-12 mb-8">
            <h4 className="text-xl font-semibold mb-5">Company</h4>
            <ul className="space-y-5">
              <li>About Us</li>
              <li>Our Offices</li>
              <li>Newsroom</li>
              <li>Blog</li>
            </ul>
          </div>
          <div className="flex flex-col md:mr-12 mb-8">
            <h4 className="text-xl font-semibold mb-5">Products</h4>
            <ul className="space-y-5">
              <li>Ride</li>
              <li>Drive</li>
              <li>Go for Business</li>
              <li>Blog</li>
            </ul>
          </div>
          <div className="flex flex-col mb-8">
            <h4 className="text-xl font-semibold mb-5">Travels</h4>
            <ul className="space-y-5">
              <li>Safety</li>
              <li>Insurance</li>
              <li>Sustainability</li>
              <li>Airports</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-8">
          <aside>
            <h6 className="text-center">Copyright © 2023 - All rights reserved by Go Industries Ltd</h6>
          </aside>
        </div>
      </footer>
    );
  }
  
  export default Footer;