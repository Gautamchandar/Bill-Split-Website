document.getElementById("billForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const totalBill = parseFloat(document.getElementById("totalBill").value);
    const tipPercentage = parseFloat(document.getElementById("tip").value) || 0;
    const numberOfPeople = parseInt(document.getElementById("numberOfPeople").value);
    const names = document.getElementById("names").value.split(',');
    const roundingOption = document.getElementById("rounding").value;
    const selectedCurrency = document.getElementById("currency").value;

    if (!totalBill || !numberOfPeople || names.length !== numberOfPeople) {
        document.getElementById("result").innerHTML = "<p class='error'>Please enter valid inputs.</p>";
        return;
    }

    // Currency conversion rates (static for now, can be dynamic in a real app)
    const currencyRates = {
        USD: 1,
        EUR: 0.85,
        INR: 73
    };

    const selectedRate = currencyRates[selectedCurrency];

    const tipAmount = totalBill * (tipPercentage / 100);
    const totalWithTip = totalBill + tipAmount;

    // Split the amount equally
    let splitAmounts = Array(numberOfPeople).fill(totalWithTip / numberOfPeople);

    if (roundingOption === "up") {
        splitAmounts = splitAmounts.map(amount => Math.ceil(amount));
    } else if (roundingOption === "down") {
        splitAmounts = splitAmounts.map(amount => Math.floor(amount));
    }

    // Convert to selected currency
    splitAmounts = splitAmounts.map(amount => (amount * selectedRate).toFixed(2));

    // Display Results
    document.getElementById("result").innerHTML = "<h2>Split Amounts</h2>" + names.map((name, index) => {
        return `<p>${name.trim()} pays: ${splitAmounts[index]} ${selectedCurrency}</p>`;
    }).join("");

    // Display Bill Summary
    document.getElementById("billSummary").classList.remove("hidden");
    document.getElementById("totalWithTip").innerText = `Total Bill including Tip: ${(totalWithTip * selectedRate).toFixed(2)} ${selectedCurrency}`;
    document.getElementById("tipAmount").innerText = `Tip Amount: ${(tipAmount * selectedRate).toFixed(2)} ${selectedCurrency}`;

    // Payment Status
    const paymentStatusList = document.getElementById("paymentStatusList");
    paymentStatusList.innerHTML = names.map((name, index) => {
        return `<li>${name.trim()} - ${splitAmounts[index]} ${selectedCurrency} <button class="payButton" data-index="${index}">Mark as Paid</button></li>`;
    }).join("");
    document.getElementById("paymentStatus").classList.remove("hidden");

    // Add payment status event listeners
    document.querySelectorAll(".payButton").forEach(button => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            const listItem = this.parentElement;
            listItem.classList.add("paid");
            listItem.innerHTML = `${names[index].trim()} has paid ${splitAmounts[index]} ${selectedCurrency}!`;
        });
    });
});

// Reset Button
document.getElementById("resetButton").addEventListener("click", function () {
    document.getElementById("billForm").reset();
    document.getElementById("result").innerHTML = "";
    document.getElementById("billSummary").classList.add("hidden");
    document.getElementById("paymentStatus").classList.add("hidden");
});
