import { useState, useEffect } from "react";
import axios from "axios";
import ClientInfo from "./component/ClientInfo";
import EmailTemplate from "./component/EmailTemplate";
import logo from "./assets/iFlairlogo.webp";
import Footer from "./component/Footer";
import Login from "./component/Login";
import Signup from "./component/Signup";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "./auth";
function App() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [clientInfo, setClientInfo] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [nullMessage, setNullMessage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://158.220.115.133:5006/scrape", {
        linkedin_url: linkedinUrl,
        company_url: companyUrl,
      });

      if (response.data.Bullet_Points === null) {
        setNullMessage(true);
      }
      // Extract required information from API response
      const companyInfo = response.data.Bullet_Points.Company_Info;
      const techServices = response.data.Bullet_Points.Tech_Products_Services;

      setClientInfo(companyInfo);
      setEmailContent(techServices);
    } catch (error) {
      alert("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Check for existing token on app load
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };
  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setLinkedinUrl("");
    setCompanyUrl("");
    setClientInfo(null);
    setEmailContent("");
    navigate("/signin");
  };
  const handleSignup = (status) => {
    if (status) {
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Left Logo and Name */}
      <div className="flex items-center gap-2 absolute top-4 left-4">
        <img src={logo} alt="iFlair Logo" className="h-10 w-18 ml-[10px]" />
        <h1 className="text-xl font-bold text-gray-800 align-items-center mt-[12px]">
          iFlair Client Prospecting
        </h1>
      </div>
      <div className="absolute top-4 right-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <button
          onClick={() => navigate("/signin")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
        )}
      </div>

      <Routes>
        <Route path="/signin" element={
          <Login onLogin={handleLogin} />
        } />
        <Route path="/signup" element={
          <Signup onSignup={handleSignup} />
        } />
        <Route path="/" element={
          isLoggedIn ? (
            <>
          <div className="flex flex-col md:flex-row items-center justify-center bg-white p-4 mt-[40px] shadow-md gap-4">
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
              placeholder="Enter LinkedIn URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
              placeholder="Enter Company URL"
              value={companyUrl}
              onChange={(e) => setCompanyUrl(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </div>

          {/* Display Client Info and Tech Products/Services Vertically */}
          {nullMessage && (
            <div className="text-center text-red-600 font-medium mt-4">
              Sorry, it's a technical error. Please press the Submit button
              again.
            </div>
          )}
          <div className="mt-6 flex flex-col gap-6">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {clientInfo && <ClientInfo data={clientInfo} />}
                {emailContent && <EmailTemplate data={emailContent} />}
              </>
            )}
          </div>
        </>
      ) : (
        <Navigate to="/signin" replace />
      )}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

// import { useState } from "react";
// import axios from "axios";
// import ClientInfo from "./component/ClientInfo";
// import EmailTemplate from "./component/EmailTemplate";

// function App() {
//   const [linkedinUrl, setLinkedinUrl] = useState("");
//   const [companyUrl, setCompanyUrl] = useState("");
//   const [clientInfo, setClientInfo] = useState("");
//   const [emailContent, setEmailContent] = useState("");

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post("http://127.0.0.1:5006/scrape", {
//         linkedin_url: linkedinUrl,
//         company_url: companyUrl,
//       });
//       setClientInfo(response.data["client-info"]);
//       setEmailContent(response.data.mail);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="flex flex-col md:flex-row items-center justify-center bg-white p-4 shadow-md gap-4">
//         <input
//           type="text"
//           className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
//           placeholder="Enter LinkedIn URL"
//           value={linkedinUrl}
//           onChange={(e) => setLinkedinUrl(e.target.value)}
//         />
//         <input
//           type="text"
//           className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
//           placeholder="Enter Company URL"
//           value={companyUrl}
//           onChange={(e) => setCompanyUrl(e.target.value)}
//         />
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//         >
//           Submit
//         </button>
//       </div>

//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {clientInfo && <ClientInfo data={clientInfo} />}
//         {emailContent && <EmailTemplate data={emailContent} />}
//       </div>
//     </div>
//   );
// }

// export default App;
