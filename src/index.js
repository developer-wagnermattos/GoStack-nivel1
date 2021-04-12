const express = require('express')
const { uuid, isUuid } = require('uuidv4')

const app = express();

app.use(express.json())


const projects = []

function logRequests(request, response, next) {
  const { method, url } = request

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel)

  next()

  console.timeEnd(logLabel)

  return

}

function validateProjectId(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Project Id'})
  }

  return next()
}
app.use(logRequests)
app.use('/projects/:id', validateProjectId)

// List Projects
app.get('/projects', (request, response) => {
  const {title } = request.query
  console.log(`Title: ${title}`)

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects
  return response.json(results)
})

//Create project
app.post('/projects', (request, response) => {
  const body = request.body;
  console.log(body)

  const { title, owner} = request.body
  console.log(`Title: ${title}`)
  console.log(`Owner: ${owner}`)

  const project = { id: uuid(), title, owner }
  projects.push(project)

  return response.json(project)
})

//Create project
app.put('/projects/:id', (request, response) => {
  const { id } = request.params
  const projectIndex = projects.findIndex( project => project.id === id)

  if (projectIndex < 0) {
    return response.status(400).json({ error: "project for update not found."})
  }
  


  //console.log(params)
  console.log(`Update Route params: ${id}`)

  const body = request.body;
  console.log(body)

  const {title, owner} = request.body
  console.log(`Title: ${title}`)
  console.log(`Owner: ${owner}`)

  const project = {
    id,
    title,
    owner,
  }

  projects[projectIndex] = project

  return response.json(project)
})

//Create project
app.delete('/projects/:id', (request, response) => {
  const { id } = request.params
  //console.log(params)
  console.log(`Delete Route params: ${id}`)

  const projectIndex = projects.findIndex( project => project.id === id)

  if (projectIndex < 0) {
    return response.status(400).json({ error: "project for delete not found."})
  }
  
  projects.splice(projectIndex,1)

  return response.status(204).send()
})

app.listen(3456, () => {
  console.log("🚀 Back-end started")
})