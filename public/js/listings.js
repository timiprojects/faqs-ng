var $jq = jQuery.noConflict();
$jq(document).ready(function () {


    const myform = document.myname;

    var uid = myform.usrid.value;
    var pid = myform.projid.value;
    var sec = myform.sec.value;

    $jq('[data-name="holder"]').each(function () {
        $jq(this).click(function (e) {
            e.preventDefault()

            var ans = $(this).find('[data-name="answer"]')
            var cid = $(this).find('[name="catid"]').val()
            var qid = $(this).find('[name="qid"]').val()

            var isOpen = ans.hasClass('show') ? false : true

            if (isOpen) {
                var data = {
                    sec,
                    pid,
                    uid,
                    cid,
                    qid
                }

                $jq.post(`${location.origin}/v2/track`, data, function (response) {
                    console.log(response)
                })
            }
        })
    })

})