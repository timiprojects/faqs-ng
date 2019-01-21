//DELETE PROJECTS
async function removeproject(projId) {
    let isBool = confirm('Are you you want to DELETE?')
    if(isBool) {
        var data = await fetch(`${location.origin}/v2/project/del/${projId}`, { method: 'DELETE'})
        var res = await data
        if(res.redirected) {
            location.href = res.url
        }
    }
}

//DELETE QUESTIONS OR CATEGORIES
async function Delete(projId, catId, link) {
    let isBool = confirm('Are you sure you want to DELETE?')
    if(isBool) {
        var data = await fetch(`${location.origin}/v2/project/${projId}/${link}/${catId}`, { method: 'DELETE'})
        var res = await data
        if(res.redirected) {
            location.href = res.url
        }
    }
}
