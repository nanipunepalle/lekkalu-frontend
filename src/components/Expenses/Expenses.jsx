import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router";
import {
  Typography,
  TablePagination,
  IconButton
} from "@mui/material";
import { SkipNext, SkipPrevious } from '@mui/icons-material';
import ExpenseFormModal from "./ExpensesModal";
import { ModalContainer,
        ContainerExpenses,
        ContainerExpensesHeader,
        ContainerCardsComponents,
        ContainerCharts,
        ContainerDataChartExpenses} from "./styled";
import ExpensesList from "./ExpenseList";
import { formatDate } from "./utils";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { WeeklyChart } from "components/Charts/WeeklyChart";
import { SpentBalanceChart } from "components/Charts/SpentBalanceChart";
import { CumSumChart } from "components/Charts/CumSumChart";
import { BarLoader } from "react-spinners";
import SingleCardExpenses from "./components/SingleCardExpenses";


const Expenses = ({ Context }) => {
  const {
    expenses,
    tags,
    fetchExpenses,
    deleteExpenseRequest,
    createExpenseRequest,
    changeExpenseRequest,
    fetchTags,
    weeklyExpense,
    monthlyExpenses,
  } = useContext(Context);
  const currentPath = useLocation().pathname.slice(1)
  const [editIndex, setEditIndex] = useState(null);
  const [page, setPage] = useState(0);
  const [ loadExcelStatus, setLoadExcelStatus ]  = useState(false)
  const [newData, setNewData ] = useState([])
  const rowsPerPage = 10;


  console.log(window.location.href.slice(0,))

  useEffect(() => {
    if (!tags.length) fetchTags();
    fetchExpenses(page, rowsPerPage);
  }, [page]);

  const getTagObjects = (tagValues) => {
    return tagValues
      .map((tagValue) => tags.find((tag) => tag.id === tagValue))
      .filter((tag) => tag !== undefined);
  };

  const getTagNumbers = (tagValues) => {
    return tagValues
      .map((tagValue) => {
        const foundTag = tags.find((tag) => tag.name === tagValue);
        return foundTag ? foundTag.id : null;
      })
      .filter((tag) => tag !== undefined);
  };

  const getTagNames =(tagValues) => {
    const tagNames = tagValues&&tagValues
      .map((tagValue) => {
        const foundTag = tags.find((tag) => tag.id === tagValue);
        return foundTag ? foundTag.name : null;
      })
      .filter((tagName) => tagName !== null)
      .join(', #');
     
    return tagNames
  };

  const handleFileUpload = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async(event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet);

      
      if (parsedData.length > 0) {
        setNewData([{excelLength:parsedData.length}])
        
        const loadExcel = ()=>{
          setLoadExcelStatus(true)
          const promise = parsedData.map(async entry => {
            const dateFormatted = formatDate(new Date(entry.date));
            const tagsIds = getTagNumbers(entry.tags.split(", "))
            const {amount} = entry
            delete entry.amount
            delete entry.date
            
            const createStatus = await createExpenseRequest({ ...entry, amount:amount.toFixed(2).toString() , tags: tagsIds, time: dateFormatted, user: 1 });
            
            setNewData((prevData)=>[...prevData, createStatus])
          });

          return Promise.all(promise)
        }
        await loadExcel()
      }
      setLoadExcelStatus(false)
      Swal.fire({
        icon:'success',
        title:'The expense was added correctly.',
        timer:2300,
        timerProgressBar:true,
      })
    };

    reader.readAsBinaryString(file);
  };

  const deleteExpense = (id) => {
    deleteExpenseRequest(id);
  };

  const createExpense = (expense) => {
    createExpenseRequest({ ...expense });
  };

  const updateExpense = (index, expense) => {
    changeExpenseRequest(index, expense);
  };

  const returnExpenseToEdit = () => {
    return editIndex !== null ? { ... expenses[editIndex], tags: getTagObjects(expenses[editIndex].tags) } : null
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <ModalContainer>
      <span style={{alignSelf:'start'}}>Home » {currentPath}</span>
      {/* Modal */}
      <div style={{display:'flex'}}>
        <ContainerCardsComponents>
            {/* card */}
            <SingleCardExpenses />

        </ContainerCardsComponents>

        <ContainerDataChartExpenses>
          <ContainerCharts>
            {
              monthlyExpenses.length === 0 && weeklyExpense.length === 0 ?(
                <BarLoader></BarLoader>
              )
              :
              (
                <>
                  <WeeklyChart data={weeklyExpense} />
                  <SpentBalanceChart data={monthlyExpenses} />
                  <CumSumChart data={monthlyExpenses} />
                </>
              )
            }
            
          </ContainerCharts>
          <ContainerExpenses>
            
            <ContainerExpensesHeader>
              <Typography style={{fontSize:'1.2rem'}}>Expenses</Typography>

              <ExpenseFormModal
                onAddExpense={createExpense}
                onUpdateExpense={updateExpense}
                expenseToEdit={returnExpenseToEdit()}
                editIndex={editIndex}
                onCancelEdit={() => setEditIndex(null)}
                loadExcelStatus = {loadExcelStatus}
                handleFileUpload={handleFileUpload}
                createExpenseExcelStatus = {newData}
                Context={Context}
              />
            </ContainerExpensesHeader>
            {/* Arrows fro change expense */}
            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() => {
                  setPage((prevPage) => Math.max(prevPage - 3, 0));
                }}
              >
                <SkipPrevious />
              </IconButton>
              <TablePagination
                component="div"
                count={70}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
                labelDisplayedRows={() => ''}
              />
              <IconButton
                onClick={() => {
                  setPage((prevPage) => Math.min(prevPage + 3, 6));
                }}
              >
                <SkipNext />
              </IconButton>
              {page * 10 + 1} - {page * 10 + 10} of 70
            </div> */}

            <ExpensesList
              expenses={expenses}
              getTagNames={getTagNames}
              setEditIndex={setEditIndex}
              deleteExpense={deleteExpense}
            />
            {/* Arrows for change the expenses view */}
            {/* {!!expenses.length &&
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={() => {
                    setPage((prevPage) => Math.max(prevPage - 3, 0));
                  }}
                >
                  <SkipPrevious />
                </IconButton>
                <TablePagination
                  component="div"
                  count={70}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={10}
                  rowsPerPageOptions={[]}
                  labelDisplayedRows={() => ''}
                />
                <IconButton
                  onClick={() => {
                    setPage((prevPage) => Math.min(prevPage + 3, 6));
                  }}
                >
                  <SkipNext />
                </IconButton>
                {page * 10 + 1} - {page * 10 + 10} of 70
              </div>
            } */}
          </ContainerExpenses>
          
        </ContainerDataChartExpenses>
      
      </div>
    </ModalContainer>
  );
};

export default Expenses;

