//DELETE PROJECTS
async function removeproject(projId) {
    let isBool = confirm('Are you you want to DELETE?')
    if (isBool) {
        var data = await fetch(`${location.origin}/v2/project/del/${projId}`, {
            method: 'DELETE'
        })
        var res = await data
        if (res.redirected) {
            location.href = res.url
        }
    }
}

//DELETE QUESTIONS OR CATEGORIES
async function Delete(projId, catId, link, qId) {
    let isBool = confirm('Are you sure you want to DELETE?')
    if (isBool) {
        var data = await fetch(`${location.origin}/v2/project/${projId}/${link}/${catId}`, {
            method: 'DELETE',
            body: qId
        })
        var res = await data
        if (res.redirected) {
            location.href = res.url
        }
    }
}



function genCode() {
    const forms = document.projform
    const proj_id = forms.projid.value
    const usrid = forms.usrid.value

    var arr = "ABCDEFGHIJKLMNOPRSTUVWXYZ123456789abcdefghijlmnopqrstuvwxyz-_";
    var char = arr.length;
    var seckey = "";
    for (var i = 0; i < 10; i++) {
        seckey += arr.charAt(Math.round(Math.random() * char))
    }
}

function generate() {
    const link = document.getElementById('name')

    link.value = location.origin
}

// const basic = document.basic

// async function updateAct (name) {
//     var data = await fetch
// }