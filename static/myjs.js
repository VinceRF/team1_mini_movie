function post() {
    # 리뷰 작성
    let comment = $("#comment").val()
    let today = new Date().toISOString()
    let url2 = $('#url').val()
    if (url2.includes('movie.naver.com/movie/bi/mi/basic.naver?code')) {
         url = $('#url').val()
    } else {
        alert('유효한 url이 아닙니다!')
    }
    let nickname = $('#nickname').val()
    let star = $('#star').val()

    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            comment_give: comment,
            date_give: today,
            url_give:url,
            star_give: star,
            nickname_give:nickname
        },
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        }
    })
}

function get_posts(username) {
    # 리뷰 
    if (username == undefined) {
        username = ""
    }
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_posts?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)
                    let title = post['title']
                    let star = post['star']
                    let image = post['image']
                    let desc = post['desc']
                    let comment = post['comment']
                    let url = post['url']
                    let star_image = '⭐'.repeat(star)

                    let class_heart = post['heart_by_me'] ? "fa-heart": "fa-heart-o"
                    let class_down = post['down_by_me'] ? "fa-thumbs-down": "fa-thumbs-o-down"
                    let class_like = post['like_by_me'] ? "fa-thumbs-up" : "fa-thumbs-o-up"

                    let html_temp = `<div class="box" id="${post["_id"]}" style="width:350px; margin:100px auto 10px auto; background-color:white">
                                        <div class="box-top">
                                        <img src="${image}">
                                        <strong class="card-title" style="cursor: pointer; color: #020202;font-size: 20px" onclick="openInNewTab('${url}');">${title}</strong>
                                        <p class="card-text">${desc}</p>
                                        </div>
                                        <p style="margin-top:10px;"> 
                                        <nav class="level is-mobile">
                                                                     ${star_image} 
                                                                      <div class="level-left">
                                                   
                                                        <a class="level-item is-sparta" aria-label="like" onclick="toggle_like('${post['_id']}', 'like')">
                                                            <span class="icon is-small"><i class="fa ${class_like}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(post["count_like"])}</span>
                                                        </a>                                                   
                                                        <a class="level-item is-sparta" aria-label="down" onclick="toggle_like('${post['_id']}', 'down')">
                                                            <span class="icon is-small"><i class="fa ${class_down}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(post["count_down"])}</span>
                                                        </a>
                                                        
                                                    </div>

                                                </nav>
                                                </p>

                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="/user/${post['username']}">
                                                    <img class="is-rounded" src="/static/${post['profile_pic_real']}"
                                                         alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <strong>${post['profile_name']}</strong> <small>@${post['username']}</small> <small>${time_before}</small>
                                                        <br>
                                                        ${comment}
                                                    </p>
                                                </div>
                                               
                                            </div>
                                        </article>
                                    </div>`
                    $("#post-box").append(html_temp)
                }
            }
        }
    })
}



function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}

function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='${type}']`)
    let $i_like = $a_like.find("i")
    let class_s = {"down": "fa-thumbs-down", "like": "fa-thumbs-up"}
    let class_o = {"down": "fa-thumbs-o-down", "like": "fa-thumbs-o-up"}
    if ($i_like.hasClass(class_s[type])) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass(class_o[type]).removeClass(class_s[type])
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass(class_s[type]).removeClass(class_o[type])
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}
