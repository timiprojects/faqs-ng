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
async function Delete(projId, catId, link, qId) {
    let isBool = confirm('Are you sure you want to DELETE?')
    if(isBool) {
        var data = await fetch(`${location.origin}/v2/project/${projId}/${link}/${catId}`, 
        { method: 'DELETE', body: qId}
        )
        var res = await data
        if(res.redirected) {
            location.href = res.url
        }
    }
}

function generateKey () {
    var arr = "ABCDEFGHIJKLMNOPRSTUVWXYZ123456789abcdefghijlmnopqrstuvwxyz-_";
    var elem = document.getElementById('seckey');
    var char = arr.length;
    var x = "";
    for (var i = 0; i < 10; i++) {
        x += arr.charAt(Math.round(Math.random() * char))
        
    }
    elem.value = x
}

function genCode (pId, usrId) {
    var elem = document.getElementById('seckey')
    var codebase = document.querySelector("[name='codebase']")
    if(elem.value && !elem.value.length < 10 && pId !== '' && usrId !== '') {
        //console.log(elem.value)
        codebase.innerHTML = `
        <iframe src="${location.origin}/v2/${pId}/${elem.value}/${usrId}" style="display:block;width:100%; border: none !important;height:calc(100vh - 100px);"></iframe>
        `
    }
}
