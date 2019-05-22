var $jq = jQuery.noConflict()

var x = document.querySelector("#myCheck");
if(x) {
    x.addEventListener('change', function(e){
        var x = e.target.checked
        var pId = document.querySelector("#projId").value;
        $jq.post(`${location.origin}/activate/${pId}`, {
            isActive: x,
        })
    })
}

//DELETE PROJECTS
async function removeproject(event) {
    console.log(event.detail)
    // let isBool = confirm('Are you you want to DELETE?')
    // if (isBool) {
    //     var data = await fetch(`${location.origin}/v2/project/del/${projId}`)
    //     var res = await data
    //     if (res.redirected) {
    //         location.href = res.url
    //     }
    // }
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


const signUpButton = document.querySelector('#signUp');
const signInButton = document.querySelector('#signIn');
const containers = document.querySelector('#login-container');

signUpButton && signUpButton.addEventListener('click', () => {
    containers.classList.add('right-panel-active');
});

signInButton && signInButton.addEventListener('click', () => {
    containers.classList.remove('right-panel-active');
});


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

var kfield = document.querySelectorAll('[data-name="kfield"]')
kfield.forEach((_kfield) => {
    // console.log(_kfield.innerText)
    _kfield.innerText = digs(_kfield.innerText)
})

function digs(str) {
    var thousand = 1000
    var million = 1000000
    var billion = 1000000000

    if (str < thousand) return String(str)

    if (str >= thousand && str <= million) {
        return Math.round(str / thousand) + "K"
    }

    if (str >= million && str <= 1000000000) {
        return Math.round(str / million) + "M"
    }
    if (str >= billion && str <= 10000000000) {
        return Math.round(str / billion) + "B"
    }
}

function aliasName(title, alias) {
    var titles = $jq('#' + title).val()
    console.log(titles)
    var txt = titles.split(' ')
    // /(\s).+\s/
    var change = document.getElementById(alias)
    if (txt[txt.length - 1] === txt[0]) {
        change.value = String(`${txt[0]}`).toLowerCase()
    } else {
        change.value = String(`${txt[0]}-${txt[txt.length-1]}`).toLowerCase()
    }
}