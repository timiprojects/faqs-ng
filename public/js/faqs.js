const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('login-container');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

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

(function(){
    var kfield = document.querySelectorAll('[data-name="kfield"]')
    kfield.forEach((_kfield) => {
        // console.log(_kfield.innerText)
        _kfield.innerText = digs(_kfield.innerText)
    })
    function digs (str) {
        var thousand = 1000
        var million = 1000000

        if( str < thousand) return String(str)

        if(str >= thousand && str <= million) {
            return Math.round(str/thousand)+"K"
        }

        if(str >= million && str <= 1000000000) {
            return Math.round(str/million)+"M"
        }
    }
})();