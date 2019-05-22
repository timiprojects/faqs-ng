(function () {
    var $jq = jQuery.noConflict();
    var cfg = document.getElementById('myChart').getContext('2d')

    // var SERVER_URL = `${location.origin}`

    
    //var loc = location.pathname.replace("/")
    var loc = location.pathname.split("/").pop()
    var SERVER_URL = location.pathname.replace(loc, '')
    

    $jq.get(SERVER_URL, function(success){
        var {category} = success
        var cat = category.length

        var chart = new Chart(cfg, {
            type: 'bar',
            data: {
                labels: ['Categories', 'Questions'],
                datasets: [{
                    data: [cat, 30],
                    fill: false,
                    borderWidth: 2,
                    borderColor: '#eee',
                    pointRadius: 5
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
    
                        },
                        // type: ''
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        scaleLabel: {
                            labelString: 'Amount (#)',
                            display: true
                        }
                    }]
                },
                tooltips: {
                    intersect: false,
                    callbacks: {
                        label: function (toolTipItem, data) {
                            var label = data.datasets[toolTipItem.datasetIndex].label || ""
                            if (label) {
                                label += ": <br>"
                            }
                            label += parseFloat(toolTipItem.value).toFixed(2)
                            return label
                        }
                    }
                }
            }
    
        })
    })

    
})();