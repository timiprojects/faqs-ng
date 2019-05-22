var $jq = jQuery.noConflict();

var addressArray ;

window.onload = () => {
    if (navigator.geolocation) {
        //navigator.geolocation.getCurrentPosition(showPosition)
    }else {
        alert('Sorry! Your browser does not support location tracking.')
    }

    // var xhr = new XMLHttpRequest()
    
    // xhr.open('GET', 'https://geoip-db.com/json'),
    // xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

    // xhr.send()

    // xhr.onload = function () {
    //     var response = xhr.responseText
    //     console.log(response)
    // }
}

const myform = document.myname;

var uid = myform.usrid.value;
var pid = myform.projid.value;
var sec = myform.sec.value;



// async function showPosition(position) {
//     var {
//         latitude,
//         longitude
//     } = position.coords
//     //console.log(latitude)
//     //console.log(longitude)
//     var {
//         address
//     } = await hello(latitude, longitude)

//     addressArray.push({
//         device: navigator.userAgent,
//         country: address['country'],
//         country_code: address['country_code'],
//         ip: ''
//     })
// }

// async function hello(lat, lng) {
//     let ml = await $jq.getJSON(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
//     return ml
// }

$jq('[data-name="holder"]').each(function () {
    $jq(this).click(function (e) {
        e.preventDefault()

        var ans = $(this).find('[data-name="answer"]')
        var cid = $(this).find('[name="catid"]').val()
        var qid = $(this).find('[name="qid"]').val()

        var isOpen = ans.hasClass('show') ? false : true
        if (isOpen) {
            var dataObj = addressArray[0]
            var data = {
                sec,
                pid,
                uid,
                cid,
                qid,
                country: dataObj['country'],
                country_code: dataObj['country_code'],
                device: dataObj['device'],
                ip: dataObj['ip'],
            }
            //console.log(dataObj['country'])
            $jq.post(`${location.origin}/v2/track`, data)
        }
    })
})