import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = "https://api.exchangeratesapi.io/latest";

function App() {
	// useState returns array of options.
	const [currencyOptions, setCurrencyOptions] = useState([])
	// Default selected currency
	const [fromCurrency, setFromCurrency] = useState()
	const [toCurrency, setToCurrency] = useState()
	// Set amount state
	const [amount, setAmount] = useState(1)
	const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
	// Exchange Rate
	const [exchangeRate, setExchangeRate] = useState()
	let toAmount, fromAmount
	if (amountInFromCurrency) {
		fromAmount = amount
		toAmount = amount * exchangeRate
	} else {
		toAmount = amount
		fromAmount = amount / exchangeRate
	}
	// We call this function once our application loads. First part is function, second part is empty array.
	useEffect(() => {
		fetch(BASE_URL)
			.then(res=>res.json())
			.then(data => {
				// First [0] currency in array
				const firstCurrency = Object.keys(data.rates)[0]
				setCurrencyOptions([data.base, ...Object.keys(data.rates)])
				setFromCurrency(data.base)
				setToCurrency(firstCurrency)
				setExchangeRate(data.rates[firstCurrency])
		})
	}, [])


	// We create this two functions so we can change currency amount
	function handleFromAmountChange(e) {
		setAmount(e.target.value)
		setAmountInFromCurrency(true)
	}


	function handleToAmountChange(e) {
		setAmount(e.target.value)
		setAmountInFromCurrency(false)
	}

	// We create this function so we can change currency type
	useEffect(() => {
    	if (fromCurrency != null && toCurrency != null) {
      		fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        		.then(res => res.json())
        		.then(data => setExchangeRate(data.rates[toCurrency]))
    	}
  	}, [fromCurrency, toCurrency])

  	return (
  	<>
    	<h1>Currency</h1>
    	<CurrencyRow 
    		currencyOptions={currencyOptions}
    		selectedCurrency={fromCurrency}
    		onChangeCurrency={event => setFromCurrency(event.target.value)}
    		onChangeAmount={handleFromAmountChange}
    		amount={fromAmount}
    	/>
    	<div className="converter">is</div>
    	<CurrencyRow 
    		currencyOptions={currencyOptions}
    		selectedCurrency={toCurrency}
    		onChangeCurrency={event => setToCurrency(event.target.value)}
    		onChangeAmount={handleToAmountChange}
    		amount={toAmount}
    	/>
    </>
  );
}

export default App;
