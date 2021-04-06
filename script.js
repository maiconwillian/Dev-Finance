const Modal = {
  open() {
    //Abrir Modal
    // Adicionar a class active ao modal
    document.querySelector(".modal-overlay").classList.add("active")

  },
  close() {
    //fechar o modal
    // remover a class active do modal
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

const Storage = {
  get() {
     return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },

  set(transactions) {
     localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
  }
}

const Transaction = {
  all: Storage.get(),

  add(transaction){
      Transaction.all.push(transaction)

      App.reload()

      },

  remove(index) {

      Transaction.all.splice(index, 1)

      App.reload()

    },

  incomes() {
      let income = 0;      //pegar todas as transacoes
      // para cada transacao
      Transaction.all.forEach(transaction =>{
      // se ela for maior que zero
        if(transaction.amount > 0){
      //somar a uma variavel e retornar a variavel
        income += transaction.amount;
        }
        })
     
             return income;
      },
  expenses() {
      let expense = 0
      //pegar todas as transacoes
      // para cada transacao
      Transaction.all.forEach(transaction =>{
      // se ela for menor  que zero
        if(transaction.amount < 0){
      //somar a uma variavel e retornar a variavel
        expense += transaction.amount;
      }
      })
              return expense;
      },
  total() {
   let total =Transaction.incomes() + Transaction.expenses();
    if(total < 0){
    document.querySelector('div.card.total').style.background='red';
    return total;  
    }else
    document.querySelector('div.card.total').style.background='#49AA26';
    return total;     
      }
}

const DOM = {
    TransactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction,index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHtmlTransaction(transaction,index)
        DOM.TransactionsContainer.appendChild(tr)
        tr.dataset.index = index

    },

    innerHtmlTransaction (transaction, index) {
            const CSSclass = transaction.amount > 0 ? "income" : "expense"

            const amount = Utils.formatCurrency(transaction.amount)
            
            const html = `
            <td class="descripton">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date"> ${transaction.date}</td>
            <td>
            <img onclick ="Transaction.remove(${index})" src="./img/minus.svg" alt="Remover Transação">
            </td>
            `
            return html
        },

    updateBalance(){
      document
      .getElementById("incomeDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
      document
      .getElementById("expenseDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
      document
      .getElementById("totalDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.total())
     
    },
    
    clearTransactions() {
      DOM.TransactionsContainer.innerHTML = ""
    }
}

const Utils = {
      formatAmount(value){
        value = Number(value) * 100

        return Math.round(value)
      },

      formatDate(date) {
      const splittedDate = date.split("-")
      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`   
      },

      formatCurrency(value){
          const signal = String(value) < 0 ? '-' : ''

          value = String(value).replace(/\D/g,"")

          value = Number(value) / 100

          value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })
         return  signal + value
      }
}

const Form = {
  description: document.getElementById('description'),
  amount: document.getElementById('amount'),
  date: document.getElementById('date'),

  getValues () {
      return{
          description: Form.description.value,
          amount: Form.amount.value,
          date: Form.date.value
  }
},

  validateFields(){
    //verificar todas as informações foram preenchidas
    const { description, amount, date} = Form.getValues()
    
    if(description.trim() ==="" ||
    amount.trim() === "" ||
    date.trim() === ""){
          throw new Error("Por Favor, preencha todos os campos")
    }
  
  },

  formatValues() {
  //Formatar os dados para salvar
    let{ description, amount, date} = Form.getValues()
  
      amount = Utils.formatAmount(amount)

      date = Utils.formatDate(date)

      return {
          description,
          amount,
          date
      }
  
},
saveTransaction(transaction){
   Transaction.add(transaction)

},
  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""

},
  
  submit(event) {
    event.preventDefault()
  
    try{
      Form.validateFields()

      //Formatar os dados para salvar
      const transaction = Form.formatValues()

      //Salvar
     Form.saveTransaction(transaction)

     //Apagar os dados do formulario
     Form.clearFields()

     //Modal fechar
     Modal.close()

     //Atualizar a aplicação ja esta no dentro do Transaction add. App.reload()
     // toda vez que adiciona ele da um reload

      } catch(error) {
          alert(error.message)
      }
  }
}




const App = {

  init() {

  Transaction.all.forEach((transaction,index) => {
        DOM.addTransaction(transaction, index)
      
  })
  
  DOM.updateBalance()

  Storage.set(Transaction.all)

  },
  reload() {
    DOM.clearTransactions()
    App.init()

  },
}

App.init()

