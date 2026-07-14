import Fastify from 'fastify'
import { Pool } from 'pg'

const servidor = Fastify()

const sql = new Pool({
  user: 'postgres',
  password: 'senai', 
  host: 'localhost',
  port: 5432,
  database: 'produtos_db'
})

servidor.get('/', () => {
  return 'Olá! A API de produtos está funcionando corretamente.'
})

servidor.get('/categorias', async () => {
  const resultado = await sql.query('SELECT * FROM categorias ORDER BY id')
  return resultado.rows
})

servidor.post('/categorias', async (request, reply) => {
  const { nome, descricao } = request.body

  if (!nome) {
    return reply.status(400).send({
      error: 'O nome da categoria é obrigatório!'
    })
  }

  await sql.query(
    'INSERT INTO categorias (nome, descricao) VALUES ($1, $2)',
    [nome, descricao]
  )

  return reply.status(201).send({
    mensagem: 'Categoria cadastrada com sucesso!'
  })
})

servidor.put('/categorias/:id', async (request, reply) => {
  const { id } = request.params
  const { nome, descricao } = request.body

  if (!nome) {
    return reply.status(400).send({
      error: 'O nome da categoria é obrigatório!'
    })
  }

  const busca = await sql.query(
    'SELECT * FROM categorias WHERE id = $1',
    [id]
  )

  if (busca.rows.length === 0) {
    return reply.status(404).send({
      error: 'Categoria não encontrada!'
    })
  }

  await sql.query(
    'UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3',
    [nome, descricao, id]
  )

  return {
    mensagem: 'Categoria alterada com sucesso!'
  }
})

servidor.delete('/categorias/:id', async (request, reply) => {
  const { id } = request.params

  const busca = await sql.query(
    'SELECT * FROM categorias WHERE id = $1',
    [id]
  )

  if (busca.rows.length === 0) {
    return reply.status(404).send({
      error: 'Categoria não encontrada!'
    })
  }

  await sql.query(
    'DELETE FROM categorias WHERE id = $1',
    [id]
  )

  return reply.status(204).send()
})

servidor.get('/produtos', async () => {

  const resultado = await sql.query(
    'SELECT * FROM produtos ORDER BY id'
  )

  return resultado.rows
})

servidor.post('/produtos', async (request, reply) => {

  const {
    nome,
    preco,
    quantidade,
    categoria
  } = request.body

  if (!nome || preco == null || quantidade == null) {

    return reply.status(400).send({
      error: 'Nome, preço e quantidade são obrigatórios!'
    })

  }

  await sql.query(
    'INSERT INTO produtos(nome, preco, quantidade, categoria) VALUES ($1, $2, $3, $4)',
    [nome, preco, quantidade, categoria]
  )


  return reply.status(201).send({
    mensagem: 'Produto cadastrado com sucesso!'
  })

})

servidor.put('/produtos/:id', async (request, reply) => {

  const { id } = request.params

  const {
    nome,
    preco,
    quantidade,
    categoria
  } = request.body


  if (!nome || preco == null || quantidade == null) {

    return reply.status(400).send({
      error: 'Nome, preço e quantidade são obrigatórios!'
    })

  }

  await sql.query(
    'UPDATE produtos SET nome=$1, preco=$2, quantidade=$3, categoria=$4 WHERE id=$5',
    [nome, preco, quantidade, categoria, id]
  )


  return {
    mensagem: 'Produto atualizado com sucesso!'
  }

})

servidor.delete('/produtos/:id', async (request, reply) => {

  const { id } = request.params


  await sql.query(
    'DELETE FROM produtos WHERE id=$1',
    [id]
  )


  return reply.status(204).send()

})

servidor.listen({ port: 3000 }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log('Servidor rodando em http://localhost:3000')
})