import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Charts from 'components/Charts/Charts';
import Expenses from 'components/Expenses/Expenses';
import Footer from "components/Footer/Footer";
import SupportPopUp from "components/Support/PopUp/PopUp";
import Header from "components/Header/Header";
import { Context } from 'provider/Provider';

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Header /><Charts /><Footer /><SupportPopUp /></>} />
        <Route path="/expenses" element={<><Header /><Expenses Context={Context} /><Footer /><SupportPopUp /></>} />
      </Routes>
    </Router>
  );
}

export default RouterComponent;