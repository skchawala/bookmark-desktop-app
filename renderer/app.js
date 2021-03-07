const {ipcRenderer} = require('electron')
const  items = require('./items')
let showModal = document.getElementById("show-modal")
let closeModal = document.getElementById('cancel-item')
let modal = document.getElementById("modal")
let addItem = document.getElementById('add-item')
let itemUrl = document.getElementById('url')
let search = document.getElementById('search')


ipcRenderer.on('menu-show-modal',()=>{
   showModal.click()
})
ipcRenderer.on('menu-open-item',()=>{
   items.open()
})
ipcRenderer.on('menu-open-item-native',()=>{
    items.openNative()
})

ipcRenderer.on('menu-delete-item',()=>{
    items.delete(items.getSelectedItem().index)
})
ipcRenderer.on('menu-focus-search',()=>{
    search.focus()
})


document.addEventListener('keydown',(e)=>{
    if(e.key === 'ArrowUp'||e.key==='ArrowDown'){
        items.changeSelection(e.key)
    }

})

search.addEventListener('keyup',(e)=>{

    Array.from(document.getElementsByClassName('read-item')).forEach((item)=>{

        const hasMatch =item.innerText.toLowerCase().includes(search.value)
        item.style.display = hasMatch?'flex':'none'
    })

})

const  toggleModalButton = ()=>{
    if(addItem.disabled){
        addItem.disabled=false
        addItem.opacity = 1
        addItem.innerText = 'Add Item'
        closeModal.style.display = 'inline'
    }else {
        addItem.disabled=true
        addItem.opacity = 0.5
        addItem.innerText = 'Adding...'
        closeModal.style.display = 'none'
    }
}


showModal.addEventListener('click',()=>{
    modal.style.display = 'flex'
    itemUrl.focus()
})

closeModal.addEventListener('click',()=>{
    modal.style.display = 'none'
})


addItem.addEventListener('click',()=>{
    if(itemUrl.value){
       ipcRenderer.send('new-item',itemUrl.value)
        toggleModalButton()
    }
})


ipcRenderer.on('new-item-success',(e,newItem)=>{
    items.addItem(newItem,true)
    console.log(newItem)
    toggleModalButton()
    modal.style.display = 'none'
    itemUrl.value = ''
})

itemUrl.addEventListener('keyup',(e)=>{
    if(e.key==='Enter'){
        addItem.click()
    }
})


