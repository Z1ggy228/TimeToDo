// ======================================================== ToDo List ================================================================
const createTaskBtn = document.querySelector('.create-task-btn')
const createTaskInput = document.querySelector('.create-task-input')

// Кнопки для взаимодействия с задачей
const clearBtn = document.querySelector('.header__clear-btn')
const sortBtn = document.querySelector('.header__sort-btn')

// Рабочее пространство
const taskList = document.querySelector('.task-list')
const resolvedTaskList = document.querySelector('.resolved__tasks-list')
const drawerItems = document.querySelectorAll('.todo__drawer-item')

let activeItem = document.querySelector('.todo__drawer-item.active') // Переменная для отслеживания активного элемента

drawerItems.forEach(item => {
  item.addEventListener('click', () => {
    // Если есть активный элемент, снимаем с него класс
    if (activeItem) activeItem.classList.remove('active')

    // Устанавливаем текущий элемент как активный
    item.classList.add('active')
    activeItem = item // Обновляем активный элемент
  })
})

let currentTab = 'allTime'

const data = {
  allTime: {
    tasks: [],
    doneTasks: [],
  },
  freeTime: {
    tasks: [],
    doneTasks: [],
  },
  workTime: {
    tasks: [],
    doneTasks: [],
  },
  homeTime: {
    tasks: [],
    doneTasks: [],
  },
  favoriteTime: {
    tasks: [],
    doneTasks: [],
  },
}

let currentTabData = data[currentTab]

document.addEventListener('DOMContentLoaded', renderTaskList)

function renderTaskList() {
  const allTasksElements = document.querySelectorAll('.main__list-item')
  allTasksElements.forEach(element => {
    element.remove()
  })

  const tasksFromLS = parseDataFromLocalStorage() ?? data
  Object.assign(data, tasksFromLS)

  if (currentTab === 'allTime') {
    currentTabData.tasks = []
    currentTabData.doneTasks = []

    for (let key in data) {
      if (key !== 'allTime' && key !== 'favoriteTime') {
        currentTabData.tasks = currentTabData.tasks.concat(data[key].tasks)
        currentTabData.doneTasks = currentTabData.doneTasks.concat(data[key].doneTasks)
      }
    }
  } else if (currentTab === 'favoriteTime') {
    currentTabData.tasks = []
    currentTabData.doneTasks = []

    for (let key in data) {
      if (key !== 'allTime' && key !== 'favoriteTime') {
        currentTabData.tasks = currentTabData.tasks.concat(data[key].tasks.filter(task => task.isImportant))
        currentTabData.doneTasks = currentTabData.doneTasks.concat(data[key].doneTasks.filter(task => task.isImportant))
      }
    }
  } else {
    currentTabData = data[currentTab]
  }

  currentTabData.tasks.forEach(element => renderSimpleTask(element))
  currentTabData.doneTasks.forEach(element => renderReadyTask(element))
}

function setDataToLocalStorage() {
  localStorage.setItem('data', JSON.stringify(data))
}

function parseDataFromLocalStorage() {
  return JSON.parse(localStorage.getItem('data'))
}

function doneTask(target) {
  const taskElement = target.closest('.main__list-item')
  const taskId = taskElement.dataset.id

  // Ищем задачу в ее категории
  let taskCategory = null

  for (let category in data) {
    let index = data[category].tasks.findIndex(task => task.id === taskId)
    if (index !== -1) {
      taskCategory = category
      const doneTask = data[category].tasks.splice(index, 1)[0]
      data[category].doneTasks.push(doneTask)
      break
    }
  }

  if (!taskCategory) {
    console.log('Task not found in tasks')
    return
  }

  taskElement.remove()

  // Если текущая вкладка соответствует категории задачи или это «Все задачи» или «Избранное», отображаем задачу в выполненных
  if (currentTab === taskCategory || currentTab === 'allTime' || currentTab === 'favoriteTime') {
    renderReadyTask(data[taskCategory].doneTasks[data[taskCategory].doneTasks.length - 1])
  }

  setDataToLocalStorage()
}

function deleteTask(target, typeTasks) {
  const taskElement = target.closest('.main__list-item')
  const taskId = taskElement.dataset.id

  let taskCategory = null

  for (let category in data) {
    let index = data[category][typeTasks].findIndex(task => task.id === taskId)
    if (index !== -1) {
      taskCategory = category
      data[category][typeTasks].splice(index, 1)
      break
    }
  }

  if (!taskCategory) {
    console.log('Task not found in deleteTask')
    return
  }

  taskElement.remove()

  setDataToLocalStorage()
}

function makeImportantTask(target) {
  const taskElement = target.closest('.main__list-item')
  const taskId = taskElement.dataset.id
  const star = taskElement.querySelector('.star-important')
  star.classList.toggle('star-important-checked')

  let taskCategory = null

  for (let category in data) {
    let task = data[category].tasks.find(task => task.id === taskId)
    if (task) {
      task.isImportant = !task.isImportant
      taskCategory = category
      break
    }
  }

  if (!taskCategory) {
    console.log('Task not found in makeImportantTask')
    return
  }

  if (currentTab === 'favoriteTime' && !task.isImportant) {
    taskElement.remove()
  }

  setDataToLocalStorage()
}

function createTask() {
  const taskText = createTaskInput.value
  if (!taskText) {
    return alert('Вы не написали название задачи!')
  }

  if (currentTab === 'allTime' || currentTab === 'favoriteTime') {
    alert('Пожалуйста, выберите категорию для задачи (Свободное время, Рабочие дела, Домашние дела)')
    return
  }

  const id = Math.random().toString()
  const date = moment().format('DD.MM.YYYY')

  const task = {
    id,
    text: taskText,
    date,
    isImportant: false,
    isChecked: false,
    category: currentTab,
  }

  data[currentTab].tasks.push(task)
  renderSimpleTask(task)

  createTaskInput.value = ''
  createTaskInput.focus()

  setDataToLocalStorage()
}

createTaskBtn.addEventListener('click', createTask)

clearBtn.addEventListener('click', () => {
  const allTasks = document.querySelectorAll('.main__list-item')
  allTasks.forEach(element => {
    element.remove()
  })

  if (currentTab === 'allTime' || currentTab === 'favoriteTime') {
    for (let category in data) {
      if (category !== 'allTime' && category !== 'favoriteTime') {
        data[category].tasks = []
        data[category].doneTasks = []
      }
    }
  } else {
    data[currentTab].tasks = []
    data[currentTab].doneTasks = []
  }

  setDataToLocalStorage()
})

sortBtn.addEventListener('click', () => {
  const allTasks = document.querySelectorAll('.main__list-sort')
  allTasks.forEach(element => {
    element.remove()
  })

  currentTabData.tasks.reverse()

  currentTabData.tasks.forEach(element => {
    renderSimpleTask(element)
  })

  setDataToLocalStorage()
})

function renderSimpleTask(element) {
  const taskComponent = `
  <div class="main__list-item main__list-sort" data-id="${element.id}">
      <input type="checkbox" class="done-btn" onclick="doneTask(this)" />
      <p class="todo__text task-name">${element.text}</p>
      <span class="date-info">${element.date}</span>
      <div class="important">
          <svg 
          class="star-important ${
            element.isImportant ? 'star-important-checked' : ''
          }" onclick="makeImportantTask(this)" width="19" height="19" viewBox="0 0 19 19" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
              d="M7.56642 3.90378C8.3858 1.86108 8.79549 0.839722 9.5 0.839722C10.2045 0.839722 10.6142 1.86108 11.4336 3.90378L11.4717 3.9989C11.9346 5.15293 12.1661 5.72995 12.6378 6.08066C13.1095 6.43138 13.7288 6.48684 14.9672 6.59775L15.1911 6.6178C17.218 6.79933 18.2314 6.89009 18.4483 7.53486C18.6651 8.17964 17.9125 8.86437 16.4073 10.2338L15.9049 10.6909C15.1429 11.3841 14.7619 11.7308 14.5843 12.1851C14.5512 12.2698 14.5237 12.3566 14.5019 12.445C14.3852 12.9186 14.4967 13.4214 14.7199 14.4271L14.7893 14.7402C15.1994 16.5884 15.4044 17.5126 15.0464 17.9112C14.9127 18.0601 14.7388 18.1674 14.5457 18.2201C14.0288 18.3611 13.295 17.7631 11.8273 16.5672C10.8636 15.7819 10.3817 15.3893 9.82848 15.3009C9.61087 15.2662 9.38912 15.2662 9.17151 15.3009C8.61828 15.3893 8.13642 15.7819 7.1727 16.5672C5.70504 17.7631 4.97121 18.3611 4.45433 18.2201C4.26119 18.1674 4.08733 18.0601 3.95355 17.9112C3.59555 17.5126 3.80059 16.5884 4.21067 14.7402L4.28012 14.4271C4.50326 13.4214 4.61482 12.9186 4.4981 12.445C4.47633 12.3566 4.44879 12.2698 4.41566 12.1851C4.23809 11.7308 3.85709 11.3841 3.09511 10.6909L2.59273 10.2338C1.08748 8.86437 0.33485 8.17964 0.551703 7.53486C0.768556 6.89009 1.782 6.79933 3.80889 6.6178L4.03278 6.59775C5.27124 6.48684 5.89046 6.43138 6.36218 6.08066C6.8339 5.72995 7.06536 5.15293 7.52826 3.9989L7.56642 3.90378Z" />
          </svg>
          <svg class="cross-err-btn" onclick="deleteTask(this, 'tasks')" width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
              d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" />
          </svg>
      </div>
  </div>
  `
  taskList.insertAdjacentHTML('beforeend', taskComponent)
}

function renderReadyTask(element) {
  const taskComponent = `
  <div class="main__list-item" data-id="${element.id}">
      <p class="todo__text">${element.text}</p>
      <div class="important">
          <svg class="cross-err-btn" onclick="deleteTask(this, 'doneTasks')" width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" />
          </svg>
      </div>
  </div>
  `
  resolvedTaskList.insertAdjacentHTML('beforeend', taskComponent)
}

drawerItems.forEach(item => {
  item.addEventListener('click', () => {
    currentTab = item.dataset.type
    renderTaskList()
  })
})

createTaskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    createTask()
  }
})

// Экспортируем функции для доступа из HTML
window.doneTask = doneTask
window.deleteTask = deleteTask
window.makeImportantTask = makeImportantTask
