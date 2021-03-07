const {shell} = require('electron')
let readerJs
const fs = require('fs')

 readerJs = fs.readFile(`${__dirname}/reader.js`,(err,data)=>{
     readerJs  = data.toString()
 })

let items = document.getElementById('items')

exports.storage = JSON.parse(localStorage.getItem("readit-items"))||[]

exports.save = ()=>{
    localStorage.setItem('readit-items',JSON.stringify(this.storage))
}

exports.select = (e)=>{
    if(document.getElementsByClassName('read-item selected')[0]){
        document.getElementsByClassName('read-item selected')[0].classList.remove('selected')
    }
    e.currentTarget.classList.add('selected')
}

exports.delete = (index)=>{
    items.removeChild(items.childNodes[index])
    this.storage.splice(index,1)
    this.save()
    if(this.storage.length){
        let newSelectedIndex = (index===0)?0:index-1
        document.getElementsByClassName('read-item')[newSelectedIndex].classList.add('selected')
    }
}

window.addEventListener('message',(e)=>{
    if(e.data.action === 'delete-reader-item'){
        this.delete(e.data.itemIndex)
        e.source.close()
    }
})

exports.getSelectedItem = ()=>{
    let currentItem = document.getElementsByClassName('read-item selected')[0]
    let itemIndex = 0
    let child = currentItem
    while ((child=child.previousElementSibling)!=null) {
        itemIndex++
    }

    return {
        node:currentItem,index:itemIndex
    }
}

exports.changeSelection = direction=>{
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    if(direction==='ArrowUp' && currentItem.previousElementSibling){
        currentItem.classList.remove('selected')
        currentItem.previousElementSibling.classList.add('selected')
    }

    if(direction==='ArrowDown' && currentItem.nextElementSibling){
        currentItem.classList.remove('selected')
        currentItem.nextElementSibling.classList.add('selected')
    }

}

exports.open = ()=>{
    let selectedItem = this.getSelectedItem()
    let contentUrl = selectedItem.node.dataset.url
    let readerWindow=window.open(contentUrl,'',`maxWidth=2000,maxHeight=2000,width=1200,height=800,backgroundColor=#DEDEDE,nodeIntegration=0,contextIsolation=1`)
    readerWindow.eval(readerJs.replace('"{{index}}"',selectedItem.index))
}

exports.openNative = ()=>{
    let selectedItem = this.getSelectedItem()
    let contentUrl = selectedItem.node.dataset.url
    shell.openExternal(contentUrl)

}

exports.addItem = (item,isNew=false)=>{
    let itemNode = document.createElement('div')
    itemNode.setAttribute('class','read-item')
    itemNode.setAttribute('data-url',item.url)
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`
    itemNode.addEventListener('click',this.select)
    itemNode.addEventListener('dblclick',this.open)
    items.appendChild(itemNode)
    if(isNew){
        this.storage.push(item)
        this.save()
    }

    if(document.getElementsByClassName('read-item').length===1){
        itemNode.classList.add('selected')
    }


}

this.storage.forEach(item=>{
    this.addItem(item)
})