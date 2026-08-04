import { calculateStats } from '@/utils/beadPattern.js'

const PROJECTS_KEY = 'perler_projects_v1'
const MAX_PROJECTS = 24

function readProjects() {
  try {
    const value = uni.getStorageSync(PROJECTS_KEY)
    return Array.isArray(value) ? value : []
  } catch (error) {
    console.error('读取作品失败', error)
    return []
  }
}

function writeProjects(projects) {
  uni.setStorageSync(PROJECTS_KEY, projects.slice(0, MAX_PROJECTS))
}

export function listProjects() {
  return readProjects().sort((left, right) => right.updatedAt - left.updatedAt)
}

export function getProject(projectId) {
  return readProjects().find((project) => project.id === projectId)
}

export function saveProject(project) {
  const projects = readProjects()
  const nextProject = {
    ...project,
    stats: calculateStats(project.grid, project.paletteId),
    updatedAt: Date.now()
  }
  const index = projects.findIndex((item) => item.id === project.id)
  if (index >= 0) {
    projects.splice(index, 1, nextProject)
  } else {
    projects.unshift(nextProject)
  }
  writeProjects(projects.sort((left, right) => right.updatedAt - left.updatedAt))
  return nextProject
}

export function deleteProject(projectId) {
  writeProjects(readProjects().filter((project) => project.id !== projectId))
}

export function renameProject(projectId, title) {
  const project = getProject(projectId)
  if (!project) return null
  return saveProject({ ...project, title })
}

export function getProjectProgress(project) {
  const total = project.width * project.height
  const done = Array.isArray(project.completedCells) ? project.completedCells.length : 0
  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0
  }
}
