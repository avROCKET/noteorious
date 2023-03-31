import Clock from "./Clock.js";
import logo from "../assets/logo.jpg";
export default function Header (props) {
   const { signOut } = props;
   
   
   return (
      <nav className="navbar navbar-custom">
         <div className="container-fluid">
            <a href="/homepage" className="navbar-brand text-light"><img style={{ height: 45, marginRight: 10}} src={logo}/>NOTEorious</a> 
            <Clock />
            <div className="d-flex">
               <button onClick={signOut} className="btn btn-outline-success text-light" type="submit">Log out</button> 
            </div>
         </div>
      </nav>
   );
}