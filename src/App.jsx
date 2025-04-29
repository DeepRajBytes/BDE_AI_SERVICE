import { useState, useEffect } from "react";
import axios from "axios";
import ClientInfo from "./component/ClientInfo";
import EmailTemplate from "./component/EmailTemplate";
import logo from "./assets/iFlairlogo.webp";
import Footer from "./component/Footer";
import Login from "./component/Login";
import Signup from "./component/Signup";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "./auth";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [clientInfo, setClientInfo] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [nullMessage, setNullMessage] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        navigate('/signin');
        return;
      }
      const response = await axios.post("http://158.220.115.133:5006/scrape", {
        linkedin_url: linkedinUrl,
        company_url: companyUrl,
      },
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      console.error("Error:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        removeToken();
        navigate("/signin");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    removeToken();
    setLinkedinUrl("");
    setCompanyUrl("");
    setClientInfo(null);
    setEmailContent("");
    navigate("/signin");
  };


  return (
    <div className="min-h-screen bg-transparent backdrop-blur-lg p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="iFlair Logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold text-gray-800">
            iFlair Client Prospecting
          </h1>
        </div>
        <div>
          {getToken() ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-2xl shadow-md transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/signin")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-2xl shadow-md transition-all duration-300"
            >
              Login
            </button>
          )}
        </div>
      </div>
  
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
  
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <>
                {/* Input Section */}
                <div className="w-full max-w-4xl bg-white/90 rounded-xl p-6 shadow-lg backdrop-blur-sm flex flex-col md:flex-row items-center justify-center gap-4">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/2"
                    placeholder="Enter LinkedIn URL"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/2"
                    placeholder="Enter Company URL"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                  />
                  <button
                    onClick={handleSubmit}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-2xl shadow-md transition-all duration-300"
                  >
                    Submit
                  </button>
                </div>
  
                {/* Feedback & Results */}
                {nullMessage && (
                  <div className="text-center text-red-600 font-medium mt-4">
                    Sorry, it's a technical error. Please press the Submit button again.
                  </div>
                )}
                <div className="mt-6 flex flex-col gap-6 w-full max-w-4xl">
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
            }
          />
        </Route>
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