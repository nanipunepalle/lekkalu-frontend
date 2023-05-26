import React, { createContext, useReducer, useState } from 'react';
import { InitialState } from './Reducer';
import axios from 'axios';
import Reducer from './Reducer';
import Types from './Types';

const Context = createContext({
   ...InitialState,
});

const Provider = ({ children }) => {
   const [authToken, setAuthToken] = useState(null)
   const userLocalInfo = JSON.parse(localStorage.getItem('user'));
   const [store, dispatch] = useReducer(Reducer, InitialState);
   let finalDataWeekly = [];
   let finalLiabilities = [];
   let finalAssets = [];
   const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
   ];

   let weekData = [];

   const {
      statusFeedback,
      expenses,
      tags,
      weeklyExpense,
      budget,
      monthlyExpenses,
      assets,
      liabilities,
      incomeStatement,
   } = store;

   const handleErrors = (error) => {
      if (error.response) {
         if (error.response.status === 403) {
            alert(error.response.data.detail);
         } else if (error.response.status === 500) {
            alert(error.message);
         }
      }
      if (error.message == 'Network Error') {
         alert('Network Error');
      }
   };

   const giveFeedback = async(data) =>{
      
      const statusFeedback = []
      try{
         await axios
            .post(`${process.env.REACT_APP_BACKEND_API}feedback/`, data, {
                  auth: {
                  username: process.env.REACT_APP_USER,
                  password: process.env.REACT_APP_PASSWORD,
               },
            })
            .then((res) => {
               statusFeedback.push(res.status)
            });
         }catch(err){
            statusFeedback.push(err)
            handleErrors(err)
         }

         return statusFeedback
   }
   
   const fetchTags = async () => {
      try {
         const headers = {
            'Authorization': `Bearer ${userLocalInfo?.access}`,
            'Content-Type': 'application/json'
         };
         await axios
            .get(`${process.env.REACT_APP_BACKEND_API}tag/`, {headers})
            .then((res) => {
               dispatch({
                  type: Types.FETCH_TAGS,
                  payload: res.data,
               });
            });
      } catch (error) {
         handleErrors(error);
      }
   };
   const createTag = async(tag) =>{
      try{
         await axios 
            .post(`${process.env.REACT_APP_BACKEND_API}tag/`, tag, {
               auth:{
                  username: process.env.REACT_APP_USER,
                  password: process.env.REACT_APP_PASSWORD,
               }
            })
      } catch(error){
         handleErrors(error)
      }
   }
   const fetchExpenses = async (page, rowsPerPage) => {
      try {
         
         const headers = {
            'Authorization': `Bearer ${userLocalInfo?.access}`,
            'Content-Type': 'application/json'
         };
         await axios
            .get(`${process.env.REACT_APP_BACKEND_API}expenses/`, {
               headers,
               params: {
                  page: page + 1,
                  per_page: rowsPerPage,
               },
            })
            .then((res) => {
               dispatch({
                  type: Types.FETCH_EXPENSE,
                  payload: res.data,
               });
            });
      } catch (error) {
         handleErrors(error);
      }
   };

   const deleteExpenseRequest = async (id) => {
      try {
         
         const headers = {
            'Authorization': `Bearer ${userLocalInfo?.access}`,
            'Content-Type': 'application/json'
         };
         await axios
            .delete(`${process.env.REACT_APP_BACKEND_API}expenses/${id}`, {headers})
            .then((res) => {
               dispatch({
                  type: Types.DELETE_EXPENSE,
                  payload: id,
               });
            });
      } catch (error) {
         handleErrors(error);
      }
   };

   const createExpenseRequest = async (data) => {
      try {
         
         const headers = {
            'Authorization': `Bearer ${userLocalInfo?.access}`,
            'Content-Type': 'application/json'
         };
         await axios
            .post(`${process.env.REACT_APP_BACKEND_API}expenses/`, data, {headers})
            .then((res) => {
               dispatch({
                  type: Types.CREATE_EXPENSE,
                  payload: { data, id: res.data.data.id },
               });
            });
      } catch (error) {
         handleErrors(error);
      }
   };

   const changeExpenseRequest = async (index, expense) => {
      try {
        
         const headers = {
            'Authorization': `Bearer ${userLocalInfo?.access}`,
            'Content-Type': 'application/json'
         };
         await axios
            .put(
               `${process.env.REACT_APP_BACKEND_API}expenses/${expense.id}`,
               expense,{headers},
            )
            .then((res) => {
               dispatch({
                  type: Types.EDIT_EXPENSE,
                  payload: { index, expense },
               });
            });
      } catch (error) {
         handleErrors(error);
      }
   };

   const fetchData = async () => {

      try {
        
         const headers = {
            'Authorization': `Bearer ${userLocalInfo?.access}`,
            'Content-Type': 'application/json'
         };
                
         await axios
            .get(`${process.env.REACT_APP_BACKEND_API}budget/`, {
               headers
            })
            .then((res) => {
               dispatch({
                  type: Types.FETCH_BUDGET,
                  payload: res.data,
               });
            })
            
         await axios
            .get(`${process.env.REACT_APP_BACKEND_API}weekly_expenses/`,
              { headers}
            )
            .then((res) => {
               weekData = res.data;
               let totlamount = 0;
               let i = 0;
               weekData.map((da) => {
                  totlamount += weekData[i]?.total_amount;
                  if (finalDataWeekly.length >= 4) {
                     finalDataWeekly = [
                        ...finalDataWeekly,
                        {
                           time: da.week.toString() + '_' + da.year.toString(),
                           amount: da?.total_amount,
                           roll_avg: parseFloat((totlamount / 5).toFixed(2)),
                        },
                     ];
                     totlamount = totlamount - weekData[i - 4].total_amount;
                  } else {
                     finalDataWeekly = [
                        ...finalDataWeekly,
                        {
                           time: da.week.toString() + ' ' + da.year.toString(),
                           amount: da?.total_amount,
                        },
                     ];
                  }
                  i += 1;
               });
               dispatch({
                  type: Types.FETCH_WEEKLY_EXPENSE,
                  payload: finalDataWeekly,
               });
            });

         await axios
            .get(`${process.env.REACT_APP_BACKEND_API}assets/`,
               {headers}
            )
            .then((res) => {
               let totalVal = 0.000000001;
               res.data.map((da) => {
                  totalVal += da.market_value;
                  finalAssets = [
                     ...finalAssets,
                     {
                        name: da.name,
                        value: parseFloat(da.market_value),
                     },
                  ];
               });
               dispatch({
                  type: Types.FETCH_ASSETS,
                  payload: { finalAssets, totalVal },
               });
            });

         await axios
            .get(`${process.env.REACT_APP_BACKEND_API}loans/`, 
               {headers}
            )
            .then((res) => {
               let totalVal = 0.000000001;
               res.data.map((da) => {
                  totalVal += parseFloat(da.balance);
                  finalLiabilities = [
                     ...finalLiabilities,
                     {
                        name: da.name,
                        value: parseFloat(da.balance),
                     },
                  ];
               });
               dispatch({
                  type: Types.FETCH_LIABILITIES,
                  payload: { finalLiabilities, totalVal },
               });
            });
         await axios
            .get(`${process.env.REACT_APP_BACKEND_API}monthly_expenses/`, {headers})
            .then((res) => {
               let finalMonthlyExp = [];
               let response = res.data;
               response.map((da) => {
                  finalMonthlyExp = [
                     ...finalMonthlyExp,
                     {
                        name: monthNames[da.month - 1],
                        Spent: da.spent,
                        Balance: da.balance,
                        CumSum: da.cum_sum,
                     },
                  ];
               });

               dispatch({
                  type: Types.FETCH_MONTHLY_EXPENSE,
                  payload: finalMonthlyExp,
               });
            });
      } catch (error) {
         // Handle errors
         handleErrors(error);
      }

      //Removed fetch expenses here, because it breaks pagination request on expenses page
   };

   const fetchToken = async (username, password) => {
      try {
         const auth = {
            username: username,
            password: password
         };

         return await axios.post(`${process.env.REACT_APP_BACKEND_URL}token/`, auth)
            .then(response => {
               setAuthToken(response.data)
               return response.data
            })

      } catch (error) {
         handleErrors(error);
      }
   };

   const fetchIncomeSources = async () => {
      try {
         const token = await fetchToken()
         const headers = {
            'Authorization': `Bearer ${token?.access}`,
            'Content-Type': 'application/json'
         };

         return axios.get('https://api.finuncle.com/api/income_source/', { headers })
            .then(response => {
               return response.data
            })
      } catch (error) {
         handleErrors(error);
         return []
      }
   };

   const fetchIncomeExpenses = async () => {
      try {
         const token = await fetchToken()
         const headers = {
            'Authorization': `Bearer ${token?.access}`,
            'Content-Type': 'application/json'
         };

         return axios.get('https://api.finuncle.com/api/income_expense/', { headers })
            .then(response => {
               return response.data
            })
      } catch (error) {
         handleErrors(error);
         return []
      }
   };
   const fetchIncomeStatement = async () => {
      try {
         let populatedIncomeStatement = { income: [], expenses: [] }
         let transformedIncomeArray = []
         let transformedExpensesArray = []

         const incomeSources = await fetchIncomeSources();
         const incomeExpenses = await fetchIncomeExpenses();

         if (incomeSources.length) {
            //API returns [{‘name’: ‘day_job_income’, ‘type’:’salary’,’amount’:50000}]
            //Transform to [{‘name’: ‘day_job_income’, ‘type’:’salary’,’value’:50000}]
            transformedIncomeArray = incomeSources.map((each) => {
               return { name: each.name, type: each.type, value: parseFloat(each.amount) }
            })
         }
         if (incomeExpenses.length) {
            //API returns [{‘name’: ‘day_job_income’, ‘type’:’salary’,’amount’:50000}]
            //Transform to [{‘name’: ‘day_job_income’, ‘type’:’salary’,’value’:50000}]
            transformedExpensesArray = incomeExpenses.map((each) => {
               console.log({ original: each.amount, value: parseFloat(each.amount) })
               return { name: each.name, type: each.type, value: parseFloat(each.amount) }
            })
         }
         populatedIncomeStatement.income = transformedIncomeArray
         populatedIncomeStatement.expenses = transformedExpensesArray

         dispatch({
            type: Types.SET_INCOME_STATEMENT,
            payload: populatedIncomeStatement,
         });
      } catch (error) {
         handleErrors(error);
      }
   };

   return (
      <Context.Provider
         value={{
            authToken,
            setAuthToken,
            expenses,
            tags,
            budget,
            weeklyExpense,
            monthlyExpenses,
            assets,
            liabilities,
            incomeStatement,
            statusFeedback,
            giveFeedback,
            fetchData,
            fetchExpenses,
            deleteExpenseRequest,
            createExpenseRequest,
            changeExpenseRequest,
            fetchTags,
            createTag,
            fetchToken,
            fetchIncomeSources,
            fetchIncomeExpenses,
            fetchIncomeStatement
         }}
      >
         {children}
      </Context.Provider>
   );
};

export { Context, Provider };
