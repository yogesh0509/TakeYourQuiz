async function refresh_token() {
    const response = await fetch("/projectRoutes/refresh_token");
    const users = await response.json();
    return users;
}

let return_AuthHeader = refresh_token();
let clock_variable = solution_obj = '';
let flag = false, total_marks = 0, total_correct_answers = 0, next_answer = 1;
let result_map = new Map();

setInterval(() => {
    return_AuthHeader = refresh_token();

}, 900000 - 500);

function pagination_item(ele, status) {
    let bg_color, text_color = "light";
    let reg_bg = /bg-([a-z])*/;
    let reg_text = /text-([a-z])*/;
    if (status === "active") {
        bg_color = "dark";
    }
    else if (status === "inactive") {
        bg_color = "light";
        text_color = "dark";
    }
    else if (status === 0) {
        bg_color = "danger";
    }
    else if (status === 1) {
        bg_color = "success";
    }
    else {
        bg_color = "secondary";
    }
    if (!reg_bg.test(ele.classList)) {
        ele.classList.add(`bg-${bg_color}`);
        ele.classList.add(`text-${text_color}`);
    }
    else {
        ele.className = ele.className.replace(reg_bg, `bg-${bg_color}`);
        ele.className = ele.className.replace(reg_text, `text-${text_color}`);
    }
}

function project_name() {
    let string = window.location.href;
    let index_start = string.indexOf("dashboard");
    let index_end = string.indexOf("start");
    return string.slice(index_start + 10, index_end - 1);
}
async function fetch_all() {
    const token_header = await return_AuthHeader;
    const table_name = await project_name();
    data = { 'table_name': table_name };
    params = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token_header.refresh_token
        },
        body: JSON.stringify(data)
    }
    const response = await fetch("/projectRoutes/fetch_config", params);
    const users = await response.json();
    return users;
}

function call_timer() {
    let min = parseInt(sessionStorage.getItem("min"));
    let sec = parseInt(sessionStorage.getItem("sec"));
    clock_variable = setInterval(clock, 1000);
    function clock() {
        const timer = document.getElementById("countdown");
        if (min === 1 && sec === 0) {
            timer.innerHTML = min + '   :   0' + sec;
            min = 0;
            sec = 59;
        }
        else if (min === 0 && sec === 0) {
            timer.innerHTML = min + '   :   0' + sec;
            flag = true;
            clearInterval(clock_variable);

        }
        else if (sec === 0) {
            timer.innerHTML = min + '   :   0' + sec;
            min--;
            sec = 59;
        }
        else {
            if (sec < 10) {
                timer.innerHTML = min + '   :   0' + sec;
            }
            else {
                timer.innerHTML = min + '   :   ' + sec;
            }
            sec--;
        }
    }
}

function check_answer(event) {
    if (flag == true) {
    }
    else {
        flag = true;
        var correct_answer = solution_obj[next_answer];
        var given_answer = event.value;
        var given_answer_button = event;
        var correct_answer_button = document.getElementById(correct_answer);

        if (given_answer == correct_answer) {
            result_map.set(next_answer.toString(), {
                'given_answer': given_answer,
                'correct_answer': correct_answer,
                'status': 1
            });
            given_answer_button.style.backgroundColor = "green";
            total_correct_answers++;
            total_marks += 4;
        }
        else {
            result_map.set(next_answer.toString(), {
                'given_answer': given_answer,
                'correct_answer': correct_answer,
                'status': 0
            });
            given_answer_button.style.backgroundColor = "red";
            correct_answer_button.style.backgroundColor = "green";
            total_marks--;
        }
        document.getElementById("score_marks").innerHTML = total_marks;
        document.getElementById("score_correct_questions").innerHTML = total_correct_answers;
        clearInterval(clock_variable);
    }
}

// function* return_answer(answer_arr) {
//     for (ele of answer_arr) {
//         yield* ele
//     }
// }

function next_question() {
    clearInterval(clock_variable);
    flag = false;

    if (next_answer < sessionStorage.getItem("total_questions")) {

        pagination_item(document.getElementById('page-bar').children[next_answer].firstChild, "active");
        pagination_item(document.getElementById('page-bar').children[next_answer - 1].firstChild, "inactive");

        if (!result_map.get(next_answer.toString())) {
            result_map.set(next_answer.toString(), {
                'given_answer': null,
                'correct_answer': solution_obj[next_answer],
                'status': 2
            });
        }
        call_timer();
        next_answer++;

        for (btn of document.querySelectorAll(".option")) {
            if (btn.style.backgroundColor) {
                btn.style.removeProperty("background-color");
            }
        }
    }

    else {
        let i = 0;
        let header = document.getElementById("page-bar").children;
        while (i < sessionStorage.getItem("total_questions")) {
            pagination_item(header[i].firstChild, result_map.get((i + 1).toString()).status)
            i++;
        }
        document.getElementById("next").remove();
    }
}

function save_result() {
    url = "/projectRoutes/save_result";
    return_AuthHeader.then((token_header) => {
        let map_arr = {};
        result_map.forEach((val, key)=>{
            map_arr[key] = JSON.stringify(val);
        });
        let data = {
            'table_name': project_name(),
            "answer": map_arr,
            "total_marks": total_marks,
            "total_correct_answers": total_correct_answers
        };

        params = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'authorization': "bearer " + token_header.refresh_token
            },
            body: JSON.stringify(data)
        }
        fetch(url, params).then(response => response.json())
            .then(data => {
                if(!data.error){
                    window.location.href = window.location.href.slice(0,-5)+'result';
                }
            });
    });
}

function show_pdf(question_url, project_name) {
    fetch("/projectRoutes/adobe_api_key").then(response => response.json())
        .then(data => {
            if (window.AdobeDC) {
                var adobeDCView = new AdobeDC.View({ clientId: data.key, divId: "adobe-dc-view" });
                adobeDCView.previewFile({
                    content: { location: { url: question_url } },
                    metaData: { fileName: project_name + ".pdf" }
                }, { embedMode: "SIZED_CONTAINER" });
            }
        })
}

function page_bar(length) {
    let i = 0;
    while (i < length) {
        i++;
        let header = document.getElementById('page-bar');
        let list_child = document.createElement('li');
        let navigator = document.createElement('a');
        list_child.classList.add('page-item');
        list_child.classList.add('m-1');
        if (i == 1) { pagination_item(navigator, 'active') }
        else { pagination_item(navigator, 'inactive') }
        navigator.classList.add('page-link');
        navigator.classList.add('rounded');

        navigator.innerHTML = i;
        list_child.appendChild(navigator);
        header.insertBefore(list_child, header.lastChild);
    }
    sessionStorage.setItem("total_questions", i);
}

(async () => {
    const users = await fetch_all();
    solution_obj = users.data.configurations.solution;
    sessionStorage.setItem('min', users.data.configurations.time.min);
    sessionStorage.setItem('sec', users.data.configurations.time.sec);
    Promise.all([show_pdf(users.data.configurations.pdf_url, users.data.configurations.project_name), page_bar(users.data.configurations.total_questions), call_timer()]);
})();