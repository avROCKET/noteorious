import Clock from "./Clock.js";
export default function Header (props) {
   const { signOut } = props;
   
   return (
      <nav className="navbar navbar-light bg-dark">
         <div className="container-fluid">
            <a href="/homepage" className="navbar-brand text-light">NOTEorious</a> 
            <Clock />
            <div className="d-flex">
               <button onClick={signOut} className="btn btn-outline-success text-light" type="submit">Log out</button> 
            </div>
         </div>
      </nav>
   );
}