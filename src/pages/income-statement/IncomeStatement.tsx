import React, {useContext, useEffect} from "react";
import IncomeStatementSummary from "../../components/income-statement/summary/IncomeStatementSummary";
// import { incomeStatement } from "constants/income-statement-test-dataset";
import SummarizeIcon from "@mui/icons-material/Summarize";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import Income from "../../components/income-statement/income/Income";
import {Expenses} from "../../components/income-statement/expenses/Expenses";
import {BeatLoader} from "react-spinners";
import Colors from "../../constants/colors";


const IncomeStatement = ({Context}: any) => {
    const {fetchIncomeStatement, incomeStatement}: any = useContext(Context);
    const [currentab, setCurrentTab] = React.useState(0);

    const handleTabChange = (event: any, newValue: any) => {
        setCurrentTab(newValue);
    };
    useEffect(() => {
        fetchIncomeStatement();
    }, []);
    useEffect(() => {
        console.log({incomeStatement});
    }, [JSON.stringify(incomeStatement)]);

    const loadCurrentTab = () => {
        switch (currentab) {
            default:
                return null;
            case 0: {
                return (
                    <IncomeStatementSummary
                        incomeStatement={incomeStatement}
                        totalIncome={totalIncome}
                        totalExpense={totalExpense}
                        difference={difference}
                    />
                );
            }
            case 1: {
                return (
                    <Income incomeStatement={incomeStatement} totalIncome={totalIncome}/>
                );
            }
            case 2: {
                return (
                    <Expenses
                        incomeStatement={incomeStatement}
                        totalExpense={totalExpense}
                    />
                );
            }
        }
    };

    const totalIncome = incomeStatement.income.reduce(
        (total: any, item: any) => total + item.value,
        0
    );

    const totalExpense = incomeStatement.expenses.reduce(
        (total: any, item: any) => total + item.value,
        0
    );
    const difference = totalIncome - totalExpense;
    return (
        <div>
            {incomeStatement.income.length === 0 &&
            incomeStatement.expenses.length === 0 ? (
                <div
                    className="section col-md-8 mx-auto pb-5 pt-5 mt-5"
                    style={{
                        backgroundColor: Colors.graphBG,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <BeatLoader color={Colors.loaderColor}/>
                </div>
            ) : (
                <div>{loadCurrentTab()}</div>
            )}
        </div>
    );
};

export default IncomeStatement;
