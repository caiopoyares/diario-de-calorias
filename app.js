//UI ctrl
const dataCtrl = (function() {
  const data = {
    total: 0,
    items: []
  }


  function Item(alimento, porcao, calorias) {
    this.alimento = alimento,
    this.porcao = porcao,
    this.calorias = calorias;
    this.caloriasTotais = calorias * porcao;
    this.id = -1;
    this.porcentagem = -1;
  }

  Item.prototype.calcPercentage = function(caloriasGerais) {
    this.porcentagem = Math.round((this.caloriasTotais / caloriasGerais) * 100);
  }


  return {
    testing: function() {
      return data;
    },
    addNewItem: function(obj) {
      // parameter is an object with alimento, porcao e calorias
      // 1. instantiate new item
      const item = new Item(obj.alimento, obj.porcao, obj.calorias);
      if(data.items.length === 0) {
        item.id = 1;
      } else {
        item.id = data.items[data.items.length - 1].id + 1;
      }
      data.items.push(item);
      return item;
    },
    calcTotalCalories: function() {
      // Loop through all items total calories
      let sum = 0;
      data.items.forEach((item) => {
        sum += item.caloriasTotais;
      });
      data.total = sum;
      return data.total;
    },
    calcPercentage: function(caloriasTotais) {
      const percentages = [];
      // totals calories of the item divided by total calories
      data.items.forEach((item) => {
        item.calcPercentage(caloriasTotais);
        percentages.push(item.porcentagem);
      });
      return percentages;
    },
    deleteItem(itemId) {
      const id = parseInt(itemId.slice(5));
      data.items.forEach((item, index) => {
        if(item.id === id) {
          data.items.splice(index, 1);
        }
      });
    }
  }
})();





//Data ctrl
const uiCtrl = (function() {

  const DOMStrings = {
    registrarBtn: '.registrar-btn',
    inputAlimento: '#input-alimento',
    inputPorcao: '#input-porcao',
    inputCalorias: '#input-calorias',
    lista: '#lista',
    caloriasTotais: '.calorias-totais',
    itemPercentage: '.item-percentage'
  }

  return {
    getDOMStrings: function() {
      return DOMStrings;
    },
    getInput: function() {
      return {
        alimento: document.querySelector(DOMStrings.inputAlimento).value,
        porcao: parseFloat(document.querySelector(DOMStrings.inputPorcao).value),
        calorias: parseFloat(document.querySelector(DOMStrings.inputCalorias).value)
      }
    },
    clearInputFields: function() {
      document.querySelector(DOMStrings.inputAlimento).value = '';
      document.querySelector(DOMStrings.inputPorcao).value = '',
      document.querySelector(DOMStrings.inputCalorias).value = '';
      document.querySelector(DOMStrings.inputAlimento).focus();
    },
    displayItem: function(item) {
      // Create new element
      let row = document.createElement('tr');

      // insert new class
      row.id = `item-${item.id}`;

      // Create inner html
      row.innerHTML = 
      `<td>${item.alimento}</td>
      <td>${item.porcao}</td>
      <td>${item.calorias}</td>
      <td class='item-total-calorie'>${item.caloriasTotais}<div class='item-percentage'></div></td>
      <td><span class="delete">&times;</span></td>`;
      
      // Append child
      document.querySelector(DOMStrings.lista).appendChild(row);
    },
    displayTotalCalories(total) {
      document.querySelector(DOMStrings.caloriasTotais).textContent = `${total} cal`;
    },
    displayPercentage(porcentagens) {
      const uiPercentages = document.querySelectorAll(DOMStrings.itemPercentage);
      for(let i = 0; i < uiPercentages.length; i++) {
        uiPercentages[i].textContent = `${porcentagens[i]}%`;
      }
    },
    deleteItem: function(item) {
      item.remove();
    }
  }
})();




// App controller
const AppController = (function(dataCtrl, uiCtrl) {

  const DOM = uiCtrl.getDOMStrings();

  const loadEventListeners = function() {
    document.querySelector(DOM.registrarBtn).addEventListener('click', addItem);
    document.querySelector('#lista').addEventListener('click', deleteItem);
  }

  const addItem = function(e) {
    e.preventDefault();
    // 1. get the input fields
    const input = uiCtrl.getInput();
    if(input.alimento === '' || isNaN(input.porcao) || isNaN(input.calorias)) {
      return null;
    } else {
      // 2. create new object 
      const newItem = dataCtrl.addNewItem(input);
      // 3. calculate total calories
      const totalCalories = dataCtrl.calcTotalCalories();
      // 4. clear fields and focus on first input again
      uiCtrl.clearInputFields();
      // 5. display in the UI
      uiCtrl.displayItem(newItem);
      // 6. display total calories
      uiCtrl.displayTotalCalories(totalCalories);
      // 7. calculate item percentage
      const porcentagens = dataCtrl.calcPercentage(totalCalories);
      // 8. display item percentage
      uiCtrl.displayPercentage(porcentagens);
    }

  }

  const deleteItem = function(e) {
    const item = e.target.parentNode.parentNode;
    if(e.target.classList.contains('delete')) {
      // delete item from data structure
      dataCtrl.deleteItem(item.id);
      // delete item from UI
      uiCtrl.deleteItem(item);
      // recalculate total calories
      const totalCalories = dataCtrl.calcTotalCalories();
      // redisplay total calories
      uiCtrl.displayTotalCalories(totalCalories);
      // recalculate item percentages
      const porcentagens = dataCtrl.calcPercentage(totalCalories);
      // redisplay item percentages
      uiCtrl.displayPercentage(porcentagens);
    }
  }


  return {
    init: function() {
      loadEventListeners();
    }
  }
})(dataCtrl, uiCtrl);

AppController.init();