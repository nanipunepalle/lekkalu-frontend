import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Charts from 'components/Charts/Charts';
import Expenses from 'components/Expenses/Expenses';
import BalanceSheet from 'components/BalanceSheet/BalanceSheet'
import Header from "components/Header/Header";
import {Context} from 'provider/Provider';

const RouterComponent = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<><Header/><Charts/></>}/>
                <Route path="/expenses" element={<><Header/><Expenses Context={Context}/></>}/>
                <Route path="/balance_sheet" element={<><Header/><BalanceSheet Context={Context}/></>}/>
            </Routes>
        </Router>
    );
}

export default RouterComponent;