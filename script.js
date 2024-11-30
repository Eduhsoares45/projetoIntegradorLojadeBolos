const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() { 
  updateCartModal();
  cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
  if(event.target === cartModal){
    cartModal.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function(){
  cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){
  // console.log(event.target)
  let parentButton = event.target.closest(".add-to-cart-btn")

  if(parentButton){
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    addToCart(name, price)
  }

})


// Função para adicionar no carrinho
function addToCart(name, price){
  const existingItem = cart.find(item => item.name === name)

  if(existingItem){
   //Se o item já existe, aumenta apenas a quantidade + 1 
   existingItem.quantity += 1;

  }else{

    cart.push({
      name,
      price,
      quantity: 1,
    })

  }

  updateCartModal()

}


//Atualiza o carrinho
function updateCartModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>


        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>

      </div>
    `

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)

  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;

}


// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")

    removeItemCart(name);
  }

})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];
    
    if(item.quantity > 1){
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();

  }

}


addressInput.addEventListener("input", function(event){
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }


})


// Finalizar pedido
checkoutBtn.addEventListener("click", function(){

  // const isOpen = checkRestaurantOpen();
  // if(!isOpen){

  //   Toastify({
  //     text: "Ops o restaurante está fechado!",
  //     duration: 3000,
  //     close: true,
  //     gravity: "top", // `top` or `bottom`
  //     position: "right", // `left`, `center` or `right`
  //     stopOnFocus: true, // Prevents dismissing of toast on hover
  //     style: {
  //       background: "#ef4444",
  //     },
  //   }).showToast();

  //   return;
  // }

  // if(cart.length === 0) return;
  // if(addressInput.value === ""){
  //   addressWarn.classList.remove("hidden")
  //   addressInput.classList.add("border-red-500")
  //   return;
  // }

  //Enviar o pedido para api whats
  const cartItems = cart.map((item) => {
    return (
      ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = "993008812"

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

  cart = [];
  updateCartModal();

})


// Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
  const data = new Date();
  const hora = data.getHours();
  return hora >= 7 && hora < 17; 
  //true = restaurante está aberto 
}


const spanItem = document.getElementById("date-span")

const isOpen = checkRestaurantOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}




const path = require('path');
const fs = require('fs');

// Função para carregar a configuração do Tailwind
function loadTailwindConfig(configPath) {
    try {
        const config = require(path.resolve(configPath || './tailwind.config.js'));
        return config;
    } catch (error) {
        console.error('Erro ao carregar o arquivo de configuração do Tailwind:', error);
        process.exit(1); // Encerra o processo se a configuração não for carregada
    }
}

const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

// Função que garante que os plugins necessários sejam aplicados
function applyPostcssPlugins(inputCss) {
    const plugins = [autoprefixer]; // Você pode adicionar outros plugins, como o Tailwind CSS

    return postcss(plugins)
        .process(inputCss, { from: undefined }) // O 'from' pode ser ignorado se não houver um arquivo de origem
        .then(result => result.css)
        .catch(error => {
            console.error('Erro ao aplicar os plugins do PostCSS:', error);
            process.exit(1); // Encerra o processo se a aplicação falhar
        });
}


const { exec } = require('child_process');

function compileTailwind(inputFile, outputFile) {
    exec(`npx tailwindcss -i ${inputFile} -o ${outputFile} --minify`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro na compilação do Tailwind: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erro no stderr: ${stderr}`);
            return;
        }
        console.log(`Resultado da compilação: ${stdout}`);
    });
}


const chokidar = require('chokidar');

// Função para monitorar mudanças nos arquivos
function watchFiles(patterns) {
    const watcher = chokidar.watch(patterns, { persistent: true });

    watcher.on('change', (filePath) => {
        console.log(`Arquivo alterado: ${filePath}`);
        // Você pode aqui aplicar correções ou reconstruir os arquivos afetados
    }).on('error', (error) => {
        console.error('Erro no watcher de arquivos:', error);
    });
}

const tailwindConfig = loadTailwindConfig('./tailwind.config.js');

function checkContentPaths(config) {
    if (!config.content || !Array.isArray(config.content)) {
        console.error('Erro: A configuração "content" está incorreta!');
        process.exit(1);
    }
    console.log('Caminhos de conteúdo configurados corretamente:', config.content);
}

checkContentPaths(tailwindConfig);

