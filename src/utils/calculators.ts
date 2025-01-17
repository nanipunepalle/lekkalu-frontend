import { round } from 'lodash'

export function calculateSip(monthlyAmount: number, durationInvestment: number, rateReturn: number) {
  const months = durationInvestment * 12
  const rateMonth = rateReturn / 100 / 12

  const totalInvested = monthlyAmount * months

  let finalValue = (monthlyAmount * (Math.pow(1 + rateMonth, months) - 1)) / rateMonth

  finalValue = parseInt(finalValue.toFixed(0))
  const wealthGained = finalValue - totalInvested

  return { totalInvested, finalValue, wealthGained }
}

export function calculateCagr(initialValue: number, finalValue: number, durationOfInvestment: number) {
  /** Calculating absolute CAGR and %age */
  const absoluteCAGR = Math.pow(finalValue / initialValue, 1 / durationOfInvestment) - 1
  const percentageCAGR = (absoluteCAGR * 100).toFixed(2)

  /** Calculating absolute returns */
  const absoluteReturns = (finalValue / initialValue - 1) * 100

  /** Calculating amount based of CAGR for each year */
  let initialVal = initialValue
  const barChartData = [
    {
      name: 'Year 0',
      value: round(initialValue, 2),
    },
  ]

  for (let i = 1; i < durationOfInvestment + 1; i++) {
    const amountThisYear = initialVal * (1 + absoluteCAGR)
    barChartData.push({
      name: `Year ${i}`,
      value: round(amountThisYear, 2),
    })
    initialVal = amountThisYear
  }

  return {
    absoluteCAGR: absoluteCAGR.toFixed(2),
    absoluteReturns: absoluteReturns.toFixed(2),
    percentageCAGR,
    durationOfInvestment,
    barChartData,
  }
}

export function calculateEmi(
  loanPrincipal: number,
  loanInterest: number,
  loanTenure: number,
  unit: 'Months' | 'Years',
) {
  if (loanPrincipal && loanInterest && loanTenure) {
    const P = Math.abs(loanPrincipal)
    const r = Math.abs(loanInterest / (12 * 100))
    const n = Math.abs(loanTenure) //* 12 when year
    const nYear = Math.abs(loanTenure * 12)
    const E =
      (P * r * Math.pow(1 + r, unit === 'Months' ? n : nYear)) / (Math.pow(1 + r, unit === 'Months' ? n : nYear) - 1)

    const repaymentTable = []
    let outstandingPrincipal = P

    for (let i = 1; unit === 'Months' ? i <= n : i <= nYear; i++) {
      const interestComponent = outstandingPrincipal * r
      const principalComponent = E - interestComponent
      outstandingPrincipal -= principalComponent

      const monthly_payment = interestComponent + principalComponent

      const repaymentRecord = {
        month: i,
        principal: round(principalComponent, 2),
        interest: round(interestComponent, 2),
        total_payment: round(monthly_payment, 2),
        outstandingPrincipal: round(outstandingPrincipal, 2),
      }
      repaymentTable.push(repaymentRecord)
    }

    const total_interest_payable = E * (unit === 'Months' ? n : nYear) - P
    const total_payment = P + total_interest_payable

    return {
      loan_emi: isNaN(E) ? '0' : E.toFixed(2),
      total_interest_payable: isNaN(total_interest_payable) ? '0' : total_interest_payable.toFixed(2),
      total_payment: isNaN(total_payment) ? '0' : total_payment.toFixed(2),
      repayment_table: repaymentTable,
    }
  }
}

export function calculateAssetsForEmi(loanPrincipal: number, totalInterestPayable: string) {
  const assets = [
    {
      name: 'principal',
      value: Math.abs(loanPrincipal),
    },
    {
      name: 'Interest',
      value: Math.abs(parseInt(totalInterestPayable)),
    },
  ]

  const totalVal = assets.reduce((acc, asset) => acc + asset.value, 0)

  return { finalAssets: assets, totalVal }
}

export function calculateTenureByUnit(unit: 'Months' | 'Years', loanTenure: number) {
  let tenure = 0

  if (unit === 'Years') {
    tenure = Math.floor(loanTenure / 12)
  } else {
    tenure = Math.floor(loanTenure * 12)
  }

  return tenure
}
