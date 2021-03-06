function showStatistics(selection) {
    clear()
    const statByType = calcByType(selection)
    getContainer().appendChild(createStatTable('by Type', 'Looks like the selection is empty.', statByType))
}

function clear() {
    const elements = getContainer().getElementsByClassName('stat-list__table')
    for (let i = 0; i < elements.length; i++) {
        elements.item(i).remove()
    }
}

function getContainer() {
    return document.getElementById('stat-container')
}

function createStatTable(title, emptyText, data) {
    const statView = document.createElement('div')
    statView.className = 'stat-list__table'

    const titleView = document.createElement('div')
    titleView.className = 'stat-list__title'
    titleView.innerHTML = `<span>${title}</span>`
    statView.appendChild(titleView)

    if (data.size === 0) {
        const emptyView = document.createElement('div')
        emptyView.className = 'stat-list__empty'
        emptyView.innerText = emptyText
        statView.appendChild(emptyView)
    } else {
        data.forEach((value, key) => {
            let itemView = document.createElement('div')
            itemView.className = 'stat-list__item'
            itemView.innerHTML =
                `<span class="stat-list__item-name">${key.toLowerCase()}</span>` +
                `<span class="stat-list__item-value">${value}</span>`
            statView.appendChild(itemView)
        })
    }
    return statView
}

function calcByType(widgets) {
    return countBy(widgets, (a) => a.type)
}

function countBy(list, keyGetter) {
    const map = new Map()
    list.forEach((item) => {
        const key = keyGetter(item)
        const count = map.get(key)
        map.set(key, !count ? 1 : count + 1)
    })
    return new Map([...map.entries()].sort((a, b) => b[1] - a[1]))
}

async function showAllCards() {

    console.log("getting Cards")
    //await a=miro.board.widgets.get({type:'CARD', title:'<p>s</p>'})
    cards = await miro.board.widgets.get({ type: 'CARD' })
    console.log(cards)
    clear()
    getContainer().appendChild(makeList(cards))
}
function removeTags(str) {
    if ((str===null) || (str===''))
    return false;
    else
    str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
 }

function makeList(cards) {
    const widgetTable=document.createElement('table')
    widgetTable.className = 'stat-list__table'

    //widgetTable.innerHTML=("<tr class='stat-list__title'><th>Type</th><th>Title</th><th>Desc</th><th>Assignee</th></tr>")
    cards.forEach((widget) => {
        let itemLine=document.createElement('tr')
        try {assi=widget.assignee.userId} catch {assi="---"}
        itemLine.innerHTML =               
         `<td class="stat-list__item">${widget.type.substring(0,2)}</td>` +
         `<td class="stat-list__item">${removeTags(widget.title)}</td>` + 
         `<td class="stat-list__item"> ${removeTags(widget.description)}</td>` + 
         `<td class="stat-list__item"> ${assi.substring(assi.length-3,assi.length)}</td>` 
         console.log(itemLine)
        widgetTable.appendChild(itemLine)
    })
    return widgetTable
}

function showAllUsers() {

    console.log('oatk:'+oatk)


    fetch("https://api.miro.com/v1/oauth-token", {
        "method": "GET",
        "headers": {
            "Authorization": "Bearer " + oatk
        }
    })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err);
        });

    // Opens auth popup.
    // To prevent the browser from blocking this popup, only call miro.authorize from a click handler on your domain.
    // Method returns a token you can use to make requests REST API on behalf of the current user.

    // miro.authorize({"response_type":"token"}).then( (result) =>{
    //    console.log('oAuth authorize', result);
    //  })

    console.log('oatk:'+oatk)

    fetch("https://api.miro.com/v1/teams/3074457352877196176/user-connections?limit=10&offset=0", {
        "method": "GET",
        "headers": {
            "Authorization": "Bearer " + oatk
        }
    })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err);
        });
}

oatk = "a"

miro.onReady(() => {

    miro.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
            console.log('Web plugin authorized');
        } else {
            console.log('Unauthorized');
        }
    })

    // Get OAuth token for current user to make requests REST API


    miro.getToken().then((token) => {
        oatk = token
        console.log('oAuth token', oatk);

    })

    miro.addListener('SELECTION_UPDATED', (e) => {
        showStatistics(e.data)
    })
    miro.board.selection.get().then(showStatistics)
})