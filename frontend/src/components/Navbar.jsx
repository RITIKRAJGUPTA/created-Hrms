// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("name");

//     navigate("/"); // Redirect to Login
//   };

//   return (
//     <nav className=" navbar navbar-dark bg-dark navbar-expand-lg px-3">
//       <p className="navbar-brand">Auth System</p>

//       <div className="ms-auto">

//         {/* If NOT logged in → Show Login & Register */}
//         {!token && (
//           <>
//             <Link className="btn btn-outline-light me-2" to="/">Login</Link>
//             <Link className="btn btn-outline-warning" to="/register">Register</Link>
//           </>
//         )}

//         {/* If logged in → Show Logout */}
//         {token && (
//           <button className="btn btn-danger" onClick={handleLogout}>
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }
