$(document).ready(function() {
        getEmergency();
        var emergen = window.setInterval('getEmergency()', 5000);
        $('#expert_status').click(function(){toggleStatus();});
        make_nurse_box();
        var status = window.setInterval('get_team_memeber()', 5000);
});

function getEmergency(){
        $.get('/health/expert/emergency-count/',
            function(data){
                if (data.emergencyCount > 0){
                    msg = "个不正常心率";
                    if ( $('#emergency-warning').length < 1){
                        warning = $('<div>').attr({'id':'emergency-warning',
                            "style":"position:fixed;top:0;left:44%;padding:0.8em 0.3em;text-decoration:none;",'class':'alert_error'})
                        $('body').append(warning); 
                    }
                    
                    $('#emergency-warning').html('<strong class="strong" style="margin:0 30px">'+data.emergencyCount+msg+"</strong>");
                    $('#emergency-warning').slideDown(500)
                } else {
                    $('#emergency-warning').hide(0)
                }
                    $('#emergency-warning').click( function(){
                        window.location.href="/health/expert/index/?emergency=1"})
            });
};

function toggleStatus(){
    /*
    $.get('/health/expert/status-toggle/', 
            function(data){
                $('#expert_status').html(data.currentData[1]);
      });*/
    $.ajax({
          type: "GET",
          url: "/health/expert/status-toggle/",
          cache: false
    }).done(function( data ) {
          $('#expert_status').html(data.currentData[1]);
    });
}

function make_nurse_box(){
    var nurse_box = $('<div>').attr({'id':'nurse-box'})
                          .append($('<div>').attr({'id':'nurse-toggle'})
                                            .html('护士状态'));
    var nurse_data = $('<div>').attr({'id':'nurse-data'})
                               .appendTo(nurse_box)
    $('#wrapper').append(nurse_box);
    get_team_memeber();
}
function make_crew_content(crew){
    
    container = $('<p>').addClass('crew-name').html(crew.name)
    state = $('<span>').addClass('fr').html((crew.status == 0 ? '正常': "暂离"))
    if (crew.status == 0){
        state.addClass('ok');
    } else {
        state.addClass('left');
    }
    container.append(state);
    /*
    $.get('/health/expert/check-team-memeber/'+crew.id+"/", function(data){
        modal = $('<div>').attr({'id':'team-status-'+crew.id});
        modal.html(data);
        state.append(modal);
        modal.dialog({autoOpen:false})
        container.click(function(){
            modal.dialog("open");
        });
    });
    */
    return container;
}

var team_memeber_fake_hash = ""
function get_team_memeber(){
    $.get('/health/expert/team-memeber/status',
            function(data){
                fake_hash = ""
                for(var i=0; i<data.team.length;i++){
                    fake_hash += data.team[i].name+data.team[i].status;
                }
                if (fake_hash != team_memeber_fake_hash){
                    $('#nurse-data').html('');
                    if (data.team.length == 0){
                        o = Object();
                        o.name = "暂无护士";
                        o.status  = 0;
                        data.team.push(o);
                    }
                    for(var i=0;i<data.team.length;i++){
                        (make_crew_content(data.team[i])).appendTo('#nurse-data')
                    }
                    team_memeber_fake_hash = fake_hash;
                    $('<p>').attr({'id':'nurse-admin'}).html($('<a>').attr({'href':'/health/expert/team-memeber-admin'}).html('管理护士')).appendTo('#nurse-data')
                }   
            }
            );
}
