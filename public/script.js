const form = document.getElementById('form-produto')
const listaProdutos = document.getElementById('lista-produtos')
const mensagem = document.getElementById('mensagem')
const tituloFormulario = document.getElementById('titulo-formulario')
const btnCancelar = document.getElementById('btn-cancelar')

const inputId = document.getElementById('produto-id')
const inputNome = document.getElementById('nome')
const inputPreco = document.getElementById('preco')
const inputQuantidade = document.getElementById('quantidade')
const inputCategoria = document.getElementById('categoria')

const campoBusca = document.getElementById('campo-busca')

let produtosCarregados = []

function criarCelula(texto) {
  const celula = document.createElement('td')
  celula.textContent = texto
  return celula
}

async function carregarProdutos() {
  const resposta = await fetch('/api/produtos')
  const produtos = await resposta.json()
  produtosCarregados = produtos
  renderizarProdutos(produtos)
}

function renderizarProdutos(produtos) {
  listaProdutos.innerHTML = ''

  produtos.forEach((produto) => {
    const linha = document.createElement('tr')

    linha.appendChild(criarCelula(produto.id))
    linha.appendChild(criarCelula(produto.nome))
    linha.appendChild(criarCelula(`R$ ${Number(produto.preco).toFixed(2)}`))
    linha.appendChild(criarCelula(produto.quantidade))
    linha.appendChild(criarCelula(produto.categoria || '-'))

    const acoes = document.createElement('td')

    const btnEditar = document.createElement('button')
    btnEditar.textContent = 'Editar'
    btnEditar.className = 'editar'
    btnEditar.onclick = () => preencherFormulario(produto)

    const btnExcluir = document.createElement('button')
    btnExcluir.textContent = 'Excluir'
    btnExcluir.className = 'excluir'
    btnExcluir.onclick = () => excluirProduto(produto.id)

    acoes.appendChild(btnEditar)
    acoes.appendChild(btnExcluir)
    linha.appendChild(acoes)

    listaProdutos.appendChild(linha)
  })
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const produto = {
    nome: inputNome.value,
    preco: Number(inputPreco.value),
    quantidade: Number(inputQuantidade.value),
    categoria: inputCategoria.value
  }

  const id = inputId.value
  const url = id ? `/api/produtos/${id}` : '/api/produtos'
  const metodo = id ? 'PUT' : 'POST'

  await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto)
  })

  mensagem.textContent = id
    ? 'Produto atualizado com sucesso!'
    : 'Produto cadastrado com sucesso!'

  limparFormulario()
  carregarProdutos()
})

function preencherFormulario(produto) {
  inputId.value = produto.id
  inputNome.value = produto.nome
  inputPreco.value = produto.preco
  inputQuantidade.value = produto.quantidade
  inputCategoria.value = produto.categoria || ''
  tituloFormulario.textContent = 'Editar Produto'
}

async function excluirProduto(id) {
  const confirmou = confirm('Deseja realmente excluir este produto?')
  if (!confirmou) return

  await fetch(`/api/produtos/${id}`, {
    method: 'DELETE'
  })

  mensagem.textContent = 'Produto excluído com sucesso!'
  carregarProdutos()
}

function limparFormulario() {
  inputId.value = ''
  inputNome.value = ''
  inputPreco.value = ''
  inputQuantidade.value = ''
  inputCategoria.value = ''
  tituloFormulario.textContent = 'Cadastrar Produto'
}

btnCancelar.addEventListener('click', limparFormulario)

campoBusca.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase()
  const filtrados = produtosCarregados.filter((produto) =>
    produto.nome.toLowerCase().includes(termo)
  )
  renderizarProdutos(filtrados)
})

carregarProdutos()