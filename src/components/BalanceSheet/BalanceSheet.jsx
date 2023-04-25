import { useContext, useEffect } from 'react';
import './BalanceSheet.css';
import { Context } from 'provider/Provider';
import { BeatLoader } from 'react-spinners';
import { AssetsLiabilitiesChart } from 'components/Charts/AssetsLiabilitiesChart';
import Colors from 'constants/colors';

const BalanceSheet = () => {
   const { fetchData, assets, liabilities } = useContext(Context);
   const fetchAPI = async () => {
      await fetchData().then(() => {});
   };
   useEffect(() => {
      fetchAPI();
   }, []);

   return (
      <>
         {assets.length === 0 && liabilities.length === 0 ? (
            <div
               className='section col-md-8 mx-auto pb-5 pt-5 mt-5'
               style={{
                  display: 'flex',
                  justifyContent: 'center',
               }}
            >
               <BeatLoader stylecolor={Colors.loaderColor} />
            </div>
         ) : (
            <>
               <div className='flex-container'>
                  <AssetsLiabilitiesChart data={assets} type={'assets'} />
                  <AssetsLiabilitiesChart
                     data={liabilities}
                     type={'liabilities'}
                  />
               </div>
            </>
         )}
      </>
   );
};
export default BalanceSheet;
