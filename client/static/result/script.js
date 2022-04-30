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
    let index_end = string.indexOf("result");
    return string.slice(index_start + 10, index_end - 1);
}
async function fetch_result() {
    const token_header = await return_AuthHeader;
    const table_name = project_name();
    data = { 'table_name': table_name };
    params = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token_header.refresh_token
        },
        body: JSON.stringify(data)
    }
    const response = await fetch("/projectRoutes/fetch_result", params);
    const users = await response.json();
    return users;
}

function clear_result() {
    url = "/projectRoutes/clear_result";
    return_AuthHeader.then((token_header) => {
        let data = {
            'table_name': project_name(),
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
            .then(data => console.log(data));
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

function page_bar(answer_map) {

    answer_map.forEach((value, index) => {
        let header = document.getElementById('page-bar');
        let list_child = document.createElement('li');
        let navigator = document.createElement('a');

        list_child.classList.add('page-item');
        list_child.classList.add('m-1');
        pagination_item(navigator, value.status);

        navigator.classList.add('btn');
        navigator.classList.add('page-link');
        navigator.classList.add('rounded');
        navigator.addEventListener('click', () => {

            let parent = document.getElementsByClassName('option_box');
            let children = parent[0].childNodes;
            for (child of children) {
                if (child.style.backgroundColor) {
                    child.style.removeProperty('background-color');
                }
            }
            let given_answer_button = document.getElementById(value.given_answer);
            let correct_answer_button = document.getElementById(value.correct_answer);
            if (given_answer_button === null) {
                correct_answer_button.style.backgroundColor = "#c7c7c7"
            }
            else {
                given_answer_button.style.backgroundColor = "red";
                correct_answer_button.style.backgroundColor = "green";
            }

        })
        navigator.innerHTML = index;
        list_child.appendChild(navigator);
        header.insertBefore(list_child, header.lastChild);
    });

}

(async () => {
    const users = await fetch_result();

    let answer_map = new Map();

    for(let key in users.data.result.answer){
        answer_map.set(key, JSON.parse(users.data.result.answer[key]));
    }
    document.getElementById("score_marks").innerHTML = users.data.result.total_marks;
    document.getElementById("score_correct_questions").innerHTML = users.data.result.total_correct_questions;
    Promise.all([show_pdf(users.data.configurations.pdf_url, project_name()),
    page_bar(answer_map)]);
})();