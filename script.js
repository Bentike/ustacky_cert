var products = [
  {
    index: 1,
    id: "p1",
    name: "Samsung TV",
    price: 500000,
  },
  {
    index: 2,
    id: "p2",
    name: "Pixel 4a",
    price: 250000,
  },
  {
    index: 3,
    id: "p3",
    name: "PS 5",
    price: 300000,
  },
  {
    index: 4,
    id: "p4",
    name: "MacBook Air",
    price: 800000,
  },
  {
    index: 5,
    id: "p5",
    name: "Apple Watch",
    price: 95000,
  },
  {
    index: 6,
    id: "p6",
    name: "Air Pods",
    price: 75000,
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const shopBtn = document.querySelector(".btn_1");
  const cartBtn = document.getElementById("cart_btn");
  const cartBar = document.getElementById("cart_B");

  const cartV = () => {
    cartBar.classList.toggle("show");
  };

  cartBtn.addEventListener("click", cartV);
  shopBtn.addEventListener("click", cartV);

  // Function to calculate total price based on unit price and quantity
  function calculateTotalPrice(unitPrice, quantity) {
    const qty = Number(quantity);
    if (qty === 0) {
      return unitPrice * 1;
    }
    return unitPrice * qty;
  }

  // Function to calculate and update the total amount to be paid (a_price)
  function updateTotalAmount() {
    const table = document.getElementById("section_table");
    const priceSpans = table.querySelectorAll(
      "tr.t_r_body td.t_d_body:nth-child(3) span"
    );
    let total = 0;
    if (priceSpans.length === 0) {
      total = 0;
    } else {
      priceSpans.forEach((span) => {
        total += Number(span.textContent);
      });
    }
    const aPriceElement = document.getElementById("a_price");
    if (aPriceElement) {
      aPriceElement.textContent = total;
    }
  }

  // Function to update the displayed price in the table row
  const updatePriceDisplay = (row, newPrice) => {
    const priceCell = row.querySelector("td.t_d_body:nth-child(3) span");
    if (priceCell) {
      priceCell.textContent = newPrice;
    }
  };

  // Function to update serial numbers after adding/removing rows
  function updateSerialNumbers() {
    const rows = document.querySelectorAll("tr.t_r_body");
    rows.forEach((row, index) => {
      const firstTd = row.querySelector("td.t_d_body");
      if (firstTd) {
        firstTd.textContent = index + 1;
      }
    });
  }

  // Initial attach event listeners for existing elements
  attachEventListeners();

  const sBtn = document.querySelectorAll(".s_btn");
  const originalText = "ADD TO CART";
  const btnText = document.getElementById("btn_text");

  sBtn.forEach((sBtn) => {
    sBtn.addEventListener("click", () => {
      if (sBtn.textContent == originalText) {
        sBtn.classList.toggle("L");
        sBtn.textContent = "REMOVE FROM CART";

        const tr = document.createElement("tr");
        tr.classList.add("t_r_body");
        const table = document.getElementById("section_table");

        // Count existing rows with class t_r_body for serial number
        const existingRows = table.querySelectorAll("tr.t_r_body");
        const tdContent = existingRows.length + 1;

        const tdDiv = sBtn.parentElement;
        const tdName = tdDiv.querySelector(".s_text").textContent;
        const tdPrice = Number(tdDiv.querySelector(".price_N").textContent);
        const tdPrices = tdPrice * 1; // Initial total price with quantity 1

        tr.setAttribute("data-unit-price", tdPrice);

        tr.innerHTML = `
          <td class="t_d_body">${tdContent}</td>
          <td class="t_d_body t_d_name">${tdName}</td>
          <td class="t_d_body">₦<span>${tdPrices}</span></td>
          <td class="td_btn">
              <button>
              <span class="material-symbols-outlined" id="sub_btn"> check_indeterminate_small </span>
              </button>
              <p class="td_no" id="td_no">1</p>
              <button>
              <span class="material-symbols-outlined" id="add_btn">
                  add
              </span>
              </button>
          </td>
          <td class="t_d_body"><button class="R_btn">Remove</button></td>
        `;

        table.appendChild(tr);

        // Re-attach event listeners to include new elements
        attachEventListeners();
        updateTotalAmount();
        btnText.textContent = document.querySelectorAll("tr.t_r_body").length;
      } else {
        sBtn.classList.toggle("L");
        sBtn.textContent = originalText;

        // Remove the corresponding row from the table
        const table = document.getElementById("section_table");
        const rows = table.querySelectorAll("tr.t_r_body");
        rows.forEach((row) => {
          const itemName = row.querySelectorAll("td.t_d_body")[1].textContent;
          if (
            itemName === sBtn.parentElement.querySelector(".s_text").textContent
          ) {
            row.remove();
            updateSerialNumbers();
            updateTotalAmount();
          }
        });

        // Re-attach event listeners after removal
        attachEventListeners();
        btnText.textContent = document.querySelectorAll("tr.t_r_body").length;
      }
    });
  });

  // Function to attach event listeners to all add, sub, and remove buttons
  function attachEventListeners() {
    const addButtons = document.querySelectorAll("#add_btn");
    const subButtons = document.querySelectorAll("#sub_btn");
    const quantityDisplays = document.querySelectorAll("#td_no");
    const removeButtons = document.querySelectorAll(".R_btn");

    addButtons.forEach((addBtn, index) => {
      addBtn.onclick = () => {
        const qtyDisplay = quantityDisplays[index];
        qtyDisplay.textContent = Number(qtyDisplay.textContent) + 1;

        // Update the total price in the row
        const row = addBtn.closest("tr");
        const unitPrice = Number(row.getAttribute("data-unit-price"));
        const newTotalPrice = calculateTotalPrice(
          unitPrice,
          qtyDisplay.textContent
        );
        updatePriceDisplay(row, newTotalPrice);
        updateTotalAmount();
      };
    });

    subButtons.forEach((subBtn, index) => {
      subBtn.onclick = () => {
        const qtyDisplay = quantityDisplays[index];
        if (Number(qtyDisplay.textContent) > 1) {
          qtyDisplay.textContent = Number(qtyDisplay.textContent) - 1;

          // Update the total price in the row
          const row = subBtn.closest("tr");
          const unitPrice = Number(row.getAttribute("data-unit-price"));
          const newTotalPrice = calculateTotalPrice(
            unitPrice,
            qtyDisplay.textContent
          );
          updatePriceDisplay(row, newTotalPrice);
          updateTotalAmount();
        } else {
          alert(
            "You cannot have less than 1 item. If you wish to remove then click remove"
          );
        }
      };
    });

    removeButtons.forEach((removeBtn) => {
      removeBtn.onclick = () => {
        const row = removeBtn.parentElement.parentElement;
        const itemName = row.querySelectorAll("td.t_d_body")[1].textContent;
        const sBtn = Array.from(document.querySelectorAll(".s_btn")).find(
          (btn) =>
            btn.parentElement.querySelector(".s_text").textContent === itemName
        );
        if (sBtn && sBtn.textContent !== originalText) {
          sBtn.classList.toggle("L");
          sBtn.textContent = originalText;
        }
        row.remove();
        updateSerialNumbers();
        updateTotalAmount();
        btnText.textContent = document.querySelectorAll("tr.t_r_body").length;
      };
    });
  }

  const checkoutBtn = document.getElementById("btn_2");
  const pModal = document.getElementById("p_modal");
  const modalClose = document.getElementById("p_modal_close");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");

  // Function to validate form fields
  function validateFields() {
    let isValid = true;

    // Validate email
    const email = document.getElementById("emailID").value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    emailError.textContent = ""; // Reset error message
    if (!emailPattern.test(email)) {
      emailError.textContent = "Invalid email address";
      emailError.classList.add("showError");
      isValid = false;
    } else {
      emailError.classList.remove("showError");
    }

    // Validate phone number
    const phone = document.getElementById("phoneID").value;
    const phonePattern = /^\d{11}$/;
    phoneError.textContent = ""; // Reset error message
    if (!phonePattern.test(phone)) {
      phoneError.textContent = "Phone number must be 11 digits";
      phoneError.classList.add("showError");
      isValid = false;
    } else {
      phoneError.classList.remove("showError");
    }

    // Validate name
    const name = document.getElementById("nameID").value;
    nameError.textContent = ""; // Reset error message
    if (name.trim() === "") {
      nameError.textContent = "Name cannot be empty";
      nameError.classList.add("showError");
      isValid = false;
    } else {
      nameError.classList.remove("showError");
    }

    return isValid;
  }

  const modalOpen = () => {
    if (btnText.textContent > 0) {
      if (validateFields()) {
        cart.classList.toggle("show");
        pModal.classList.toggle("show");
      }
    } else {
      alert("Cart is empty");
    }
  };

  modalClose.addEventListener("click", () => {
    cart.classList.toggle("show");
    pModal.classList.toggle("show");
    cartBar.classList.toggle("show");
  });

  // Attach event listener for checkout button
  checkoutBtn.addEventListener("click", modalOpen);

  function updateModalDisplay() {
    const aPriceElement = document.getElementById("a_price");
    const numDecimals = 2;
    const modalEmail = document.getElementById("modal_email");
    const modalAmount = document.getElementById("modal_amount");
    const testAmount = document.getElementById("test_btn_text");
    const email = document.getElementById("emailID").value;

    modalEmail.textContent = email;

    modalAmount.textContent = Number(aPriceElement.textContent).toFixed(
      numDecimals
    );
    testAmount.textContent = Number(aPriceElement.textContent).toFixed(
      numDecimals
    );
  }

  checkoutBtn.addEventListener("click", updateModalDisplay);

  const payList = document.querySelectorAll(".pay_list_item");
  payList.forEach((items) => {
    items.addEventListener("click", () => {
      payList.forEach((listItem) => {
        listItem.classList.remove("active");
      });

      items.classList.toggle("active");
    });
  });

  function payWithPaystack() {
    // Step 1: Initialize transaction
    const aPriceElement = document.getElementById("a_price");
    const email = document.getElementById("emailID").value; // Customer's email

    // Ensure amount is calculated correctly
    const amount = Number(aPriceElement.textContent) * 100; // Amount in kobo (500 NGN = 50000 kobo)

    // Check if email and amount are valid
    if (!email || amount <= 0) {
      alert(
        "Please enter a valid email and ensure the amount is greater than zero."
      );
      return;
    }

    // Make a request to Paystack to initialize the transaction
    fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer sk_test_5a5faf9874f7b920d19e6378f4c135902a0e32b5", // Use Bearer token format
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        amount: amount,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // Handle HTTP errors
          return response.json().then((errorData) => {
            throw new Error(`Error: ${errorData.message}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.status) {
          // Step 2: Complete transaction with access_code
          const handler = PaystackPop.setup({
            key: "pk_test_b6c0ff0c4a7768659fe6b3ae7cf76d9569ba4bba", // Replace with your Paystack public key
            email: email,
            amount: amount,
            currency: "NGN", // Currency code
            ref: data.data.reference, // Unique reference for the transaction
            onClose: function () {
              alert("Transaction was not completed, window closed.");
            },
            callback: function (response) {
              // Step 3: Verify transaction status (optional)
              alert(
                "Payment successful! Transaction ID: " + response.reference
              );
            },
          });
          handler.openIframe();
        } else {
          console.error("Transaction initialization failed:", data.message);
          alert("Transaction initialization failed: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error initializing transaction:", error);
        alert("Error initializing transaction: " + error.message);
      });
  }

  const smModal = document.getElementById("summary_modal");

  // Pay button function
  function successfulPayment() {
    if (document.getElementById("S_tick").checked) {
      payWithPaystack();
      pModal.classList.toggle("show");
      smModal.classList.toggle("show");
    } else if (document.getElementById("D_tick").checked) {
      alert("DECLINED, card has been declined.");
    } else {
      alert("Try success or disabled");
    }
  }

  // Pay button
  const payBtn = document.getElementById("test_btn");
  payBtn.addEventListener("click", successfulPayment);

  //summary Modal
  function summaryModal() {
    const name = document.getElementById("nameID");
    const nameTag = document.getElementById("name_tag");

    nameTag.textContent = name.value;

    const cartRows = document.querySelectorAll(".t_r_body"); // Select all rows in the original table
    const table = document.getElementById("section_table_2"); // Target table for new rows

    // Loop through each row in the original table
    cartRows.forEach((cartRow, index) => {
      const tr = document.createElement("tr");
      tr.classList.add("sm_r_body");

      // Get the data from the original table row
      const smName = cartRow.querySelector(".t_d_name").textContent; // Assuming this class exists in each row
      const smQuantity = cartRow.querySelector(".td_no").textContent; // Assuming this class exists in each row

      // Create a serial number based on the index
      const smContent = index + 1;

      // Populate the new row with data
      tr.innerHTML = `
            <td class="sm_d_body">${smContent}</td>
            <td class="sm_d_body">${smName}</td>
            <td class="sm_d_body">${smQuantity}</td>
        `;

      // Append the new row to the summary table
      table.appendChild(tr);
    });
  }

  payBtn.addEventListener("click", summaryModal);

  // sumamry button
  const summaryButton = document.getElementById("sm_btn");
  summaryButton.addEventListener("click", () => {
    location.reload();
  });
});
